import { ApiResponse } from '@/lib/api/response';
import { RealtimeGatewayService } from '@/lib/services/realtime-gateway.service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    // getUser() verifies the token with Supabase Auth; getSession() trusts the cookie
    const { data: { user: authUser } } = await supabase.auth.getUser();
    const session = authUser ? { user: authUser } : null;

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to access live notifications', [], 401);
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    const result = await RealtimeGatewayService.getLiveNotifications(session.user.id, limit);

    return ApiResponse.success(result, 'Live notification feed retrieved successfully', {
      unreadCount: result.unreadCount,
      limit,
    });
  } catch (err: any) {
    return ApiResponse.error('NOTIFICATIONS_ERROR', err.message, [], 500);
  }
}
