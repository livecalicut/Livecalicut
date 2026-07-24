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

/**
 * GET /api/v1/locations
 * Public list of areas (optionally filter by ?city_id=)
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('city_id') || searchParams.get('city');
    const q = searchParams.get('q')?.trim();

    let query = supabase
      .from('areas')
      .select('id, name, slug, pincode, latitude, longitude, city_id, is_active, cities(id, name, slug)')
      .is('deleted_at', null)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (cityId) query = query.eq('city_id', cityId);
    if (q) query = query.ilike('name', `%${q}%`);

    const { data, error } = await query;
    if (error) return ApiResponse.error('FETCH_ERROR', error.message, [], 500);

    return ApiResponse.success(data || [], 'Locations retrieved');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch locations';
    return ApiResponse.error('FETCH_ERROR', message, [], 500);
  }
}

/**
 * POST /api/v1/locations
 * Super Admin / City Admin create area
 * Body: { name, city_id?, pincode?, latitude?, longitude? }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Super Admin', 'City Admin']);
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
