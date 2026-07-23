import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { suggestionsQuerySchema } from '@/lib/validations/search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const validated = suggestionsQuerySchema.parse(rawQuery);

    const suggestions = await SearchEngineService.getSuggestions(
      validated.q,
      validated.city,
      validated.limit
    );

    return ApiResponse.success(suggestions, 'Autocomplete suggestions fetched', {
      query: validated.q,
      count: suggestions.length,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid suggestion parameters', err.errors || [], 400);
    }
    return ApiResponse.error('SUGGESTIONS_ERROR', err.message, [], 500);
  }
}
