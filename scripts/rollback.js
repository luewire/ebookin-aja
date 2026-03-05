#!/usr/bin/env node
/**
 * rollback.js
 * Emergency rollback orchestrator for EbookIn-Aja production.
 *
 * What it does:
 *   1. Shows last N deploy history entries
 *   2. Restores database from the chosen (default: latest) backup
 *   3. Prints the exact `vercel rollback` command for the matching deployment
 *
 * Usage:
 *   node scripts/rollback.js                # interactive, uses latest backup
 *   node scripts/rollback.js --list         # just list history, do nothing
 *   node scripts/rollback.js --dry-run      # simulate restore, no changes
 *   node scripts/rollback.js --db-only      # restore DB, skip Vercel instructions
 *   node scripts/rollback.js --vercel-only  # skip DB restore, print Vercel cmd only
 *   node scripts/rollback.js --n=3          # pick 3rd-last deploy entry (1=latest)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// ─── helpers ─────────────────────────────────────────────────────────────────
const c = {
  reset : '\x1b[0m', bold   : '\x1b[1m',
  green : '\x1b[32m', red   : '\x1b[31m',
  yellow: '\x1b[33m', cyan  : '\x1b[36m',
  grey  : '\x1b[90m', white : '\x1b[97m',
};
const log  = (m) => console.log(m);
const info = (m) => console.log(`${c.cyan}[rollback]${c.reset} ${m}`);
const ok   = (m) => console.log(`${c.green}✔${c.reset} ${m}`);
const warn = (m) => console.log(`${c.yellow}⚠${c.reset} ${m}`);
const fail = (m) => { console.error(`${c.red}✘ ${m}${c.reset}`); process.exit(1); };
const sep  = `${c.grey}${'─'.repeat(60)}${c.reset}`;
const dsep = `${c.grey}${'═'.repeat(60)}${c.reset}`;

function argValue(flag) {
  const entry = process.argv.find(a => a.startsWith(`--${flag}=`));
  return entry ? entry.split('=').slice(1).join('=') : null;
}

const DRY_RUN       = process.argv.includes('--dry-run');
const LIST_ONLY     = process.argv.includes('--list');
const DB_ONLY       = process.argv.includes('--db-only');
const VERCEL_ONLY   = process.argv.includes('--vercel-only');
const N             = parseInt(argValue('n') || '1', 10); // 1 = latest

const BACKUP_DIR    = process.env.BACKUP_DIR || path.join(process.cwd(), '.backups');
const HISTORY_FILE  = path.join(BACKUP_DIR, 'deploy-history.jsonl');
const LATEST_FILE   = path.join(BACKUP_DIR, 'latest.json');

// ─── load history ─────────────────────────────────────────────────────────────
function loadHistory(maxEntries = 20) {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  const lines = fs.readFileSync(HISTORY_FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
  return lines.reverse().slice(0, maxEntries); // newest first
}

function loadBackupHistory(maxEntries = 20) {
  const backupHistFile = path.join(BACKUP_DIR, 'backup-history.jsonl');
  if (!fs.existsSync(backupHistFile)) return [];
  const lines = fs.readFileSync(backupHistFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
  return lines.reverse().slice(0, maxEntries);
}

// ─── display ──────────────────────────────────────────────────────────────────
function printHeader() {
  log(`\n${c.bold}╔══════════════════════════════════════╗${c.reset}`);
  log(`${c.bold}║   EbookIn-Aja  🔄 Rollback Tool      ║${c.reset}`);
  log(`${c.bold}╚══════════════════════════════════════╝${c.reset}`);
  if (DRY_RUN) log(`${c.yellow}  Mode: DRY RUN — no changes will be made${c.reset}`);
  log('');
}

function printHistory(entries) {
  log(`${c.bold}Deploy History (newest first):${c.reset}`);
  log(sep);
  if (entries.length === 0) {
    warn('No deploy history found. Run: node scripts/pre-deploy.js before deploying.');
    return;
  }
  entries.forEach((e, i) => {
    const marker = i === 0 ? ` ${c.green}← current${c.reset}` : i === N - 1 ? ` ${c.yellow}← TARGET${c.reset}` : '';
    log(`  ${c.bold}[${i + 1}]${c.reset} ${e.timestamp.slice(0, 19).replace('T', ' ')} — ${c.cyan}${e.git?.branch || '?'}@${(e.git?.commit || '').slice(0, 8)}${c.reset} "${e.git?.message || e.label}"${marker}`);
    if (e.backup) {
      log(`       backup: ${c.grey}${path.basename(e.backup.file)} (${e.backup.method})${c.reset}`);
    } else {
      log(`       ${c.yellow}no backup recorded${c.reset}`);
    }
  });
  log('');
}

function printBackupStatus() {
  const backups = loadBackupHistory(5);
  log(`${c.bold}Last 5 Backups:${c.reset}`);
  log(sep);
  if (backups.length === 0) {
    warn('No backups found. Run: node scripts/db-backup.js');
  } else {
    backups.forEach((b, i) => {
      const sizeKb = b.sizeBytes ? `${(b.sizeBytes / 1024).toFixed(1)} KB` : '?';
      log(`  [${i + 1}] ${b.createdAt?.slice(0, 19).replace('T', ' ')} — ${c.cyan}${path.basename(b.file)}${c.reset} (${b.method}, ${sizeKb})`);
    });
  }
  log('');
}

// ─── restore DB ──────────────────────────────────────────────────────────────
function restoreDatabase(backupFile) {
  if (!backupFile) {
    // Fallback: use latest.json pointer
    if (!fs.existsSync(LATEST_FILE)) {
      fail('No backup to restore from. Run: node scripts/db-backup.js first.');
    }
    const meta = JSON.parse(fs.readFileSync(LATEST_FILE, 'utf8'));
    backupFile = meta.file;
  }

  if (!fs.existsSync(backupFile)) {
    fail(`Backup file not found: ${backupFile}`);
  }

  info(`Restoring from: ${path.basename(backupFile)}`);
  const args = [`scripts/db-restore.js`, `--file=${backupFile}`];
  if (DRY_RUN) args.push('--dry-run');

  const result = spawnSync('node', args, { stdio: 'inherit' });
  if (result.status !== 0) {
    fail('Database restore failed. See above for details.');
  }
  ok('Database restore complete');
}

// ─── Vercel rollback guidance ─────────────────────────────────────────────────
function printVercelInstructions(targetEntry) {
  log(dsep);
  log(`${c.bold}${c.white}  VERCEL DEPLOYMENT ROLLBACK${c.reset}`);
  log(dsep);
  log('');
  log(`  ${c.cyan}# Step 1 — List recent deployments to find the one to roll back to:${c.reset}`);
  log(`  npx vercel ls --prod`);
  log('');
  log(`  ${c.cyan}# Step 2a — Roll back to the PREVIOUS deployment (one click):${c.reset}`);
  log(`  npx vercel rollback`);
  log('');
  log(`  ${c.cyan}# Step 2b — Roll back to a SPECIFIC deployment URL:${c.reset}`);
  log(`  npx vercel rollback <deployment-url>`);
  log('');
  if (targetEntry?.git?.commit && targetEntry.git.commit !== 'unknown') {
    log(`  ${c.cyan}# Step 2c — Find the deployment for commit ${targetEntry.git.commit.slice(0, 8)}:${c.reset}`);
    log(`  npx vercel ls --prod | grep "${targetEntry.git.commit.slice(0, 8)}"`);
    log('');
  }
  log(`  ${c.cyan}# Step 3 — Verify rollback:${c.reset}`);
  log(`  SMOKE_BASE_URL=https://your-app.vercel.app node scripts/smoke-test.js`);
  log('');
  log(dsep);
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  printHeader();

  const history        = loadHistory(10);
  const targetEntry    = history[N - 1] || null;
  const targetBackup   = targetEntry?.backup?.file || null;

  printHistory(history);
  printBackupStatus();

  if (LIST_ONLY) {
    info('--list mode: exiting without changes.');
    return;
  }

  // Show what we will do
  log(sep);
  if (targetEntry) {
    info(`Target deploy: ${targetEntry.timestamp?.slice(0, 19).replace('T', ' ')} — ${targetEntry.git?.branch}@${(targetEntry.git?.commit || '').slice(0, 8)}`);
    info(`Backup : ${targetBackup ? path.basename(targetBackup) : '(will use latest.json)'}`);
  } else {
    info('No target deploy found — will use latest backup from latest.json');
  }
  log(sep);
  log('');

  // Step 1 — restore DB
  if (!VERCEL_ONLY) {
    log(`${c.bold}Step 1: Restore Database${c.reset}`);
    log(sep);
    restoreDatabase(targetBackup);
    log('');
  } else {
    warn('--vercel-only: skipping database restore');
  }

  // Step 2 — Vercel instructions
  if (!DB_ONLY) {
    log(`${c.bold}Step 2: Rollback Vercel Deployment${c.reset}`);
    printVercelInstructions(targetEntry);
  }

  // Summary
  log(`\n${c.green}${c.bold}  Rollback procedure complete.${c.reset}`);
  log(`  ${c.grey}Run smoke test to verify: npm run smoke-test${c.reset}\n`);
}

main().catch((e) => {
  console.error(`${c.red}Rollback script crashed: ${e.message}${c.reset}`);
  process.exit(1);
});
