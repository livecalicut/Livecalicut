/**
 * LiveCalicut — wipe listing/content tables (keep cities, roles, categories, auth users)
 * Run: npm run db:clean
 *
 * Does NOT delete auth.users or demo login accounts.
 * After clean: npm run db:seed && npm run db:seed:users
 */
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './load-env.mjs';

loadEnv();

/** Child → parent order (FK-safe). Reference data kept for re-seed. */
const WIPE_TABLES = [
  'job_applications',
  'reports',
  'notifications',
  'announcement_queue',
  'activity_feed',
  'audit_logs',
  'media_assets',
  'marketplace_items',
  'properties',
  'jobs',
  'news',
  'events',
  'businesses',
  'companies',
  'payments',
  'invoices',
  'subscriptions',
];

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function wipeTable(sb, table) {
  // Delete all rows — use a filter that matches everything (gte created_at epoch)
  const { error, count } = await sb
    .from(table)
    .delete({ count: 'exact' })
    .gte('created_at', '1970-01-01');

  if (error) {
    // Fallback for tables without created_at
    const retry = await sb.from(table).delete({ count: 'exact' }).neq('id', '00000000-0000-0000-0000-000000000000');
    if (retry.error) {
      return { table, ok: false, message: error.message };
    }
    return { table, ok: true, count: retry.count ?? 0 };
  }
  return { table, ok: true, count: count ?? 0 };
}

async function ensureRbac(sb) {
  // Seed Marketing Executive role (required by app RBAC)
  const { error: roleErr } = await sb.from('roles').upsert(
    {
      name: 'Marketing Executive',
      description: 'Field staff — own listings and created users only',
    },
    { onConflict: 'name' }
  );
  if (roleErr) console.log(`⚠ roles Marketing Executive: ${roleErr.message}`);
  else console.log('✓ roles include Marketing Executive');

  // Best-effort: ensure created_by is writable (column may need SQL migration)
  const { error: colProbe } = await sb.from('profiles').select('id, created_by').limit(1);
  if (colProbe) {
    console.log(
      '⚠ profiles.created_by missing — run supabase/migrations/20260727_rbac_creator_scope.sql in SQL Editor'
    );
  } else {
    console.log('✓ profiles.created_by available');
  }
}

async function main() {
  const sb = adminClient();
  console.log('\nLiveCalicut — cleaning content tables…\n');

  await ensureRbac(sb);
  console.log('');

  let wiped = 0;
  let skipped = 0;

  for (const table of WIPE_TABLES) {
    const result = await wipeTable(sb, table);
    if (!result.ok) {
      // Table may not exist in this project — skip quietly
      if (/does not exist|schema cache|Could not find/i.test(result.message || '')) {
        console.log(`· ${table.padEnd(22)} skip (not present)`);
        skipped += 1;
      } else {
        console.log(`✗ ${table.padEnd(22)} ${result.message}`);
        skipped += 1;
      }
    } else {
      console.log(`✓ ${table.padEnd(22)} wiped ${result.count} rows`);
      wiped += 1;
    }
  }

  console.log(`\nClean done: ${wiped} tables wiped, ${skipped} skipped`);
  console.log('Next: npm run db:seed && npm run db:seed:users\n');
}

main().catch((err) => {
  console.error('\nClean failed:', err.message, '\n');
  process.exit(1);
});
