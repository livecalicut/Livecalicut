import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';

/**
 * POST /api/marketplace/favorite
 * Toggle marketplace_favorites — auth required (getUser via requireAuth).
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => ({}));
    let itemId = typeof body.itemId === 'string' ? body.itemId : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

    if (!itemId && slug) {
      const { data: item } = await auth.supabase
        .from('marketplace_items')
        .select('id')
        .eq('slug', slug)
        .is('deleted_at', null)
        .maybeSingle();
      itemId = item?.id || '';
    }

    if (!itemId) {
      return NextResponse.json({ error: 'itemId or slug is required' }, { status: 400 });
    }

    const { data: existing } = await auth.supabase
      .from('marketplace_favorites')
      .select('id')
      .eq('user_id', auth.user.id)
      .eq('item_id', itemId)
      .maybeSingle();

    if (existing) {
      await auth.supabase.from('marketplace_favorites').delete().eq('id', existing.id);
      return NextResponse.json({ favorited: false });
    }

    const { error } = await auth.supabase.from('marketplace_favorites').insert({
      user_id: auth.user.id,
      item_id: itemId,
    });
    if (error) throw error;

    return NextResponse.json({ favorited: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update favourite';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
