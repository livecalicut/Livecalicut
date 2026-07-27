import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';
import { reviewSchema } from '@/lib/validations/business';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const raw = await request.json();
    const validated = reviewSchema.parse(raw);

    if (!validated.businessId && !validated.slug) {
      return NextResponse.json(
        { success: false, error: { message: 'businessId or slug is required' } },
        { status: 400 }
      );
    }

    let businessId = validated.businessId;
    if (!businessId && validated.slug) {
      const { data: biz, error: bizError } = await auth.supabase
        .from('businesses')
        .select('id')
        .eq('slug', validated.slug)
        .is('deleted_at', null)
        .maybeSingle();
      if (bizError || !biz) {
        return NextResponse.json(
          { success: false, error: { message: 'Business not found' } },
          { status: 404 }
        );
      }
      businessId = biz.id;
    }

    const { data, error } = await auth.supabase
      .from('business_reviews')
      .insert({
        business_id: businessId,
        user_id: auth.user.id,
        rating: validated.rating,
        comment: validated.comment,
      })
      .select()
      .single();

    if (error) throw error;

    const { data: stats } = await auth.supabase
      .from('business_reviews')
      .select('rating')
      .eq('business_id', businessId!);
    if (stats && stats.length > 0) {
      const avg = stats.reduce((sum, row) => sum + Number(row.rating || 0), 0) / stats.length;
      await auth.supabase
        .from('businesses')
        .update({ rating_avg: Math.round(avg * 10) / 10, review_count: stats.length })
        .eq('id', businessId!);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to post review';
    return NextResponse.json({ success: false, error: { message } }, { status: 400 });
  }
}
