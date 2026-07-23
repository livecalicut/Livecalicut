import { ApiResponse } from '@/lib/api/response';
import { AIGatewayService } from '@/lib/services/ai-gateway.service';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to view AI conversation history', [], 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return ApiResponse.error('VALIDATION_ERROR', 'sessionId query parameter is required', [], 400);
    }

    const history = await AIGatewayService.getConversationHistory(sessionId);
    return ApiResponse.success(history, 'AI conversation history retrieved successfully', {
      sessionId,
      count: history.length,
    });
  } catch (err: any) {
    return ApiResponse.error('HISTORY_ERROR', err.message, [], 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to clear AI history', [], 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return ApiResponse.error('VALIDATION_ERROR', 'sessionId query parameter is required', [], 400);
    }

    await AIGatewayService.clearHistory(sessionId, session.user.id);
    return ApiResponse.success(null, 'AI conversation history cleared successfully');
  } catch (err: any) {
    return ApiResponse.error('CLEAR_ERROR', err.message, [], 500);
  }
}
