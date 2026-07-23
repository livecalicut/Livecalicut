import { z } from 'zod';

export const logEventSchema = z.object({
  eventType: z.string().min(1, 'Event type is required'),
  entityType: z.string().min(1, 'Entity type is required'),
  entityId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});
