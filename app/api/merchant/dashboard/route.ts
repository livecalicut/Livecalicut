import { NextResponse } from 'next/server';
import { MerchantService } from '@/lib/services/merchant.service';
import { requireAuth } from '@/lib/supabase/require-auth';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const metrics = await MerchantService.getDashboardMetrics(auth.supabase, auth.user.id);
    return NextResponse.json({ data: metrics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
