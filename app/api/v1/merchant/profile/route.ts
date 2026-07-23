import { ApiResponse } from '@/lib/api/response';
import { MerchantService } from '@/lib/services/merchant.service';
import { updateMerchantProfileSchema } from '@/lib/validations/merchant';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const profile = await MerchantService.getMerchantProfile(session.user.id);
    return ApiResponse.success(profile, 'Merchant outlet profile fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const body = await request.json();
    const validated = updateMerchantProfileSchema.parse(body);

    const updated = await MerchantService.updateMerchantProfile(session.user.id, validated);
    return ApiResponse.success(updated, 'Merchant outlet profile updated successfully');
  } catch (err: any) {
    return ApiResponse.error('VALIDATION_ERROR', err.message, err.errors || [], 400);
  }
}
