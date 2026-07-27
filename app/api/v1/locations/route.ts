import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';

export const dynamic = 'force-dynamic';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;

/**
 * GET /api/v1/locations
 * Public list of areas.
 *
 * Query: ?city_id= &q= &page=1 &limit=20 &all=1
 * `all=1` skips pagination for pickers that filter in-place.
 * Response meta: { total, page, limit, totalPages, hasMore }
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('city_id') || searchParams.get('city');
    const q = searchParams.get('q')?.trim();
    const all = searchParams.get('all') === '1' || searchParams.get('all') === 'true';

    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number.parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10) || DEFAULT_LIMIT)
    );

    let query = supabase
      .from('areas')
      .select(
        'id, name, slug, pincode, latitude, longitude, city_id, is_active, cities(id, name, slug)',
        { count: 'exact' }
      )
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (cityId) query = query.eq('city_id', cityId);
    if (q) query = query.or(`name.ilike.%${q}%,pincode.ilike.%${q}%`);

    if (!all) {
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);
    }

    const { data, error, count } = await query;
    if (error) return ApiResponse.error('FETCH_ERROR', error.message, [], 500);

    const rows = data || [];
    const total = count ?? rows.length;

    return ApiResponse.success(rows, 'Locations retrieved', {
      total,
      page: all ? 1 : page,
      limit: all ? total : limit,
      totalPages: all ? 1 : Math.max(1, Math.ceil(total / limit)),
      hasMore: all ? false : page * limit < total,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch locations';
    return ApiResponse.error('FETCH_ERROR', message, [], 500);
  }
}

/**
 * POST /api/v1/locations
 * Super Admin only — create area from Admin → Areas
 * Body: { name, city_id?, pincode?, latitude?, longitude? }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Super Admin']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const name = String(body.name || '').trim();
    const pincode = body.pincode ? String(body.pincode).trim() : null;
    const latitude = body.latitude != null && body.latitude !== '' ? Number(body.latitude) : null;
    const longitude =
      body.longitude != null && body.longitude !== '' ? Number(body.longitude) : null;

    if (!name) {
      return ApiResponse.error('VALIDATION_ERROR', 'Location name is required', [], 400);
    }

    const slug = slugify(name);
    if (!slug) {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid location name', [], 400);
    }

    let cityId = body.city_id as string | undefined;
    if (!cityId) {
      const { data: city } = await auth.supabase
        .from('cities')
        .select('id')
        .eq('slug', 'kozhikode')
        .is('deleted_at', null)
        .maybeSingle();
      cityId = city?.id;
    }

    if (!cityId) {
      return ApiResponse.error(
        'VALIDATION_ERROR',
        'city_id is required (no default Kozhikode city found)',
        [],
        400
      );
    }

    const { data, error } = await auth.supabase
      .from('areas')
      .insert({
        name,
        slug,
        city_id: cityId,
        pincode,
        latitude,
        longitude,
        status: 'active',
        is_active: true,
      })
      .select('id, name, slug, pincode, latitude, longitude, city_id, cities(id, name, slug)')
      .single();

    if (error) {
      if (error.code === '23505') {
        return ApiResponse.error('CONFLICT', 'Location already exists', [], 409);
      }
      return ApiResponse.error('CREATE_ERROR', error.message, [], 400);
    }

    return ApiResponse.success(data, 'Location created', {}, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create location';
    return ApiResponse.error('CREATE_ERROR', message, [], 500);
  }
}
