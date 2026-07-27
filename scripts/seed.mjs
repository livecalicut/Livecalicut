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
const COMPANY_ID = 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380001';
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

  console.log('\nLiveCalicut — seeding demo data…\n');

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
        name: 'Kozhikode (Calicut)',
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
    { id: AREA_BEACH, name: 'Kozhikode Beach', slug: 'kozhikode-beach', pincode: '673032', latitude: 11.2588, longitude: 75.7704 },
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
      { name: 'Merchant', description: 'Kozhikode business owner' },
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
    'companies',
    [
      {
        id: COMPANY_ID,
        name: 'Malabar Soft Labs',
        slug: 'malabar-soft-labs',
        description: 'Product engineering studio inside Kozhikode Cyberpark.',
        industry: 'IT & Cyberpark',
        phone: '+91 495 000 1001',
        city_id: CITY_ID,
        logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        status: 'active',
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ companies');

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
    'businesses',
    [
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
        city_id: CITY_ID,
        area_id: AREA_BEACH,
        category_id: CAT_DINING,
        name: 'Beachside Paragon',
        slug: 'beachside-paragon',
        description:
          'Iconic Malabar seafood and biryani near Kozhikode Beach — verified LiveCalicut listing.',
        short_description: 'Malabar seafood · Beach Road',
        phone: '+91 495 000 2001',
        latitude: 11.2588,
        longitude: 75.7704,
        social_media: {
          cover_image:
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        },
        verification_status: 'approved',
        is_verified: true,
        is_featured: true,
        rating_avg: 4.7,
        review_count: 128,
        status: 'active',
        is_active: true,
      },
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
        city_id: CITY_ID,
        area_id: AREA_CYBER,
        category_id: CAT_IT,
        name: 'Cyberpark Hub Cafe',
        slug: 'cyberpark-hub-cafe',
        description: 'Developer hangout and coworking cafe inside Cyberpark campus.',
        short_description: 'Cafe · Cyberpark',
        phone: '+91 495 000 2002',
        latitude: 11.2712,
        longitude: 75.8378,
        social_media: {
          cover_image:
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        },
        verification_status: 'approved',
        is_verified: true,
        is_featured: true,
        rating_avg: 4.5,
        review_count: 64,
        status: 'active',
        is_active: true,
      },
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
        city_id: CITY_ID,
        area_id: AREA_PALAYAM,
        category_id: CAT_SHOP,
        name: 'SM Street Textiles',
        slug: 'sm-street-textiles',
        description: 'Classic Sweet Meat Street textiles and ethnic wear for Kozhikode families.',
        short_description: 'Textiles · Palayam',
        phone: '+91 495 000 2003',
        latitude: 11.2551,
        longitude: 75.7804,
        social_media: {
          cover_image:
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        },
        verification_status: 'approved',
        is_verified: true,
        is_featured: true,
        rating_avg: 4.4,
        review_count: 89,
        status: 'active',
        is_active: true,
      },
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
        city_id: CITY_ID,
        area_id: AREA_MEDICAL,
        category_id: CAT_HEALTH,
        name: 'Malabar Care Clinic',
        slug: 'malabar-care-clinic',
        description: 'Multispecialty outpatient clinic near Medical College with evening OP.',
        short_description: 'Clinic · Medical College',
        phone: '+91 495 000 2004',
        latitude: 11.2728,
        longitude: 75.8371,
        social_media: {
          cover_image:
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        },
        verification_status: 'approved',
        is_verified: true,
        is_featured: true,
        rating_avg: 4.6,
        review_count: 210,
        status: 'active',
        is_active: true,
      },
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
        city_id: CITY_ID,
        area_id: AREA_MAVOOR,
        category_id: CAT_HOTEL,
        name: 'Mavoor Stay Inn',
        slug: 'mavoor-stay-inn',
        description: 'Business hotel on Mavoor Road with easy access to Cyberpark and city centre.',
        short_description: 'Hotel · Mavoor Road',
        phone: '+91 495 000 2005',
        latitude: 11.2645,
        longitude: 75.7952,
        social_media: {
          cover_image:
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        },
        verification_status: 'approved',
        is_verified: true,
        is_featured: false,
        rating_avg: 4.2,
        review_count: 41,
        status: 'active',
        is_active: true,
      },
      {
        id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
        city_id: CITY_ID,
        area_id: AREA_BEACH,
        category_id: CAT_DINING,
        name: 'Zam Zam Mandi House',
        slug: 'zam-zam-mandi-house',
        description: 'Popular Mandi and Arabian platters near the beach stretch.',
        short_description: 'Mandi · Beach',
        phone: '+91 495 000 2006',
        latitude: 11.2595,
        longitude: 75.772,
        social_media: {
          cover_image:
            'https://images.unsplash.com/photo-1555939596-3103bde0ddaa?auto=format&fit=crop&w=800&q=80',
        },
        verification_status: 'approved',
        is_verified: true,
        is_featured: true,
        rating_avg: 4.8,
        review_count: 320,
        status: 'active',
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ businesses');

  await upsert(
    sb,
    'jobs',
    [
      {
        id: 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
        company_id: COMPANY_ID,
        category_id: JOB_CAT,
        title: 'Frontend Engineer (Next.js)',
        slug: 'frontend-engineer-nextjs-cyberpark',
        description: 'Build LiveCalicut-style hyperlocal experiences for Kerala cities.',
        experience: '2+ years',
        salary: '₹45,000 - ₹75,000 / mo',
        salary_type: 'monthly',
        city_id: CITY_ID,
        area_id: AREA_CYBER,
        employment_type: 'full-time',
        status: 'published',
        is_featured: true,
        is_active: true,
      },
      {
        id: 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
        company_id: COMPANY_ID,
        category_id: JOB_CAT,
        title: 'Backend Engineer (Supabase)',
        slug: 'backend-engineer-supabase-cyberpark',
        description: 'Own API routes, RLS policies, and realtime feeds for the city OS.',
        experience: '3+ years',
        salary: '₹55,000 - ₹90,000 / mo',
        salary_type: 'monthly',
        city_id: CITY_ID,
        area_id: AREA_CYBER,
        employment_type: 'full-time',
        status: 'published',
        is_featured: true,
        is_active: true,
      },
      {
        id: 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
        company_id: COMPANY_ID,
        category_id: JOB_CAT,
        title: 'UI Designer (Product)',
        slug: 'ui-designer-product-cyberpark',
        description: 'Design clean hyperlocal flows for merchants, jobs, and city discovery.',
        experience: '2+ years',
        salary: '₹40,000 - ₹65,000 / mo',
        salary_type: 'monthly',
        city_id: CITY_ID,
        area_id: AREA_CYBER,
        employment_type: 'full-time',
        status: 'published',
        is_featured: true,
        is_active: true,
      },
      {
        id: 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
        company_id: COMPANY_ID,
        category_id: JOB_CAT,
        title: 'QA Engineer (Internship)',
        slug: 'qa-engineer-internship-cyberpark',
        description: 'Manual + API testing internship for LiveCalicut release pipelines.',
        experience: 'Fresher',
        salary: '₹15,000 / mo',
        salary_type: 'monthly',
        city_id: CITY_ID,
        area_id: AREA_CYBER,
        employment_type: 'internship',
        status: 'published',
        is_featured: false,
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ jobs');

  await upsert(
    sb,
    'news',
    [
      {
        id: 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
        title: 'Cyberpark expansion brings 2,000 new tech seats',
        slug: 'cyberpark-expansion-2026',
        summary: 'New towers open hiring pipelines across product and services firms.',
        content:
          'Kozhikode Cyberpark announced additional capacity with fresh campus infrastructure, expected to accelerate IT hiring across Malabar.',
        featured_image:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        category_id: NEWS_CAT,
        city_id: CITY_ID,
        area_id: AREA_CYBER,
        status: 'published',
        published_at: new Date().toISOString(),
        is_active: true,
      },
      {
        id: 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
        title: 'Beach Road weekend market returns this Saturday',
        slug: 'beach-road-weekend-market',
        summary: 'Local artisans and food stalls line the beach promenade.',
        content:
          'The Kozhikode Beach weekend market returns with crafts, snacks, and evening music for families.',
        featured_image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        category_id: NEWS_CAT,
        city_id: CITY_ID,
        area_id: AREA_BEACH,
        status: 'published',
        published_at: new Date().toISOString(),
        is_active: true,
      },
      {
        id: 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
        title: 'Mavoor Road signal upgrade cuts peak wait times',
        slug: 'mavoor-road-signal-upgrade',
        summary: 'Adaptive signals go live near key junctions.',
        content:
          'City engineers completed the Mavoor Road signal upgrade aiming to reduce evening congestion toward Cyberpark.',
        featured_image:
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
        category_id: NEWS_CAT,
        city_id: CITY_ID,
        area_id: AREA_MAVOOR,
        status: 'published',
        published_at: new Date().toISOString(),
        is_active: true,
      },
    ],
    'slug'
  );
  console.log('✓ news');

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
            title: "Kozhikode's Digital Operating System",
            subtitle:
              'Discover verified local businesses, Cyberpark IT hiring, local news, beach tourism, and classifieds across Kozhikode.',
            badgeText: 'Hyperlocal Platform • Kozhikode Verified',
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
