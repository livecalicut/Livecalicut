import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';

/**
 * POST /api/businesses/bookmark
 * Toggle business bookmarks — auth required (getUser via requireAuth).
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    let businessId = typeof body.businessId === 'string' ? body.businessId : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

    if (!businessId && slug) {
      const { data: biz } = await auth.supabase
        .from('businesses')
        .select('id')
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();
      businessId = biz?.id || '';
    }

    if (!businessId) {
      return NextResponse.json({ error: 'businessId or slug is required' }, { status: 400 });
    }

    const { data: existing } = await auth.supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('entity_type', 'business')
      .eq('entity_id', businessId)
      .maybeSingle();

    if (existing) {
      await auth.supabase.from('bookmarks').delete().eq('id', existing.id);
      return NextResponse.json({ bookmarked: false, favorited: false });
    }

    const { error } = await auth.supabase.from('bookmarks').insert({
      user_id: auth.user.id,
      entity_type: 'business',
      entity_id: businessId,
    });
    if (error) throw error;

    return NextResponse.json({ bookmarked: true, favorited: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update bookmark';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
