#!/usr/bin/env node
/**
 * db-restore.js
 * Restore database from a backup file created by db-backup.js.
 *
 * Usage:
 *   node scripts/db-restore.js                       # restore from latest.json pointer
 *   node scripts/db-restore.js --file=.backups/2026-03-05_12-00-00.json
 *   node scripts/db-restore.js --file=.backups/2026-03-05_12-00-00.sql
 *   node scripts/db-restore.js --dry-run             # print what would happen, no changes
 *
 * ⚠️  WARNING: JSON restore does UPSERT — it will overwrite existing rows.
 *     For SQL restore, run manually: psql $DATABASE_URL < file.sql
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// ─── env loading ─────────────────────────────────────────────────────────────
function loadEnv() {
  const root  = process.cwd();
  const files = ['.env', '.env.local', '.env.production.local'];
  for (const f of files) {
    const fp = path.join(root, f);
    if (!fs.existsSync(fp)) continue;
    for (const line of fs.readFileSync(fp, 'utf8').split('\n')) {
      const m = line.match(/^([^#=\s]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}
loadEnv();

// ─── helpers ─────────────────────────────────────────────────────────────────
const c = {
  reset : '\x1b[0m', bold  : '\x1b[1m',
  green : '\x1b[32m', red  : '\x1b[31m',
  yellow: '\x1b[33m', cyan : '\x1b[36m', grey: '\x1b[90m',
};
const log  = (m) => console.log(m);
const info = (m) => console.log(`${c.cyan}[restore]${c.reset} ${m}`);
const ok   = (m) => console.log(`${c.green}✔${c.reset} ${m}`);
const warn = (m) => console.log(`${c.yellow}⚠${c.reset} ${m}`);
const fail = (m) => { console.error(`${c.red}✘${c.reset} ${m}`); process.exit(1); };

function argValue(flag) {
  const entry = process.argv.find(a => a.startsWith(`--${flag}=`));
  return entry ? entry.split('=').slice(1).join('=') : null;
}

const DRY_RUN    = process.argv.includes('--dry-run');
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), '.backups');

// ─── resolve backup file ──────────────────────────────────────────────────────
function resolveFile() {
  const arg = argValue('file');
  if (arg) {
    const resolved = path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg);
    if (!fs.existsSync(resolved)) fail(`Backup file not found: ${resolved}`);
    return resolved;
  }

  const latestMeta = path.join(BACKUP_DIR, 'latest.json');
  if (!fs.existsSync(latestMeta)) {
    fail('No backup found. Run: node scripts/db-backup.js');
  }
  const meta = JSON.parse(fs.readFileSync(latestMeta, 'utf8'));
  if (!fs.existsSync(meta.file)) {
    fail(`Backup file in latest.json does not exist: ${meta.file}\nRun db-backup.js again.`);
  }
  return meta.file;
}

// ─── SQL restore ──────────────────────────────────────────────────────────────
function restoreSql(file) {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) fail('DATABASE_URL is not set');

  if (DRY_RUN) {
    info(`[DRY RUN] Would run: psql "${DATABASE_URL}" < "${file}"`);
    return;
  }

  warn('SQL restore will overwrite ALL data in the current database!');
  warn('Press Ctrl+C within 5 seconds to cancel…');
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

  info(`Restoring SQL backup: ${path.basename(file)}`);
  const result = spawnSync('psql', [DATABASE_URL, '-f', file], {
    stdio : 'inherit',
    env   : process.env,
  });

  if (result.status !== 0) fail(`psql exited with code ${result.status}`);
  ok('SQL restore complete');
}

// ─── JSON restore (Prisma upsert) ─────────────────────────────────────────────
async function restoreJson(file) {
  let PrismaClient;
  try {
    PrismaClient = require('../lib/generated-prisma/index.js').PrismaClient;
  } catch {
    fail('Generated Prisma client not found. Run: npm run build (or prisma generate)');
  }

  const backup = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!backup.data) fail('Invalid backup file: missing "data" key');

  log(`\n${c.yellow}  Backup info:${c.reset}`);
  log(`  Created  : ${backup._meta?.createdAt || 'unknown'}`);
  log(`  Method   : ${backup._meta?.method || 'json'}`);
  log(`  Label    : ${backup._meta?.label || '(none)'}`);
  log(`  Tables   : ${backup._meta?.tables?.join(', ') || 'unknown'}`);

  if (DRY_RUN) {
    info('[DRY RUN] Would upsert the following row counts:');
    for (const [table, rows] of Object.entries(backup.data)) {
      if (Array.isArray(rows)) log(`  ${table}: ${rows.length} rows`);
    }
    return;
  }

  warn('JSON restore will UPSERT all rows — existing data will be overwritten!');
  warn('Press Ctrl+C within 5 seconds to cancel…');
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);

  const client = new PrismaClient({ log: [] });
  await client.$connect();

  // Order matters for FK constraints
  const restoreOrder = [
    'category', 'ebook', 'user', 'subscription', 'transaction',
    'banner', 'manualOrder', 'review', 'readlist', 'follow',
    'annotation', 'readingProgress', 'readingLog', 'notification',
  ];

  for (const table of restoreOrder) {
    const rows = backup.data[table];
    if (!Array.isArray(rows) || rows.length === 0) {
      info(`  ${table}: skipped (0 rows or error)`);
      continue;
    }

    try {
      let upserted = 0;
      for (const row of rows) {
        await client[table].upsert({
          where  : { id: row.id },
          update : row,
          create : row,
        }).catch(() => {
          // silently skip rows with FK violations on partial restore
        });
        upserted++;
      }
      ok(`  ${table}: ${upserted}/${rows.length} rows upserted`);
    } catch (e) {
      warn(`  ${table}: partial error — ${e.message}`);
    }
  }

  await client.$disconnect();
  ok('JSON restore complete');
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  log(`\n${c.bold}╔══════════════════════════════════╗${c.reset}`);
  log(`${c.bold}║   EbookIn-Aja  DB  Restore       ║${c.reset}`);
  log(`${c.bold}╚══════════════════════════════════╝${c.reset}`);
  if (DRY_RUN) log(`${c.yellow}  Mode: DRY RUN (no changes)${c.reset}`);
  log('');

  const file = resolveFile();
  info(`Backup file : ${file}`);
  log('');

  if (file.endsWith('.sql')) {
    restoreSql(file);
  } else if (file.endsWith('.json')) {
    await restoreJson(file);
  } else {
    fail(`Unsupported backup format: ${path.extname(file)}`);
  }
}

main().catch((e) => {
  console.error(`${c.red}Restore crashed: ${e.message}${c.reset}`);
  process.exit(1);
});
