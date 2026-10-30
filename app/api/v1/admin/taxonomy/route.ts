import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';

const CATEGORY_TABLES: Record<string, string> = {
  businesses: 'business_categories',
  jobs: 'job_categories',
  marketplace: 'marketplace_categories',
  properties: 'property_categories',
  news: 'news_categories',
};

const GENUINE_MEGAMENU_CATEGORIES = [
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', name: 'Restaurants & Cafés', slug: 'restaurants-cafes', icon_name: 'Utensils', display_order: 1 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', name: 'Tourism & Destinations', slug: 'tourism-destinations', icon_name: 'Palmtree', display_order: 2 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', name: 'Lifestyle & Wellness', slug: 'lifestyle-wellness', icon_name: 'Sparkles', display_order: 3 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', name: 'Shopping & Entertainment', slug: 'shopping-entertainment', icon_name: 'ShoppingBag', display_order: 4 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', name: 'Arts & Culture', slug: 'arts-culture', icon_name: 'Palette', display_order: 5 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', name: 'Business Directory', slug: 'business-directory', icon_name: 'Building2', display_order: 6 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380007', name: 'Local Services', slug: 'local-services', icon_name: 'Wrench', display_order: 7 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380008', name: 'Classifieds', slug: 'classifieds', icon_name: 'Tag', display_order: 8 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380009', name: 'Properties', slug: 'properties', icon_name: 'Home', display_order: 9 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380010', name: 'Featured Businesses', slug: 'featured-businesses', icon_name: 'Crown', display_order: 10 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380011', name: 'Jobs & Careers', slug: 'jobs-careers', icon_name: 'Briefcase', display_order: 11 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380012', name: 'Internships', slug: 'internships', icon_name: 'GraduationCap', display_order: 12 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380013', name: 'Education & Courses', slug: 'education-courses', icon_name: 'BookOpen', display_order: 13 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380014', name: 'Startups & Creators', slug: 'startups-creators', icon_name: 'Rocket', display_order: 14 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380015', name: 'Community Stories', slug: 'community-stories', icon_name: 'Newspaper', display_order: 15 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380016', name: 'Traffic & Transport', slug: 'traffic-transport', icon_name: 'Bus', display_order: 16 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380017', name: 'Sports & Activities', slug: 'sports-activities', icon_name: 'Trophy', display_order: 17 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380018', name: 'Local Initiatives', slug: 'local-initiatives', icon_name: 'HeartHandshake', display_order: 18 },
  { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380019', name: 'Public Announcements', slug: 'public-announcements', icon_name: 'Megaphone', display_order: 19 },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const resource = String(body.resource || '');

    // 1. One-Click Sync Mega Menu Categories directly to Supabase
    if (resource === 'sync_megamenu') {
      const admin = await createAdminClient();

      // Upsert into business_categories
      const rows = GENUINE_MEGAMENU_CATEGORIES.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon_name: c.icon_name,
        display_order: c.display_order,
        status: 'active',
        is_active: true,
      }));

      const { data, error } = await admin
        .from('business_categories')
        .upsert(rows, { onConflict: 'slug' })
        .select('id, name, slug');

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: 'Successfully synced all Mega Menu service categories to Supabase!',
        data,
      });
    }

    // 2. Add New Category
    if (resource === 'category') {
      const name = String(body.name || '').trim();
      const moduleKey = String(body.module || 'businesses');
      const table = CATEGORY_TABLES[moduleKey];
      const iconName = String(body.icon_name || 'Folder').trim();
      const displayOrder = Number(body.display_order || 99);

      if (!name) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
      }
      if (!table) {
        return NextResponse.json({ error: 'Unknown category module' }, { status: 400 });
      }

      const admin = await createAdminClient();
      const payload: Record<string, unknown> = {
        name,
        slug: slugify(name),
        status: 'active',
        is_active: true,
        created_by: auth.user.id,
      };

      if (table === 'business_categories') {
        payload.icon_name = iconName;
        payload.display_order = displayOrder;
      }

      const { data, error } = await admin
        .from(table)
        .insert(payload)
        .select('id, name, slug')
        .single();

      if (error) {
        const message = error.code === '23505' ? 'That category already exists' : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
      }
      return NextResponse.json({ success: true, data });
    }

    // 3. City Creation
    if (resource === 'city') {
      const name = String(body.name || '').trim();
      const state = String(body.state || 'Kerala').trim() || 'Kerala';
      const active = body.status !== 'expansion';
      if (!name) {
        return NextResponse.json({ error: 'City name is required' }, { status: 400 });
      }

      const admin = await createAdminClient();
      const { data, error } = await admin
        .from('cities')
        .insert({
          name,
          slug: slugify(name),
          state,
          status: active ? 'active' : 'inactive',
          is_active: active,
          created_by: auth.user.id,
        })
        .select('id, name, slug')
        .single();

      if (error) {
        const message = error.code === '23505' ? 'That city already exists' : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
      }
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: 'Unknown resource' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Could not save record';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireRole(['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const table = CATEGORY_TABLES[String(body.module || '')] || String(body.table || '');
    const allowed = new Set(Object.values(CATEGORY_TABLES));
    if (!allowed.has(table)) {
      return NextResponse.json({ error: 'Unknown category module' }, { status: 400 });
    }

    const id = String(body.id || '');
    const name = String(body.name || '').trim();
    if (!id || !name) {
      return NextResponse.json({ error: 'Category id and name are required' }, { status: 400 });
    }

    const admin = await createAdminClient();
    const updatePayload: Record<string, unknown> = {
      name,
      slug: slugify(name),
      updated_by: auth.user.id,
    };

    if (body.icon_name) updatePayload.icon_name = String(body.icon_name).trim();
    if (typeof body.display_order === 'number') updatePayload.display_order = body.display_order;
    if (typeof body.is_active === 'boolean') {
      updatePayload.is_active = body.is_active;
      updatePayload.status = body.is_active ? 'active' : 'inactive';
    }

    const { data, error } = await admin
      .from(table)
      .update(updatePayload)
      .eq('id', id)
      .select('id, name, slug')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Could not update record';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
