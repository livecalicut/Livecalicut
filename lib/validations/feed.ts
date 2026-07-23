import { z } from 'zod';

export const newsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  categoryId: z.string().uuid('Please select a news category'),
  cityId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  author: z.string().default('LiveCalicut Editorial'),
  source: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Event title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().uuid('Please select an event category'),
  organizerId: z.string().uuid().optional(),
  venue: z.string().min(3, 'Venue is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  registrationLink: z.string().url().optional().or(z.literal('')),
  isTicketRequired: z.boolean().default(false),
  banner: z.string().url().optional().or(z.literal('')),
});

export const announcementSchema = z.object({
  cityId: z.string().uuid(),
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(10, 'Content is required'),
  type: z.enum(['government', 'traffic', 'weather', 'emergency']).default('government'),
});
