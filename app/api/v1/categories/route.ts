import { ApiResponse } from '@/lib/api/response';
import { PublicGatewayService } from '@/lib/services/public-gateway.service';

export async function GET() {
  try {
    const categories = await PublicGatewayService.getCategories();
    return ApiResponse.success(categories, 'Categories taxonomy fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
