import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(3, 'Property title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  categoryId: z.string().uuid('Please select a property category'),
  listingType: z.enum(['buy', 'sell', 'rent', 'lease']).default('sell'),
  price: z.number().min(0, 'Price must be a positive number'),
  isNegotiable: z.boolean().default(false),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  areaSqft: z.number().min(1, 'Area in sq ft is required'),
  builtUpSqft: z.number().optional(),
  parkingSpaces: z.number().default(0),
  furnishedStatus: z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']).default('semi_furnished'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
});

export const propertyInquirySchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email address required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export const reportPropertySchema = z.object({
  propertyId: z.string().uuid(),
  reason: z.enum(['spam', 'fake_listing', 'sold_already', 'wrong_price']),
  details: z.string().optional(),
});
