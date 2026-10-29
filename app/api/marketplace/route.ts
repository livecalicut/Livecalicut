import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { ApiResponse } from '@/lib/api/response';

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const condition = searchParams.get('condition') || undefined;
  const category = searchParams.get('category') || undefined;
  const keyword = searchParams.get('q') || searchParams.get('search') || undefined;
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(searchParams.get('limit') || DEFAULT_LIMIT)));
  const from = (page - 1) * limit;

  const supabase = await createClient();
  const categoryJoin = category
    ? 'marketplace_categories!inner(name, slug)'
    : 'marketplace_categories(name, slug)';

  let query = supabase
    .from('marketplace_items')
    .select(`*, ${categoryJoin}`, { count: 'exact' })
    .eq('status', 'active')
    .is('deleted_at', null);

  if (condition) query = query.eq('condition', condition);
  if (category) query = query.ilike('marketplace_categories.name', category);
  if (keyword) {
    const term = keyword.replace(/[%,()]/g, '');
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) {
    return ApiResponse.error('FETCH_ERROR', error.message, [], 500);
  }

  const total = count ?? 0;
  const rows = (data || []).map((item: Record<string, unknown>) => {
    const cats = item.marketplace_categories as { name?: string } | null;
    return {
      ...item,
      category: cats?.name || item.category,
    };
  });

  return ApiResponse.success(rows, 'Marketplace listings fetched', {
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    hasMore: from + rows.length < total,
  });
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Merchant', 'City Admin', 'Super Admin', 'Marketing Executive']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { title, category, price, condition, description, images } = body;

    if (!title || !category || !price || !condition) {
      return ApiResponse.error('VALIDATION_ERROR', 'Missing required fields', [], 400);
    }

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Math.random().toString(36).substring(2, 6);

    // Categories and seller profiles are read-only to clients under RLS; the
    // user is already verified above, so these support rows use the service role.
    const admin = await createAdminClient();

    let categoryId: string;
    const categorySlug = String(category).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { data: categoryData } = await admin
      .from('marketplace_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    if (categoryData) {
      categoryId = categoryData.id;
    } else {
      const { data: newCat, error: catError } = await admin
        .from('marketplace_categories')
        .insert({ name: category, slug: categorySlug })
        .select('id')
        .single();
      if (catError || !newCat) throw catError || new Error('Category create failed');
      categoryId = newCat.id;
    }

    const { data: city } = await admin
      .from('cities')
      .select('id')
      .eq('slug', 'kozhikode')
      .is('deleted_at', null)
      .maybeSingle();
    if (!city) return ApiResponse.error('SETUP_ERROR', 'Calicut city is not set up', [], 400);

    // marketplace_items.seller_id references seller_profiles(id), so make sure one exists
    const { data: profile } = await admin
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', auth.user.id)
      .maybeSingle();
    const { error: sellerError } = await admin.from('seller_profiles').upsert(
      {
        id: auth.user.id,
        full_name: profile?.full_name || auth.user.email,
        email: profile?.email || auth.user.email,
        phone: profile?.phone || '',
        city_id: city.id,
      },
      { onConflict: 'id', ignoreDuplicates: true }
    );
    if (sellerError) throw sellerError;

    const coverImage = images && images.length > 0 ? images[0] : null;

    const { data, error } = await auth.supabase
      .from('marketplace_items')
      .insert({
        // seller_id is NOT NULL; staff-created listings are owned by the creating staff member
        seller_id: auth.user.id,
        created_by: auth.user.id,
        category_id: categoryId,
        city_id: city.id,
        title,
        slug,
        description: description || title,
        price,
        price_type: 'fixed',
        is_negotiable: true,
        condition,
        cover_image: coverImage,
        gallery: Array.isArray(images) ? images : [],
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    if (images && images.length > 0) {
      const imageInserts = images.map((img: string) => ({
        item_id: data.id,
        url: img,
        created_by: auth.user.id,
      }));
      await auth.supabase.from('marketplace_images').insert(imageInserts);
    }

    return ApiResponse.success(data, 'Listing created', {}, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Create failed';
    return ApiResponse.error('CREATE_ERROR', message, [], 400);
  }
}
