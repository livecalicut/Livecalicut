import { ApiResponse } from '@/lib/api/response';
import { RealtimeGatewayService } from '@/lib/services/realtime-gateway.service';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  channelName: z.string().min(1),
  filters: z.record(z.string(), z.unknown()).optional(),
});

const unsubscribeSchema = z.object({
  channelName: z.string().min(1),
});

async function getUserRole(supabase: any, userId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return data?.role || 'user';
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to subscribe to channels', [], 401);
    }

    const body = await request.json();
    const validated = subscribeSchema.parse(body);

    const userRole = await getUserRole(supabase, session.user.id);

    const subscription = await RealtimeGatewayService.subscribe({
      userId: session.user.id,
      userRole,
      channelName: validated.channelName,
      filters: validated.filters,
    });

    return ApiResponse.success(subscription, `Subscribed to channel "${validated.channelName}" successfully`);
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid subscription payload', err.errors || [], 400);
    }
    return ApiResponse.error('SUBSCRIBE_ERROR', err.message, [], 400);
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to unsubscribe', [], 401);
    }

    const body = await request.json();
    const validated = unsubscribeSchema.parse(body);

    await RealtimeGatewayService.unsubscribe(session.user.id, validated.channelName);

    return ApiResponse.success(null, `Unsubscribed from channel "${validated.channelName}" successfully`);
  } catch (err: any) {
    return ApiResponse.error('UNSUBSCRIBE_ERROR', err.message, [], 400);
  }
}
