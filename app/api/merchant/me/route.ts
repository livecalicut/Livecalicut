import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/merchant/me
 * Returns the current session user's registered businesses + their category names.
 * Used by MerchantSidebar to dynamically show only relevant modules.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ businesses: [] }, { status: 200 });
    }

    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, name, status, business_categories(id, name, slug)')
      .eq('owner_id', session.user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ businesses: [] }, { status: 200 });
    }

    return NextResponse.json({ businesses: businesses ?? [] });
  } catch (err: any) {
    return NextResponse.json({ businesses: [], error: err.message }, { status: 200 });
  }
}
