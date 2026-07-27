import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';
import { propertyInquirySchema } from '@/lib/validations/property';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const validated = propertyInquirySchema.parse(body);

    const { data, error } = await auth.supabase
      .from('property_inquiries')
      .insert({
        property_id: validated.propertyId,
        user_id: auth.user.id,
        name: validated.name,
        phone: validated.phone,
        email: validated.email,
        message: validated.message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send inquiry';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
