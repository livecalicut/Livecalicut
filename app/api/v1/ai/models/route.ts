import { ApiResponse } from '@/lib/api/response';
import { AIGatewayService } from '@/lib/services/ai-gateway.service';

export async function GET() {
  try {
    const models = await AIGatewayService.listModels();
    return ApiResponse.success(models, 'Active AI models registry retrieved successfully', {
      count: models.length,
    });
  } catch (err: any) {
    return ApiResponse.error('MODELS_ERROR', err.message, [], 500);
  }
}
