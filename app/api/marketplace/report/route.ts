import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reportMarketplaceItemSchema } from '@/lib/validations/marketplace';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const body = await request.json();
    const validated = reportMarketplaceItemSchema.parse(body);

    const { data, error } = await supabase
      .from('marketplace_reports')
      .insert({
        reporter_id: session?.user?.id || null,
        item_id: validated.itemId,
        reason: validated.reason,
        details: validated.details,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
