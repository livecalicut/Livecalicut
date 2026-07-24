import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './load-env.mjs';

loadEnv();

const TABLES = [
  'cities',
  'areas',
  'roles',
  'profiles',
  'user_roles',
  'settings',
  'business_categories',
  'businesses',
  'job_categories',
  'companies',
  'jobs',
  'news_categories',
  'news',
];

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('\nLiveCalicut — Supabase connection check\n');
  console.log(`URL:          ${url ? '✓ set' : '✗ missing'}`);
  console.log(`Anon key:     ${anon ? '✓ set' : '✗ missing'}`);
  console.log(`Service role: ${service ? '✓ set' : '✗ missing (needed for seed/admin)'}`);

  if (!url || (!anon && !service)) {
    console.error('\nMissing credentials. Copy .env.example → .env and fill values.\n');
    process.exit(1);
  }

  const client = createClient(url, service || anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let ok = 0;
  let missing = 0;

  for (const table of TABLES) {
    const t0 = Date.now();
    const { error } = await client.from(table).select('id').limit(1);
    const ms = Date.now() - t0;
    if (error) {
      missing += 1;
      console.log(`✗ ${table.padEnd(22)} ${error.message} (${ms}ms)`);
    } else {
      const { count } = await client.from(table).select('*', { count: 'exact', head: true });
      ok += 1;
      console.log(`✓ ${table.padEnd(22)} ${String(count ?? 0).padStart(4)} rows (${ms}ms)`);
    }
  }

  console.log(`\n${ok}/${TABLES.length} tables OK`);
  if (missing > 0) {
    console.log('\nNext: run supabase/bootstrap.sql in the Supabase SQL Editor, then npm run db:seed\n');
    process.exit(2);
  }
  console.log('\nDatabase ready. Open http://localhost:3000/setup\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
