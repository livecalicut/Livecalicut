#!/usr/bin/env node
/**
 * Lightweight smoke checks for public listing APIs + auth gates.
 * Usage: node scripts/smoke-flow.mjs [baseUrl]
 */
const BASE = process.argv[2] || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function check(path, expectOk = true) {
  const url = `${BASE}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, { cache: 'no-store' });
    const ms = Date.now() - started;
    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    const ok = expectOk ? res.ok : true;
    const success = body?.success !== false || body?.data !== undefined;
    const pass = ok && (body == null || success || res.status === 401 || res.status === 403);
    console.log(
      `${pass ? '✓' : '✗'} ${res.status} ${ms}ms  ${path}` +
        (body?.meta?.total != null ? `  (total=${body.meta.total})` : '')
    );
    return pass;
  } catch (err) {
    console.log(`✗ ERR  ${path}  ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

async function main() {
  console.log(`Smoke flow against ${BASE}\n`);
  const results = [];

  for (const path of [
    '/api/v1/locations?limit=5',
    '/api/v1/jobs?page=1&limit=5',
    '/api/marketplace?page=1&limit=5',
    '/api/properties?page=1&limit=5',
    '/api/v1/businesses?page=1&limit=5',
  ]) {
    results.push(await check(path));
  }

  // Auth-required POSTs should reject anonymous callers
  for (const path of [
    '/api/businesses/review',
    '/api/jobs/save',
    '/api/marketplace/favorite',
    '/api/properties/favorite',
  ]) {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    });
    const pass = res.status === 401 || res.status === 400;
    console.log(`${pass ? '✓' : '✗'} ${res.status}  POST ${path} (guest blocked)`);
    results.push(pass);
  }

  const failed = results.filter((r) => !r).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}

main();
