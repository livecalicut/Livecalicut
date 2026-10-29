import { ApiResponse } from '@/lib/api/response';
import { SearchEngineService } from '@/lib/services/search-engine.service';
import { createClient } from '@/lib/supabase/server';

export async function DELETE() {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to clear search history', [], 401);
    }

    await SearchEngineService.clearHistory(session.user.id);

    return ApiResponse.success(null, 'Search history cleared successfully');
  } catch (err: any) {
    return ApiResponse.error('CLEAR_ERROR', err.message, [], 500);
  }
}
