import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { searchQuerySchema } from '@/lib/validations/search';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());

    const validated = searchQuerySchema.parse(rawQuery);

    const results = await SearchEngineService.search(validated);

    // Record to user's history if authenticated (non-blocking)
    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        SearchEngineService.recordSearchHistory(
          session.user.id,
          validated.q,
          validated.module,
          results.total
        ).catch(() => {});
      }
    } catch {
      // Non-fatal — continue without history logging
    }

    return ApiResponse.success(results, `Search results for "${validated.q}"`, {
      query: validated.q,
      module: validated.module,
      city: validated.city,
      page: validated.page,
      limit: validated.limit,
      total: results.total,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid search parameters', err.errors || [], 400);
    }
    return ApiResponse.error('SEARCH_ERROR', err.message, [], 500);
  }
}
