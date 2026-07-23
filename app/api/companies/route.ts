import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { companySchema } from '@/lib/validations/job';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = companySchema.parse(body);

    const { data, error } = await supabase
      .from('companies')
      .insert({
        owner_id: session.user.id,
        name: validated.name,
        slug: validated.slug,
        industry: validated.industry,
        description: validated.description,
        phone: validated.phone,
        email: validated.email,
        website: validated.website,
        address: validated.address,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
