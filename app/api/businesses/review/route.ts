import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reviewSchema } from '@/lib/validations/business';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required to post reviews' }, { status: 401 });
    }

    const body = await request.json();
    const validated = reviewSchema.parse(body);

    const { data, error } = await supabase
      .from('business_reviews')
      .insert({
        business_id: validated.businessId,
        user_id: session.user.id,
        rating: validated.rating,
        comment: validated.comment,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
