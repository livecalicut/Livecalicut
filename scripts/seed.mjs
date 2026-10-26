/**
 * LiveCalicut — idempotent demo seed (Node + service role)
 * Run: npm run db:seed
 */
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './load-env.mjs';

loadEnv();

const CITY_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
const AREA_PREFIX = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a';
const AREA_CYBER = `${AREA_PREFIX}01`;
const AREA_BEACH = `${AREA_PREFIX}02`;
const AREA_PALAYAM = `${AREA_PREFIX}03`;
const AREA_MAVOOR = `${AREA_PREFIX}04`;
const AREA_MEDICAL = `${AREA_PREFIX}05`;
const CAT_DINING = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001';
const CAT_SHOP = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002';
const CAT_HEALTH = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003';
const CAT_IT = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004';
const CAT_HOTEL = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006';
const JOB_CAT = 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380001';
const NEWS_CAT = 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380001';

function client(preferService = true) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing');
  if (preferService && !service) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for seeding.\n' +
        'Add it from Supabase → Settings → API (service_role), or run supabase/seed.sql in the SQL Editor.'
    );
  }
  const key = preferService ? service : anon;
  if (!key) throw new Error('No Supabase key available');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function probe(label, sb) {
  const { error } = await sb.from('cities').select('id').limit(1);
  return { label, ok: !error, message: error?.message || 'ok', code: error?.code };
}

async function upsert(sb, table, rows, onConflict) {
  const { data, error } = await sb.from(table).upsert(rows, { onConflict }).select('id');
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

async function main() {
  const serviceSb = client(true);
  const anonSb = client(false);

  console.log('\nLiveCalicut — seeding reference data…\n');

  const [serviceProbe, anonProbe] = await Promise.all([
    probe('service_role', serviceSb),
    probe('anon', anonSb),
  ]);

  console.log(`Probe service_role: ${serviceProbe.ok ? '✓' : '✗'} ${serviceProbe.message}`);
  console.log(`Probe anon:         ${anonProbe.ok ? '✓' : '✗'} ${anonProbe.message}`);

  if (!serviceProbe.ok && anonProbe.ok) {
    throw new Error(
      'Anon key can see tables, but service_role cannot.\n' +
        'Your SUPABASE_SERVICE_ROLE_KEY is likely from a different project.\n' +
        'Fix: copy service_role from the SAME project as NEXT_PUBLIC_SUPABASE_URL,\n' +
        'or run supabase/seed.sql in the Supabase SQL Editor.'
    );
  }

  if (!serviceProbe.ok) {
    throw new Error(
      'Tables not visible yet. Run supabase/bootstrap.sql in the SQL Editor, then retry.\n' +
        'Or seed via SQL: supabase/seed.sql'
    );
  }

  const sb = serviceSb;

  await upsert(
    sb,
    'cities',
    [
      {
        id: CITY_ID,
        name: 'Calicut',
        slug: 'kozhikode',
        state: 'Kerala',
        status: 'active',
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ cities');

  const areaSeed = [
    { id: AREA_CYBER, name: 'Cyberpark', slug: 'cyberpark', pincode: '673016', latitude: 11.2712, longitude: 75.8378 },
    { id: AREA_BEACH, name: 'Calicut Beach', slug: 'kozhikode-beach', pincode: '673032', latitude: 11.2588, longitude: 75.7704 },
    { id: AREA_PALAYAM, name: 'Palayam', slug: 'palayam', pincode: '673002', latitude: 11.2551, longitude: 75.7804 },
    { id: AREA_MAVOOR, name: 'Mavoor Road', slug: 'mavoor-road', pincode: '673004', latitude: 11.2645, longitude: 75.7952 },
    { id: AREA_MEDICAL, name: 'Medical College', slug: 'medical-college', pincode: '673008', latitude: 11.2728, longitude: 75.8371 },
    { id: `${AREA_PREFIX}06`, name: 'SM Street', slug: 'sm-street', pincode: '673001', latitude: 11.2497, longitude: 75.7803 },
    { id: `${AREA_PREFIX}07`, name: 'Nadakkavu', slug: 'nadakkavu', pincode: '673011', latitude: 11.2755, longitude: 75.7815 },
    { id: `${AREA_PREFIX}08`, name: 'Kallai', slug: 'kallai', pincode: '673003', latitude: 11.2372, longitude: 75.7846 },
    { id: `${AREA_PREFIX}09`, name: 'Vellayil', slug: 'vellayil', pincode: '673032', latitude: 11.2657, longitude: 75.7742 },
    { id: `${AREA_PREFIX}10`, name: 'Chevayur', slug: 'chevayur', pincode: '673017', latitude: 11.2822, longitude: 75.8069 },
    { id: `${AREA_PREFIX}11`, name: 'Thondayad', slug: 'thondayad', pincode: '673017', latitude: 11.2717, longitude: 75.8175 },
    { id: `${AREA_PREFIX}12`, name: 'Malaparamba', slug: 'malaparamba', pincode: '673009', latitude: 11.2861, longitude: 75.7995 },
    { id: `${AREA_PREFIX}13`, name: 'Pantheerankavu', slug: 'pantheerankavu', pincode: '673019', latitude: 11.2245, longitude: 75.8288 },
    { id: `${AREA_PREFIX}14`, name: 'Beypore', slug: 'beypore', pincode: '673015', latitude: 11.1745, longitude: 75.8081 },
    { id: `${AREA_PREFIX}15`, name: 'West Hill', slug: 'west-hill', pincode: '673005', latitude: 11.2831, longitude: 75.7742 },
    { id: `${AREA_PREFIX}16`, name: 'Karaparamba', slug: 'karaparamba', pincode: '673010', latitude: 11.2688, longitude: 75.7995 },
    { id: `${AREA_PREFIX}17`, name: 'Puthiyara', slug: 'puthiyara', pincode: '673004', latitude: 11.2561, longitude: 75.7902 },
    { id: `${AREA_PREFIX}18`, name: 'Eranhipalam', slug: 'eranhipalam', pincode: '673006', latitude: 11.2884, longitude: 75.7876 },
    { id: `${AREA_PREFIX}19`, name: 'Kottooli', slug: 'kottooli', pincode: '673016', latitude: 11.2769, longitude: 75.8103 },
    { id: `${AREA_PREFIX}20`, name: 'Vengeri', slug: 'vengeri', pincode: '673010', latitude: 11.2646, longitude: 75.8085 },
  ];

  await upsert(
    sb,
    'areas',
    areaSeed.map((area) => ({
      ...area,
      city_id: CITY_ID,
      status: 'active',
      is_active: true,
    })),
    'slug'
  );
  console.log(`✓ areas (${areaSeed.length})`);

  await upsert(
    sb,
    'roles',
    [
      { name: 'Guest', description: 'Unauthenticated public visitor' },
      { name: 'User', description: 'Authenticated resident user' },
      { name: 'Merchant', description: 'Calicut business owner' },
      { name: 'Marketing Executive', description: 'Field staff — own listings and created users only' },
      { name: 'Moderator', description: 'Content moderator' },
      { name: 'City Admin', description: 'City administrator' },
      { name: 'Super Admin', description: 'Platform superuser' },
    ],
    'name'
  );
  console.log('✓ roles');

  await upsert(
    sb,
    'business_categories',
    [
      {
        id: CAT_DINING,
        name: 'Dining & Cafes',
        slug: 'dining-cafes',
        icon_name: 'Utensils',
        display_order: 1,
        status: 'active',
        is_active: true,
      },
      {
        id: CAT_SHOP,
        name: 'Textiles & Shopping',
        slug: 'textiles-shopping',
        icon_name: 'ShoppingBag',
        display_order: 2,
        status: 'active',
        is_active: true,
      },
      {
        id: CAT_HEALTH,
        name: 'Hospitals & Clinics',
        slug: 'hospitals-clinics',
        icon_name: 'Activity',
        display_order: 3,
        status: 'active',
        is_active: true,
      },
      {
        id: CAT_IT,
        name: 'IT & Cyberpark Firms',
        slug: 'it-cyberpark',
        icon_name: 'Laptop',
        display_order: 4,
        status: 'active',
        is_active: true,
      },
      {
        id: CAT_HOTEL,
        name: 'Hotels & Resorts',
        slug: 'hotels-resorts',
        icon_name: 'Hotel',
        display_order: 6,
        status: 'active',
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ business_categories');

  await upsert(
    sb,
    'job_categories',
    [
      {
        id: JOB_CAT,
        name: 'Software Engineering',
        slug: 'software-engineering',
        icon_name: 'Code',
        display_order: 1,
        status: 'active',
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ job_categories');


  await upsert(
    sb,
    'news_categories',
    [
      {
        id: NEWS_CAT,
        name: 'City Updates',
        slug: 'city-updates',
        icon_name: 'Newspaper',
        display_order: 1,
        status: 'active',
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ news_categories');

  await upsert(
    sb,
    'settings',
    [
      {
        key: 'cms',
        description: 'Landing Page CMS Content',
        status: 'active',
        is_active: true,
        value: {
          hero: {
            title: "Calicut's Digital Operating System",
            subtitle:
              'Discover verified local businesses, Cyberpark IT hiring, local news, beach tourism, and classifieds across Calicut.',
            badgeText: 'Hyperlocal Platform • Calicut Verified',
            videoUrl:
              'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-ocean-waves-reaching-the-beach-41481-large.mp4',
          },
        },
      },
    ],
    'key'
  );
  console.log('✓ settings (cms)');

  console.log('\nSeed complete. Recheck: npm run db:check  ·  UI: /setup\n');
}

main().catch((err) => {
  console.error('\nSeed failed:', err.message);
  console.error('If tables are missing, run supabase/bootstrap.sql in the SQL Editor first.\n');
  process.exit(1);
});
