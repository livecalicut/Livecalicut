import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { trendingQuerySchema } from '@/lib/validations/search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const validated = trendingQuerySchema.parse(rawQuery);

    const trending = await SearchEngineService.getTrending(validated.city, validated.limit);

    return ApiResponse.success(trending, 'Trending searches fetched successfully', {
      city: validated.city,
      count: trending.length,
    });
  } catch (err: any) {
    return ApiResponse.error('TRENDING_ERROR', err.message, [], 500);
  }
}
