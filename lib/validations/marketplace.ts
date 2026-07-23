import { z } from 'zod';

export const createMarketplaceItemSchema = z.object({
  title: z.string().min(3, 'Listing title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  categoryId: z.string().uuid('Please select a category'),
  price: z.number().min(0, 'Price must be a positive number'),
  priceType: z.enum(['fixed', 'negotiable', 'contact_for_price']).default('fixed'),
  isNegotiable: z.boolean().default(false),
  condition: z.enum(['brand_new', 'like_new', 'used_good', 'used_fair']).default('used_good'),
  brand: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().url().optional().or(z.literal('')),
});

export const reportMarketplaceItemSchema = z.object({
  itemId: z.string().uuid(),
  reason: z.enum(['spam', 'fake_item', 'prohibited', 'overpriced']),
  details: z.string().optional(),
});
