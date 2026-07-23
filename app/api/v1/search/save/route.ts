import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { saveSearchSchema } from '@/lib/validations/search';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to save searches', [], 401);
    }

    const body = await request.json();
    const validated = saveSearchSchema.parse(body);

    const saved = await SearchEngineService.saveSearch(
      session.user.id,
      validated.query,
      validated.module,
      validated.filters as Record<string, unknown> | undefined,
      validated.alertEmail
    );

    return ApiResponse.success(saved, 'Search saved successfully');
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid save-search payload', err.errors || [], 400);
    }
    return ApiResponse.error('SAVE_ERROR', err.message, [], 500);
  }
}
