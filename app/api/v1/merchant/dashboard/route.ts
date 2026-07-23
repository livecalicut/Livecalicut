import { ApiResponse } from '@/lib/api/response';
import { MerchantService } from '@/lib/services/merchant.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const metrics = await MerchantService.getDashboardMetrics(session.user.id);
    return ApiResponse.success(metrics, 'Merchant operating dashboard metrics fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
