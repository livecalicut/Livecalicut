import { ApiResponse } from '@/lib/api/response';
import { PublicGatewayService } from '@/lib/services/public-gateway.service';

export async function GET() {
  try {
    const cities = await PublicGatewayService.getCities();
    return ApiResponse.success(cities, 'Multi-city endpoints retrieved successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
