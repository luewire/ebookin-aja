#!/usr/bin/env node
/**
 * db-backup.js
 * Database backup script — two modes:
 *
 *   1. pg_dump  (preferred): produces a .sql file, requires psql client tools in PATH.
 *   2. JSON     (fallback) : queries critical tables via Prisma, saves as .json.
 *
 * Output directory : .backups/  (created automatically)
 * Env override     : BACKUP_DIR=/path/to/dir
 *
 * Usage:
 *   node scripts/db-backup.js
 *   node scripts/db-backup.js --mode=json    # force JSON export
 *   node scripts/db-backup.js --mode=pgdump  # force pg_dump (error if not available)
 *   node scripts/db-backup.js --label=pre-deploy-v2.1.0
 */

'use strict';

const fs      = require('fs');
const path    = require('path');
const { execSync, spawnSync } = require('child_process');

// ─── env loading ──────────────────────────────────────────────────────────────
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

// ─── helpers ──────────────────────────────────────────────────────────────────
const c = {
  reset : '\x1b[0m', bold  : '\x1b[1m',
  green : '\x1b[32m', red  : '\x1b[31m',
  yellow: '\x1b[33m', cyan : '\x1b[36m', grey: '\x1b[90m',
};
const log  = (m) => console.log(m);
const info = (m) => console.log(`${c.cyan}[backup]${c.reset} ${m}`);
const ok   = (m) => console.log(`${c.green}✔${c.reset} ${m}`);
const err  = (m) => console.error(`${c.red}✘${c.reset} ${m}`);

// ─── paths ────────────────────────────────────────────────────────────────────
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), '.backups');
fs.mkdirSync(BACKUP_DIR, { recursive: true });

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
}

function argValue(flag) {
  const entry = process.argv.find(a => a.startsWith(`--${flag}=`));
  return entry ? entry.split('=').slice(1).join('=') : null;
}

const forceMode  = argValue('mode');   // 'json' | 'pgdump'
const label      = argValue('label') || '';
const TS         = timestamp();
const baseName   = label ? `${TS}_${label.replace(/[^a-zA-Z0-9._-]/g, '_')}` : TS;

// ─── pg_dump mode ─────────────────────────────────────────────────────────────
function hasPgDump() {
  const r = spawnSync('pg_dump', ['--version'], { encoding: 'utf8' });
  return r.status === 0;
}

function parseDatabaseUrl(url) {
  // postgresql://user:pass@host:5432/dbname?schema=public
  try {
    const u = new URL(url);
    return {
      host    : u.hostname,
      port    : u.port || '5432',
      user    : decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      dbname  : u.pathname.replace(/^\//, '').split('?')[0],
    };
  } catch {
    return null;
  }
}

async function backupPgDump() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const conn = parseDatabaseUrl(DATABASE_URL);
  if (!conn) throw new Error('Cannot parse DATABASE_URL');

  const outFile = path.join(BACKUP_DIR, `${baseName}.sql`);
  info(`Running pg_dump → ${outFile}`);

  const env = { ...process.env, PGPASSWORD: conn.password };
  const args = [
    '-h', conn.host,
    '-p', conn.port,
    '-U', conn.user,
    '-d', conn.dbname,
    '-F', 'p',        // plain SQL
    '--no-owner',
    '--no-privileges',
    '-f', outFile,
  ];

  const result = spawnSync('pg_dump', args, { env, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`pg_dump exited with code ${result.status}`);

  return { file: outFile, method: 'pgdump', size: fs.statSync(outFile).size };
}

// ─── JSON export mode (Prisma fallback) ───────────────────────────────────────
async function backupJson() {
  info('Prisma JSON export (pg_dump not available)');

  // Use generated Prisma client
  let PrismaClient;
  try {
    PrismaClient = require('../lib/generated-prisma/index.js').PrismaClient;
  } catch {
    throw new Error('Generated Prisma client not found. Run: npm run build (or prisma generate)');
  }

  const client = new PrismaClient({ log: [] });

  info('Connecting to database…');
  await client.$connect();

  info('Exporting tables…');
  const tables = [
    'user', 'subscription', 'transaction', 'ebook', 'category',
    'banner', 'manualOrder', 'review', 'readlist', 'follow',
    'annotation', 'readingProgress', 'readingLog', 'notification',
  ];

  const data = {};
  for (const table of tables) {
    try {
      data[table] = await client[table].findMany();
      info(`  ${table}: ${data[table].length} rows`);
    } catch (e) {
      data[table] = { error: e.message };
      console.log(`  ${c.yellow}⚠ ${table}: skipped (${e.message})${c.reset}`);
    }
  }

  await client.$disconnect();

  const outFile = path.join(BACKUP_DIR, `${baseName}.json`);
  fs.writeFileSync(outFile, JSON.stringify({
    _meta: {
      createdAt  : new Date().toISOString(),
      label,
      method     : 'prisma-json',
      tables     : Object.keys(data),
    },
    data,
  }, null, 2), 'utf8');

  return { file: outFile, method: 'json', size: fs.statSync(outFile).size };
}

// ─── git helpers ─────────────────────────────────────────────────────────────
function gitMeta() {
  try {
    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const dirty  = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
    return { commit, branch, dirty };
  } catch {
    return { commit: 'unknown', branch: 'unknown', dirty: false };
  }
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  log(`\n${c.bold}╔══════════════════════════════════╗${c.reset}`);
  log(`${c.bold}║   EbookIn-Aja  DB  Backup        ║${c.reset}`);
  log(`${c.bold}╚══════════════════════════════════╝${c.reset}`);
  log(`${c.grey}  Output : ${BACKUP_DIR}${c.reset}`);
  log(`${c.grey}  Time   : ${new Date().toISOString()}${c.reset}\n`);

  let result;
  try {
    const usePgDump = forceMode === 'pgdump' || (forceMode !== 'json' && hasPgDump());

    if (usePgDump) {
      result = await backupPgDump();
    } else {
      if (forceMode === 'pgdump') throw new Error('pg_dump not found in PATH');
      result = await backupJson();
    }
  } catch (e) {
    err(`Backup failed: ${e.message}`);
    process.exit(1);
  }

  const git = gitMeta();

  // Write/update latest.json
  const meta = {
    file      : result.file,
    method    : result.method,
    sizeBytes : result.size,
    createdAt : new Date().toISOString(),
    label,
    git,
  };
  fs.writeFileSync(path.join(BACKUP_DIR, 'latest.json'), JSON.stringify(meta, null, 2), 'utf8');

  // Append to history
  const historyFile = path.join(BACKUP_DIR, 'backup-history.jsonl');
  fs.appendFileSync(historyFile, JSON.stringify(meta) + '\n', 'utf8');

  const sizeKb = (result.size / 1024).toFixed(1);
  ok(`Backup complete: ${path.basename(result.file)} (${sizeKb} KB)`);
  ok(`Method : ${result.method}`);
  ok(`Commit : ${git.branch}@${git.commit.slice(0, 8)}${git.dirty ? ' (dirty)' : ''}`);
  log('');
}

main().catch((e) => {
  err(e.message);
  process.exit(1);
});
