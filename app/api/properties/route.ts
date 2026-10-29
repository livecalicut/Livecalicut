import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { ApiResponse } from '@/lib/api/response';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingType = searchParams.get('listingType') || searchParams.get('type') || undefined;
  const keyword = searchParams.get('q') || searchParams.get('search') || undefined;
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(searchParams.get('limit') || DEFAULT_LIMIT)));
  const from = (page - 1) * limit;

  const supabase = await createClient();
  let query = supabase
    .from('properties')
    .select('*, property_categories(name, slug), property_agencies(name, logo)', {
      count: 'exact',
    })
    .eq('status', 'published')
    .is('deleted_at', null);

  if (listingType) query = query.eq('listing_type', listingType);
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
  const rows = data || [];

  return ApiResponse.success(rows, 'Properties fetched', {
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
    const { title, listing_type, price, bedrooms, bathrooms, area_sqft, description, images, category } = body;

    if (!title || !listing_type || !price || !area_sqft) {
      return ApiResponse.error('VALIDATION_ERROR', 'Missing required fields', [], 400);
    }

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Math.random().toString(36).substring(2, 6);

    // category_id is NOT NULL: use the requested category, else the first seeded one
    const { data: categories } = await auth.supabase
      .from('property_categories')
      .select('id, slug')
      .is('deleted_at', null)
      .order('name', { ascending: true });
    const categoryId =
      categories?.find((c) => c.slug === category)?.id ?? categories?.[0]?.id ?? null;
    if (!categoryId) {
      return ApiResponse.error('SETUP_ERROR', 'No property categories are set up', [], 400);
    }

    let cityId: string | null = null;
    const { data: cityData } = await auth.supabase
      .from('cities')
      .select('id')
      .eq('slug', 'kozhikode')
      .maybeSingle();
    if (cityData) cityId = cityData.id;

    const coverImage = images && images.length > 0 ? images[0] : null;

    const { data, error } = await auth.supabase
      .from('properties')
      .insert({
        // owner_id is NOT NULL; staff-created listings are owned by the creating staff member
        owner_id: auth.user.id,
        created_by: auth.user.id,
        category_id: categoryId,
        city_id: cityId,
        listing_type,
        title,
        slug,
        description: description || title,
        price,
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area_sqft: area_sqft || 0,
        cover_image: coverImage,
        gallery: Array.isArray(images) ? images : [],
        status: 'published',
      })
      .select()
      .single();

    if (error) throw error;

    if (images && images.length > 0) {
      const imageInserts = images.map((img: string) => ({
        property_id: data.id,
        url: img,
        created_by: auth.user.id,
      }));
      await auth.supabase.from('property_images').insert(imageInserts);
    }

    return ApiResponse.success(data, 'Property created', {}, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Create failed';
    return ApiResponse.error('CREATE_ERROR', message, [], 400);
  }
}
