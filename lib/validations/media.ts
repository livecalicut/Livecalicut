import { z } from 'zod';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
] as const;

export const ALLOWED_MODULES = [
  'business',
  'news',
  'event',
  'job',
  'marketplace',
  'property',
  'explore',
  'profile',
  'system',
] as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const mediaUploadSchema = z.object({
  module: z.enum(['business', 'news', 'event', 'job', 'marketplace', 'property', 'explore', 'profile', 'system']),
  entityType: z.string().optional(),
  entityId: z.string().uuid().optional(),
  altText: z.string().max(255).optional(),
  caption: z.string().max(500).optional(),
  isPublic: z.coerce.boolean().default(true),
  tags: z.string().optional(), // comma-separated
});

export const mediaSearchSchema = z.object({
  q: z.string().optional(),
  module: z.enum(['all', 'business', 'news', 'event', 'job', 'marketplace', 'property', 'explore', 'profile', 'system']).default('all'),
  ownerId: z.string().uuid().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

export const mediaPatchSchema = z.object({
  altText: z.string().max(255).optional(),
  caption: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
});
