import { z } from 'zod';

export const bffPaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  citySlug: z.string().default('calicut'),
});

export const bffSearchQuerySchema = z.object({
  q: z.string().min(1, 'Search keyword q is required'),
  module: z.enum(['all', 'businesses', 'news', 'events', 'jobs', 'marketplace', 'properties', 'explore']).default('all'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});
