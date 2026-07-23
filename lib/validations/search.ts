import { z } from 'zod';

export const SEARCH_MODULES = [
  'all',
  'business',
  'news',
  'event',
  'job',
  'marketplace',
  'property',
  'explore',
] as const;

export const SEARCH_SORT_OPTIONS = [
  'relevance',
  'latest',
  'most_viewed',
  'highest_rated',
  'trending',
] as const;

// Main universal search query schema
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'Search query is required')
    .max(200, 'Search query too long')
    .transform((v) => v.trim().replace(/[<>"';&]/g, '')), // Sanitize dangerous chars
  module: z.enum(SEARCH_MODULES).default('all'),
  city: z.string().default('calicut'),
  category: z.string().optional(),
  area: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),
  sort: z.enum(SEARCH_SORT_OPTIONS).default('relevance'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

// Autocomplete suggestions schema
export const suggestionsQuerySchema = z.object({
  q: z
    .string()
    .min(1, 'At least 1 character required for suggestions')
    .max(100)
    .transform((v) => v.trim()),
  city: z.string().default('calicut'),
  limit: z.coerce.number().min(1).max(10).default(6),
});

// Trending queries schema
export const trendingQuerySchema = z.object({
  city: z.string().default('calicut'),
  limit: z.coerce.number().min(1).max(20).default(10),
});

// Save search schema
export const saveSearchSchema = z.object({
  query: z.string().min(1).max(200).transform((v) => v.trim()),
  module: z.enum(SEARCH_MODULES).default('all'),
  filters: z.record(z.string(), z.unknown()).optional(),
  alertEmail: z.boolean().default(false),
});

