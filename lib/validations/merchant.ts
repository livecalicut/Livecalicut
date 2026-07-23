import { z } from 'zod';

export const merchantProfileSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
  whatsapp: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  openingHours: z.string().optional(),
});

export const updateMerchantProfileSchema = merchantProfileSchema;

export const merchantOfferSchema = z.object({
  title: z.string().min(3, 'Offer title is required'),
  discountPercent: z.number().min(1).max(100),
  description: z.string().min(5),
  validUntil: z.string(),
});

export const merchantLeadNoteSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'converted', 'closed']),
  notes: z.string().optional(),
});
