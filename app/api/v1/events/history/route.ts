import { ApiResponse } from '@/lib/api/response';
import { RealtimeGatewayService } from '@/lib/services/realtime-gateway.service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to view event history', [], 401);
    }

    const { searchParams } = new URL(request.url);
    const filters = {
      channelName: searchParams.get('channel') || undefined,
      eventType:   searchParams.get('eventType') || undefined,
      citySlug:    searchParams.get('city') || undefined,
      entityType:  searchParams.get('entityType') || undefined,
      entityId:    searchParams.get('entityId') || undefined,
      page:        parseInt(searchParams.get('page') || '1'),
      limit:       parseInt(searchParams.get('limit') || '20'),
    };

    const result = await RealtimeGatewayService.getEventHistory(filters);

    return ApiResponse.success(result.data, 'Event audit history retrieved successfully', {
      page: result.page,
      limit: result.limit,
      total: result.total,
    });
  } catch (err: any) {
    return ApiResponse.error('HISTORY_ERROR', err.message, [], 500);
  }
}
