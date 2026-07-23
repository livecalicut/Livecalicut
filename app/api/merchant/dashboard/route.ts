import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MerchantService } from '@/lib/services/merchant.service';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const metrics = await MerchantService.getDashboardMetrics(session.user.id);
    return NextResponse.json({ data: metrics });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
