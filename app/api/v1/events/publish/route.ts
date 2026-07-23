import { ApiResponse } from '@/lib/api/response';
import { RealtimeGatewayService } from '@/lib/services/realtime-gateway.service';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const publishSchema = z.object({
  eventType: z.string().min(1),
  channelName: z.string().min(1),
  payload: z.record(z.string(), z.unknown()),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  citySlug: z.string().default('calicut'),
  priority: z.number().min(1).max(10).default(5),
  expiresInSeconds: z.number().positive().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to publish events', [], 401);
    }

    const body = await request.json();
    const validated = publishSchema.parse(body);

    const result = await RealtimeGatewayService.publish(
      {
        eventType: validated.eventType as any,
        channelName: validated.channelName,
        payload: validated.payload,
        entityType: validated.entityType,
        entityId: validated.entityId,
        citySlug: validated.citySlug,
        priority: validated.priority,
        expiresInSeconds: validated.expiresInSeconds,
      },
      session.user.id
    );

    return ApiResponse.success(result, 'Platform event published and dispatched successfully');
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid event payload', err.errors || [], 400);
    }
    return ApiResponse.error('PUBLISH_ERROR', err.message, [], 500);
  }
}
