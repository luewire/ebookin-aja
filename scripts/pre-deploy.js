#!/usr/bin/env node
/**
 * pre-deploy.js
 * Run BEFORE every production deploy. Checklist:
 *
 *   1. Checks git working tree (warns if dirty)
 *   2. Takes a database backup (db-backup.js)
 *   3. Records deploy metadata to .backups/deploy-history.jsonl
 *   4. Prints the Vercel deploy command
 *
 * Usage:
 *   node scripts/pre-deploy.js
 *   node scripts/pre-deploy.js --label=v2.1.0
 *   node scripts/pre-deploy.js --skip-backup   # skip DB backup (CI without DB access)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const c = {
  reset : '\x1b[0m', bold  : '\x1b[1m',
  green : '\x1b[32m', red  : '\x1b[31m',
  yellow: '\x1b[33m', cyan : '\x1b[36m', grey: '\x1b[90m',
};
const log  = (m) => console.log(m);
const info = (m) => console.log(`${c.cyan}[pre-deploy]${c.reset} ${m}`);
const ok   = (m) => console.log(`${c.green}✔${c.reset} ${m}`);
const warn = (m) => console.log(`${c.yellow}⚠${c.reset} ${m}`);
const fail = (m) => { console.error(`${c.red}✘${c.reset} ${m}`); process.exit(1); };
const sep  = `${c.grey}${'─'.repeat(60)}${c.reset}`;

function argValue(flag) {
  const entry = process.argv.find(a => a.startsWith(`--${flag}=`));
  return entry ? entry.split('=').slice(1).join('=') : null;
}
const SKIP_BACKUP = process.argv.includes('--skip-backup');
const label       = argValue('label') || '';

const BACKUP_DIR  = process.env.BACKUP_DIR || path.join(process.cwd(), '.backups');
const HISTORY_FILE = path.join(BACKUP_DIR, 'deploy-history.jsonl');

// ─── git helpers ──────────────────────────────────────────────────────────────
function gitInfo() {
  try {
    const commit = execSync('git rev-parse HEAD',             { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD',{ encoding: 'utf8' }).trim();
    const dirty  = execSync('git status --porcelain',         { encoding: 'utf8' }).trim();
    const msg    = execSync('git log -1 --pretty=%s',         { encoding: 'utf8' }).trim();
    return { commit, branch, dirty: dirty.length > 0, message: msg };
  } catch {
    return { commit: 'unknown', branch: 'unknown', dirty: false, message: '' };
  }
}

// ─── steps ────────────────────────────────────────────────────────────────────

function stepGitCheck(git) {
  info(`Branch : ${git.branch}`);
  info(`Commit : ${git.commit.slice(0, 12)} — ${git.message}`);

  if (git.dirty) {
    warn('Working tree is DIRTY (uncommitted changes). Deploy these? Make sure you intended this.');
  } else {
    ok('Working tree is clean');
  }

  if (git.branch !== 'main' && git.branch !== 'master') {
    warn(`Deploying from branch "${git.branch}" (not main/master). Intentional?`);
  } else {
    ok(`Branch: ${git.branch}`);
  }
}

function stepBackup(git) {
  if (SKIP_BACKUP) {
    warn('Skipping DB backup (--skip-backup flag set)');
    return null;
  }

  info('Taking database backup before deploy…');
  const labelArg = label ? `--label=${label || git.commit.slice(0, 8)}` : `--label=pre-deploy_${git.commit.slice(0, 8)}`;
  const result = spawnSync('node', ['scripts/db-backup.js', labelArg], { stdio: 'inherit' });

  if (result.status !== 0) {
    fail('Database backup FAILED — aborting deploy. Fix the backup or use --skip-backup to bypass.');
  }

  // Read backup metadata
  const latestFile = path.join(BACKUP_DIR, 'latest.json');
  if (fs.existsSync(latestFile)) {
    return JSON.parse(fs.readFileSync(latestFile, 'utf8'));
  }
  return null;
}

function stepRecordHistory(git, backupMeta) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const entry = {
    timestamp : new Date().toISOString(),
    label     : label || `commit_${git.commit.slice(0, 8)}`,
    git       : {
      commit : git.commit,
      branch : git.branch,
      dirty  : git.dirty,
      message: git.message,
    },
    backup: backupMeta ? {
      file  : backupMeta.file,
      method: backupMeta.method,
    } : null,
  };

  fs.appendFileSync(HISTORY_FILE, JSON.stringify(entry) + '\n', 'utf8');
  ok(`Deploy recorded in ${HISTORY_FILE}`);
  return entry;
}

function stepPrintRollbackInstructions(entry) {
  log('');
  log(sep);
  log(`${c.bold}  ROLLBACK INSTRUCTIONS (save these)${c.reset}`);
  log(sep);
  log(`  If production breaks, run ONE of:`);
  log('');
  log(`  ${c.cyan}# 1. Instantly rollback Vercel deployment:${c.reset}`);
  log(`  npx vercel rollback`);
  log('');
  log(`  ${c.cyan}# 2. Rollback to previous deploy (specific commit):${c.reset}`);
  log(`  npx vercel rollback [deployment-url-from: vercel ls]`);
  log('');
  log(`  ${c.cyan}# 3. Restore database from this pre-deploy backup:${c.reset}`);
  if (entry.backup?.file) {
    log(`  node scripts/db-restore.js --file="${entry.backup.file}"`);
  } else {
    log(`  node scripts/db-restore.js   # (skipped — no backup available)`);
  }
  log('');
  log(`  ${c.cyan}# 4. Full rollback in one step:${c.reset}`);
  log(`  node scripts/rollback.js`);
  log(sep);
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  log(`\n${c.bold}╔══════════════════════════════════════╗${c.reset}`);
  log(`${c.bold}║   EbookIn-Aja  Pre-Deploy Checklist  ║${c.reset}`);
  log(`${c.bold}╚══════════════════════════════════════╝${c.reset}`);
  log(`${c.grey}  Time : ${new Date().toISOString()}${c.reset}\n`);

  // Step 1 — git
  log(`\n${c.bold}Step 1: Git Status${c.reset}`);
  log(sep);
  const git = gitInfo();
  stepGitCheck(git);

  // Step 2 — backup
  log(`\n${c.bold}Step 2: Database Backup${c.reset}`);
  log(sep);
  const backupMeta = stepBackup(git);

  // Step 3 — record
  log(`\n${c.bold}Step 3: Record Deploy History${c.reset}`);
  log(sep);
  const entry = stepRecordHistory(git, backupMeta);

  // Step 4 — rollback instructions
  stepPrintRollbackInstructions(entry);

  log(`\n${c.green}${c.bold}  ✔ Pre-deploy checklist complete. Safe to deploy.${c.reset}\n`);
  log(`  Run: ${c.cyan}npx vercel --prod${c.reset}\n`);
}

main().catch((e) => {
  console.error(`${c.red}Pre-deploy script crashed: ${e.message}${c.reset}`);
  process.exit(1);
});
