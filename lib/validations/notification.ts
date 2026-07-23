import { z } from 'zod';

export const markNotificationReadSchema = z.object({
  notificationId: z.string().uuid(),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(3, 'Announcement title must be at least 3 characters'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  targetRole: z.enum(['all', 'user', 'merchant', 'moderator', 'city_admin']).default('all'),
  isBroadcast: z.boolean().default(true),
});
