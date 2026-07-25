import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { MerchantService } from '@/lib/services/merchant.service';
import { updateMerchantProfileSchema } from '@/lib/validations/merchant';
import { requireAuth } from '@/lib/supabase/require-auth';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const profile = await MerchantService.getMerchantProfile(auth.supabase, auth.user.id);
    return ApiResponse.success(profile, 'Merchant outlet profile fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

async function updateProfile(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) {
      return ApiResponse.error('UNAUTHORIZED', 'Merchant authentication required', [], 401);
    }

    const body = await request.json();
    const validated = updateMerchantProfileSchema.parse(body);

    const updated = await MerchantService.updateMerchantProfile(
      auth.supabase,
      auth.user.id,
      validated
    );
    return ApiResponse.success(updated, 'Merchant outlet profile updated successfully');
  } catch (err: any) {
    return ApiResponse.error('VALIDATION_ERROR', err.message, err.errors || [], 400);
  }
}

export const PUT = updateProfile;

// The generated API client issues PATCH for partial profile updates, so accept
// both verbs rather than 405-ing on one of them.
export const PATCH = updateProfile;
