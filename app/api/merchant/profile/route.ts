import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { merchantProfileSchema } from '@/lib/validations/merchant';

export async function GET() {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

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
    revalidatePath('/', 'layout');
    revalidatePath('/businesses');
    revalidatePath('/merchant/profile');
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = merchantProfileSchema.parse(body);

    const updatePayload: Record<string, unknown> = {
      name: validated.name,
      description: validated.description,
      phone: validated.phone,
      whatsapp: validated.whatsapp,
      email: validated.email,
      website: validated.website,
      short_description: validated.address,
      updated_at: new Date().toISOString(),
    };

    if (validated.categoryId) {
      updatePayload.category_id = validated.categoryId;
    }
    if (validated.subcategoryId !== undefined) {
      updatePayload.subcategory_id = validated.subcategoryId || null;
    }
    if (validated.cityId) {
      updatePayload.city_id = validated.cityId;
    }
    if (validated.areaId !== undefined) {
      updatePayload.area_id = validated.areaId || null;
    }

    const { data, error } = await supabase
      .from('businesses')
      .update(updatePayload)
      .eq('owner_id', session.user.id)
      .select()
      .single();

    if (error) throw error;
    revalidatePath('/', 'layout');
    revalidatePath('/businesses');
    revalidatePath('/merchant/profile');
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
