import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { searchQuerySchema } from '@/lib/validations/search';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = Object.fromEntries(searchParams.entries());
    const validated = searchQuerySchema.parse(rawQuery);

    // Server client so search runs with cookies/RLS and does not rely on the
    // browser supabase singleton (which breaks / returns empty in route handlers).
    const supabase = await createClient();
    const results = await SearchEngineService.search(validated, supabase);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        SearchEngineService.recordSearchHistory(
          user.id,
          validated.q,
          validated.module,
          results.total
        ).catch(() => {});
      }
    } catch {
      // Non-fatal
    }

    return ApiResponse.success(results, `Search results for "${validated.q}"`, {
      query: validated.q,
      module: validated.module,
      city: validated.city,
      area: validated.area,
      page: validated.page,
      limit: validated.limit,
      total: results.total,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error(
        'VALIDATION_ERROR',
        'Invalid search parameters',
        err.errors || [],
        400
      );
    }
    return ApiResponse.error('SEARCH_ERROR', err.message || 'Search failed', [], 500);
  }
}
