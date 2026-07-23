import { z } from 'zod';

export const aiChatQuerySchema = z.object({
  prompt: z.string().min(1, 'Prompt message is required'),
  conversationId: z.string().uuid().optional(),
});

export const aiFeedbackSchema = z.object({
  messageId: z.string().uuid(),
  rating: z.union([z.literal(1), z.literal(-1)]),
  feedbackText: z.string().optional(),
});
