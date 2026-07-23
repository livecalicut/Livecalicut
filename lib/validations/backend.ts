import { z } from 'zod';

export const citySchema = z.object({
  name: z.string().min(2, 'City name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  state: z.string().default('Kerala'),
  isActive: z.boolean().default(true),
});

export const areaSchema = z.object({
  cityId: z.string().uuid(),
  name: z.string().min(2, 'Area name must be at least 2 characters'),
  slug: z.string().min(2, 'Area slug must be at least 2 characters'),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const categorySchema = z.object({
  categoryTypeId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional(),
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Category slug must be at least 2 characters'),
  iconName: z.string().optional(),
  displayOrder: z.number().default(0),
});

export const notificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['info', 'warning', 'success', 'system']).default('info'),
  link: z.string().optional(),
});

export const bookmarkSchema = z.object({
  entityType: z.enum(['business', 'job', 'property', 'marketplace', 'event', 'news']),
  entityId: z.string().uuid(),
});

export const reportSchema = z.object({
  entityType: z.enum(['business', 'job', 'marketplace', 'news', 'comment', 'user']),
  entityId: z.string().uuid(),
  reason: z.enum(['spam', 'fake_listing', 'abuse', 'inappropriate']),
  details: z.string().optional(),
});

export const settingsSchema = z.object({
  key: z.enum(['system', 'app', 'seo', 'email', 'notification', 'ai']),
  value: z.record(z.string(), z.any()),
  description: z.string().optional(),
});
