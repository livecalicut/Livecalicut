import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { MerchantService } from '@/lib/services/merchant.service';
import { requireAuth } from '@/lib/supabase/require-auth';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const metrics = await MerchantService.getDashboardMetrics(auth.supabase, auth.user.id);
    return ApiResponse.success(metrics, 'Merchant operating dashboard metrics fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
