import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reportBusinessSchema } from '@/lib/validations/business';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const body = await request.json();
    const validated = reportBusinessSchema.parse(body);

    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: session?.user?.id || null,
        entity_type: 'business',
        entity_id: validated.businessId,
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
