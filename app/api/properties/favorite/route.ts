import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';

/**
 * POST /api/properties/favorite
 * Toggle property_favorites for the authenticated user.
 * Body: { propertyId: uuid }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    const propertyId = typeof body.propertyId === 'string' ? body.propertyId : '';

    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    const { data: existing } = await auth.supabase
      .from('property_favorites')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (existing) {
      await auth.supabase.from('property_favorites').delete().eq('id', existing.id);
      return NextResponse.json({ favorited: false });
    }

    const { error } = await auth.supabase.from('property_favorites').insert({
      user_id: auth.user.id,
      property_id: propertyId,
    });
    if (error) throw error;

    return NextResponse.json({ favorited: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update favourite';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
