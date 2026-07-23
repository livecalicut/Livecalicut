import { z } from 'zod';

export const createOrderSchema = z.object({
  planId: z.string().uuid(),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Razorpay Order ID is required'),
  paymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  signature: z.string().min(1, 'Razorpay Signature is required'),
  planId: z.string().uuid(),
});
