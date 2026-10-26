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

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const resource = String(body.resource || '');

    if (resource === 'category') {
      const auth = await requireRole(['Super Admin', 'City Admin']);
      if (auth instanceof NextResponse) return auth;

      const name = String(body.name || '').trim();
      const moduleKey = String(body.module || 'businesses');
      const table = CATEGORY_TABLES[moduleKey];
      if (!name) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
      }
      if (!table) {
        return NextResponse.json({ error: 'Unknown category module' }, { status: 400 });
      }

      const admin = await createAdminClient();
      const { data, error } = await admin
        .from(table)
        .insert({
          name,
          slug: slugify(name),
          status: 'active',
          is_active: true,
          created_by: auth.user.id,
        })
        .select('id, name, slug')
        .single();

      if (error) {
        const message = error.code === '23505' ? 'That category already exists' : error.message;
        return NextResponse.json({ error: message }, { status: 400 });
      }
      return NextResponse.json({ success: true, data });
    }

    if (resource === 'city') {
      const auth = await requireRole(['Super Admin']);
      if (auth instanceof NextResponse) return auth;

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
    const auth = await requireRole(['Super Admin', 'City Admin']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
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
    const { data, error } = await admin
      .from(table)
      .update({ name, slug: slugify(name), updated_by: auth.user.id })
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
