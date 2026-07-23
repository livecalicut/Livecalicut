import { ApiResponse } from '@/lib/api/response';
import { AIGatewayService } from '@/lib/services/ai-gateway.service';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
  sessionId: z.string().uuid().optional(),
  citySlug: z.string().default('calicut'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = chatSchema.parse(body);

    // Resolve authenticated user (optional — gateway supports anonymous chat)
    let userId: string | undefined;
    let userRole = 'guest';

    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        userId = session.user.id;
        userRole = 'user'; // Elevated from guest
      }
    } catch {
      // Non-fatal — continue as guest
    }

    const response = await AIGatewayService.chat({
      message: validated.message,
      sessionId: validated.sessionId,
      userId,
      citySlug: validated.citySlug,
      userRole,
    });

    return ApiResponse.success(response, 'AI response generated successfully', {
      sessionId: response.sessionId,
      provider: response.provider,
      model: response.model,
      latencyMs: response.latencyMs,
      fallbackUsed: response.fallbackUsed || false,
    });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid chat payload', err.errors || [], 400);
    }
    return ApiResponse.error('AI_ERROR', err.message, [], 500);
  }
}
