import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  categoryId: z.string().uuid('Please select a category'),
  subcategoryId: z.string().uuid().optional(),
  cityId: z.string().uuid().optional(),
  areaId: z.string().uuid().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(200).optional(),
  phone: z.string().min(10, 'Valid contact phone required'),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  googleMapsLink: z.string().url().optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  socialMedia: z.record(z.string(), z.string()).optional(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

export const reviewSchema = z.object({
  businessId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const reportBusinessSchema = z.object({
  businessId: z.string().uuid(),
  reason: z.enum(['spam', 'fake_listing', 'abuse', 'inappropriate']),
  details: z.string().optional(),
});

export type ReportBusinessInput = z.infer<typeof reportBusinessSchema>;
