import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to view search history', [], 401);
    }

    const history = await SearchEngineService.getRecentSearches(session.user.id);

    return ApiResponse.success(history, 'Recent search history retrieved successfully', {
      count: history.length,
    });
  } catch (err: any) {
    return ApiResponse.error('HISTORY_ERROR', err.message, [], 500);
  }
}
