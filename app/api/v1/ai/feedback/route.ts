import { ApiResponse } from '@/lib/api/response';
import { AIGatewayService } from '@/lib/services/ai-gateway.service';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const feedbackSchema = z.object({
  messageId: z.string().uuid(),
  thumbsUp: z.boolean(),
  comment: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return ApiResponse.error('UNAUTHORIZED', 'Authentication required to submit AI feedback', [], 401);
    }

    const body = await request.json();
    const validated = feedbackSchema.parse(body);

    const feedback = await AIGatewayService.submitFeedback(
      validated.messageId,
      session.user.id,
      validated.thumbsUp,
      validated.comment
    );

    return ApiResponse.success(feedback, 'AI response feedback submitted successfully');
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return ApiResponse.error('VALIDATION_ERROR', 'Invalid feedback payload', err.errors || [], 400);
    }
    return ApiResponse.error('FEEDBACK_ERROR', err.message, [], 500);
  }
}
