import { ApiResponse } from '@/lib/api/response';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';

export const dynamic = 'force-dynamic';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Legacy + header consumers — same shape as before, powered by areas table */
export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get('city');

  let query = supabase
    .from('areas')
    .select('*, cities(name)')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (cityId) query = query.eq('city_id', cityId);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole(['Super Admin', 'City Admin']);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Location name is required.' },
        { status: 400 }
      );
    }

    let finalCityId = body.city_id as string | undefined;
    if (!finalCityId) {
      const { data: cityData } = await auth.supabase
        .from('cities')
        .select('id')
        .eq('slug', 'kozhikode')
        .maybeSingle();
      finalCityId = cityData?.id;
    }

    if (!finalCityId) {
      return NextResponse.json(
        { success: false, message: 'city_id is required.' },
        { status: 400 }
      );
    }

    const { data, error } = await auth.supabase
      .from('areas')
      .insert({
        name,
        slug: slugify(name),
        city_id: finalCityId,
        pincode: body.pincode || null,
        status: 'active',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: 'Location already exists.' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create location';
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
