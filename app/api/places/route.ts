import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const category = searchParams.get('category');

  const supabase = await createClient();
  let query = supabase
    .from('places')
    .select('*, place_categories(name, slug)')
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('rating_avg', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('place_categories.slug', category);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ data: [] });
  }

  return NextResponse.json({ data: data || [] });
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;
    const admin = await createAdminClient();

    const body = await request.json();
    const { name, description, category, location, address, open_hours, entry_fee, website, phone, best_time_to_visit, tips } = body;

    if (!name || !location) {
      return NextResponse.json({ success: false, message: 'Place name and location are required.' }, { status: 400 });
    }

    const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = slugify(name) + '-' + Math.random().toString(36).substring(2, 6);

    // category_id is NOT NULL: resolve the chosen category or create it
    const categoryName = String(category || 'Attractions').trim();
    const catSlug = slugify(categoryName);
    let { data: cat } = await admin.from('place_categories').select('id').eq('slug', catSlug).maybeSingle();
    if (!cat) {
      const created = await admin.from('place_categories').insert({ name: categoryName, slug: catSlug }).select('id').single();
      if (created.error) throw created.error;
      cat = created.data;
    }

    const { data: city } = await admin.from('cities').select('id').eq('slug', 'kozhikode').is('deleted_at', null).maybeSingle();
    if (!city) {
      return NextResponse.json({ success: false, message: 'Calicut city is not set up' }, { status: 400 });
    }

    // entry_fee is numeric; the form takes free text such as "Free" or "₹50"
    const fee = Number(String(entry_fee ?? '').replace(/[^0-9.]/g, '')) || 0;

    // The places table has no columns for these, so keep them in the description
    const details = [
      description,
      location && `Location: ${location}`,
      address && `Address: ${address}`,
      best_time_to_visit && `Best time to visit: ${best_time_to_visit}`,
      tips && `Visitor tips: ${tips}`,
    ].filter(Boolean).join('\n\n');

    const { data, error } = await admin
      .from('places')
      .insert({
        title: name,
        slug,
        description: details,
        category_id: cat!.id,
        city_id: city.id,
        opening_hours: open_hours || null,
        entry_fee: fee,
        is_free_entry: fee === 0,
        website: website || null,
        contact_phone: phone || null,
        created_by: auth.user.id,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : (err as { message?: string })?.message || 'Failed to add place';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
