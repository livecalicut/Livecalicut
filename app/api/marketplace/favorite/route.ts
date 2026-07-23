import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { itemId } = await request.json();
    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('marketplace_favorites')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('item_id', itemId)
      .single();

    if (existing) {
      await supabase.from('marketplace_favorites').delete().eq('id', existing.id);
      return NextResponse.json({ favorited: false });
    } else {
      await supabase.from('marketplace_favorites').insert({
        user_id: session.user.id,
        item_id: itemId,
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
