import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { merchantProfileSchema } from '@/lib/validations/merchant';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', session.user.id)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = merchantProfileSchema.parse(body);

    const { data, error } = await supabase
      .from('businesses')
      .update({
        name: validated.name,
        description: validated.description,
        phone: validated.phone,
        whatsapp: validated.whatsapp,
        email: validated.email,
        website: validated.website,
        address: validated.address,
        updated_at: new Date().toISOString(),
      })
      .eq('owner_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
