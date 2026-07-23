import { ApiResponse } from '@/lib/api/response';
import { PublicGatewayService } from '@/lib/services/public-gateway.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const citySlug = searchParams.get('city') || 'calicut';

    const payload = await PublicGatewayService.getHomepagePayload(citySlug);

    return ApiResponse.success(payload, 'Public homepage aggregated payload fetched successfully', {
      city: citySlug,
    });
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
