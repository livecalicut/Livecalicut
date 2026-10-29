import { NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { reportMarketplaceItemSchema } from '@/lib/validations/marketplace';

export async function POST(request: Request) {
  try {
    // Anonymous reports are allowed; when signed in, attribute via the verified user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const validated = reportMarketplaceItemSchema.parse(body);

    // Reports are moderator-only data, so RLS gives clients no direct access;
    // the validated insert goes through the service-role client.
    const admin = await createAdminClient();
    const { data, error } = await admin
      .from('marketplace_reports')
      .insert({
        reporter_id: user?.id ?? null,
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
