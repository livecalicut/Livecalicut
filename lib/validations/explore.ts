import { z } from 'zod';

export const placeReviewSchema = z.object({
  placeId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});

export const experienceBookmarkSchema = z.object({
  experienceId: z.string().uuid(),
});
