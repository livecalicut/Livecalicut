import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from '@/lib/api/response';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';

export const dynamic = 'force-dynamic';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, slug, state, is_active, status')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) return ApiResponse.error('FETCH_ERROR', error.message, [], 503);
    return ApiResponse.success(data || [], 'Cities retrieved successfully');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch cities';
    return ApiResponse.error('FETCH_ERROR', message, [], 500);
  }
}

/**
 * POST /api/v1/cities — Super Admin / City Admin
 */
export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Super Admin', 'City Admin']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const name = String(body.name || '').trim();
    const state = String(body.state || 'Kerala').trim();

    if (!name) {
      return ApiResponse.error('VALIDATION_ERROR', 'City name is required', [], 400);
    }

    const slug = slugify(name);
    const admin = await createAdminClient();
    const lat = Number(body.latitude) || 11.2588;
    const lng = Number(body.longitude) || 75.7804;

    const fullPayload: Record<string, unknown> = {
      name,
      slug,
      state,
      latitude: lat,
      longitude: lng,
      status: 'active',
      is_active: true,
    };

    let { data, error } = await admin
      .from('cities')
      .insert(fullPayload)
      .select('id, name, slug, state, is_active')
      .maybeSingle();

    if (error && /column.*does not exist/i.test(error.message)) {
      const retry = await admin
        .from('cities')
        .insert({ name, slug, state, is_active: true })
        .select('id, name, slug, state, is_active')
        .maybeSingle();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      if (error.code === '23505') {
        return ApiResponse.error('CONFLICT', 'City already exists', [], 409);
      }
      return ApiResponse.error('CREATE_ERROR', error.message, [], 400);
    }

    revalidatePath('/', 'layout');
    revalidatePath('/admin/cities');
    return ApiResponse.success(data, 'City created', {}, 201);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create city';
    return ApiResponse.error('CREATE_ERROR', message, [], 500);
  }
}
