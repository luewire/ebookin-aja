#!/usr/bin/env node
/**
 * smoke-test.js
 * Pre-release smoke test for EbookIn-Aja.
 *
 * Usage:
 *   node scripts/smoke-test.js                      # default: http://localhost:3000
 *   SMOKE_BASE_URL=https://staging.example.com node scripts/smoke-test.js
 *   SMOKE_TIMEOUT=10000 node scripts/smoke-test.js  # custom timeout (ms)
 *
 * Exit code 0  = all critical tests passed
 * Exit code 1  = one or more critical tests failed
 */

'use strict';

const BASE_URL = (process.env.SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const TIMEOUT  = parseInt(process.env.SMOKE_TIMEOUT || '8000', 10);

// ─── colour helpers ────────────────────────────────────────────────────────
const c = {
  reset : '\x1b[0m',
  bold  : '\x1b[1m',
  green : '\x1b[32m',
  red   : '\x1b[31m',
  yellow: '\x1b[33m',
  cyan  : '\x1b[36m',
  grey  : '\x1b[90m',
};
const ok   = `${c.green}✔ PASS${c.reset}`;
const fail = `${c.red}✘ FAIL${c.reset}`;
const warn = `${c.yellow}⚠ WARN${c.reset}`;
const sep  = `${c.grey}${'─'.repeat(60)}${c.reset}`;

// ─── fetch wrapper ─────────────────────────────────────────────────────────
async function request(method, path, { body, headers = {}, expectStatus } = {}) {
  const url = `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const init = {
      method,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...headers },
    };
    if (body !== undefined) init.body = JSON.stringify(body);

    const res = await fetch(url, init);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch (_) { /* not JSON */ }

    return { ok: true, status: res.status, json, text };
  } catch (err) {
    return { ok: false, status: null, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

// ─── assertion helpers ─────────────────────────────────────────────────────
let passed = 0, failed = 0, warned = 0;

function assert(label, condition, detail = '', critical = true) {
  if (condition) {
    console.log(`  ${ok}  ${label}`);
    passed++;
  } else if (!critical) {
    console.log(`  ${warn}  ${label}${detail ? `  ${c.grey}(${detail})${c.reset}` : ''}`);
    warned++;
  } else {
    console.log(`  ${fail}  ${label}${detail ? `  ${c.grey}(${detail})${c.reset}` : ''}`);
    failed++;
  }
}

function assertEq(label, actual, expected, critical = true) {
  const pass = actual === expected;
  assert(label, pass, pass ? '' : `expected ${expected}, got ${actual}`, critical);
}

function section(title) {
  console.log(`\n${c.bold}${c.cyan}▶ ${title}${c.reset}`);
  console.log(sep);
}

// ══════════════════════════════════════════════════════════════════════════════
//  TESTS
// ══════════════════════════════════════════════════════════════════════════════

async function testHealthCheck() {
  section('1. Health Check (server up + DB read)');

  const r = await request('GET', '/api/healthz');
  assert('Server reachable', r.ok, r.error || '');
  if (!r.ok) return; // no point continuing

  assertEq('HTTP 200', r.status, 200);
  assert('Status field is "ok"', r.json?.status === 'ok', `got: ${r.json?.status}`);
  assert('Database check is "ok"', r.json?.checks?.database === 'ok', `got: ${r.json?.checks?.database}`);
  assert('Uptime present', typeof r.json?.uptime === 'number');
  assert('Timestamp present', !!r.json?.timestamp);
}

async function testDatabaseWrite() {
  section('2. Database Write Probe');

  const r = await request('POST', '/api/healthz', { body: { probe: 'write' } });
  assert('Server reachable', r.ok, r.error || '');
  if (!r.ok) return;

  assertEq('HTTP 200', r.status, 200);
  assert('Write probe "ok"', r.json?.write === 'ok', `got: ${r.json?.write}`);
}

async function testMainApis() {
  section('3. Main API Endpoints (DB read)');

  // — Ebooks
  const ebooks = await request('GET', '/api/ebooks?page=1&limit=5');
  assert('GET /api/ebooks reachable', ebooks.ok, ebooks.error || '');
  assertEq('GET /api/ebooks → 200', ebooks.status, 200);
  assert('Ebooks array in response', Array.isArray(ebooks.json?.ebooks), `got: ${JSON.stringify(ebooks.json)?.slice(0, 80)}`);

  // — Categories
  const cats = await request('GET', '/api/categories');
  assert('GET /api/categories reachable', cats.ok, cats.error || '');
  assertEq('GET /api/categories → 200', cats.status, 200);
  assert('Categories array in response', Array.isArray(cats.json?.categories), `got: ${JSON.stringify(cats.json)?.slice(0, 80)}`);

  // — Banners
  const banners = await request('GET', '/api/banners');
  assert('GET /api/banners reachable', banners.ok, banners.error || '');
  assertEq('GET /api/banners → 200', banners.status, 200);
  assert('Banners array in response', Array.isArray(banners.json?.banners), `got: ${JSON.stringify(banners.json)?.slice(0, 80)}`);
}

async function testLoginFlow() {
  section('4. Auth / Login Flow');

  // — /api/auth/me without token → 401
  const meNoToken = await request('GET', '/api/auth/me');
  assert('GET /api/auth/me is reachable', meNoToken.ok, meNoToken.error || '');
  assertEq('GET /api/auth/me without token → 401', meNoToken.status, 401);

  // — /api/auth/me with garbage token → 401
  const meBadToken = await request('GET', '/api/auth/me', {
    headers: { Authorization: 'Bearer garbage.token.invalid' },
  });
  assertEq('GET /api/auth/me with invalid token → 401', meBadToken.status, 401);
}

async function testRegisterFlow() {
  section('5. Register Flow');

  // — /api/auth/register → 400 (Firebase-only, expected redirect message)
  const reg = await request('POST', '/api/auth/register', { body: {} });
  assert('POST /api/auth/register reachable', reg.ok, reg.error || '');
  assertEq('POST /api/auth/register → 400 (Firebase-only)', reg.status, 400);
  assert(
    'Response contains Firebase hint',
    typeof reg.json?.hint === 'string' || typeof reg.json?.error === 'string',
    `got: ${JSON.stringify(reg.json)?.slice(0, 120)}`
  );

  // — /api/auth/sync with invalid token → 401
  const sync = await request('POST', '/api/auth/sync', {
    body: { idToken: 'INVALID_FIREBASE_TOKEN' },
  });
  assert('POST /api/auth/sync reachable', sync.ok, sync.error || '');
  assertEq('POST /api/auth/sync with bad token → 401', sync.status, 401);
}

async function testUploadGuard() {
  section('6. Upload — Auth Guard');

  // POST /api/upload without auth → must be 401
  const r = await request('POST', '/api/upload', {
    body: {},
    headers: { 'Content-Type': 'application/json' }, // intentionally wrong, but hits auth check first
  });
  assert('POST /api/upload reachable', r.ok, r.error || '');
  assert(
    'POST /api/upload without auth → 401 or 400',
    r.status === 401 || r.status === 400,
    `got: ${r.status} — ${JSON.stringify(r.json)?.slice(0, 80)}`,
    false // warn only, not critical — Content-Type mismatch may cause 400
  );
}

async function testSearchApi() {
  section('7. Search API');

  const r = await request('GET', '/api/search?q=test');
  assert('GET /api/search reachable', r.ok, r.error || '');
  assert(
    'GET /api/search → 200 or 404',
    r.status === 200 || r.status === 404,
    `got: ${r.status}`,
    false // warn if unexpected status
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  RUNNER
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${c.bold}╔══════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}║           EbookIn-Aja Smoke Test                         ║${c.reset}`);
  console.log(`${c.bold}╚══════════════════════════════════════════════════════════╝${c.reset}`);
  console.log(`${c.grey}  Target : ${BASE_URL}${c.reset}`);
  console.log(`${c.grey}  Timeout: ${TIMEOUT}ms per request${c.reset}`);
  console.log(`${c.grey}  Date   : ${new Date().toISOString()}${c.reset}`);

  await testHealthCheck();
  await testDatabaseWrite();
  await testMainApis();
  await testLoginFlow();
  await testRegisterFlow();
  await testUploadGuard();
  await testSearchApi();

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log(`\n${c.bold}${'═'.repeat(60)}${c.reset}`);
  console.log(`${c.bold}  RESULTS${c.reset}`);
  console.log(`${'─'.repeat(60)}`);
  console.log(`  ${c.green}Passed : ${passed}${c.reset}`);
  if (warned > 0) console.log(`  ${c.yellow}Warned : ${warned}${c.reset}`);
  console.log(`  ${failed > 0 ? c.red : c.grey}Failed : ${failed}${c.reset}`);
  console.log(`${'═'.repeat(60)}`);

  if (failed > 0) {
    console.log(`\n${c.red}${c.bold}  ✘ Smoke test FAILED — ${failed} critical check(s) did not pass.${c.reset}`);
    console.log(`${c.red}  Do NOT release until all critical checks pass.${c.reset}\n`);
    process.exit(1);
  } else {
    console.log(`\n${c.green}${c.bold}  ✔ Smoke test PASSED${warned > 0 ? ` (${warned} warning(s))` : ''} — safe to release.${c.reset}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(`\n${c.red}Smoke test runner crashed: ${err.message}${c.reset}\n`);
  process.exit(1);
});
