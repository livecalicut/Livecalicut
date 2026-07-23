import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { propertyInquirySchema } from '@/lib/validations/property';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const body = await request.json();
    const validated = propertyInquirySchema.parse(body);

    const { data, error } = await supabase
      .from('property_inquiries')
      .insert({
        property_id: validated.propertyId,
        user_id: session?.user?.id || null,
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
