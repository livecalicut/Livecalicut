import { z } from 'zod';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
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

/** UI callers use plural/legacy names ("businesses", "general"); map them to a known module. */
const MODULE_ALIASES: Record<string, (typeof ALLOWED_MODULES)[number]> = {
  businesses: 'business',
  events: 'event',
  jobs: 'job',
  properties: 'property',
  places: 'explore',
  tourism: 'explore',
  avatar: 'profile',
  avatars: 'profile',
  cms: 'system',
  general: 'system',
};

export function normalizeMediaModule(value: unknown): (typeof ALLOWED_MODULES)[number] {
  const key = String(value ?? '').trim().toLowerCase();
  if ((ALLOWED_MODULES as readonly string[]).includes(key)) return key as (typeof ALLOWED_MODULES)[number];
  return MODULE_ALIASES[key] ?? 'system';
}

// FormData.get() returns null for absent fields, so every optional field is nullish.
export const mediaUploadSchema = z.object({
  module: z.unknown().transform(normalizeMediaModule),
  entityType: z.string().max(64).nullish(),
  entityId: z.string().uuid().nullish(),
  altText: z.string().max(255).nullish(),
  caption: z.string().max(500).nullish(),
  isPublic: z
    .string()
    .nullish()
    .transform((v) => v !== 'false'),
  tags: z.string().nullish(), // comma-separated
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
