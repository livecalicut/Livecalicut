import { z } from 'zod';

export const adminUserActionSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(['ban', 'suspend', 'activate', 'assign_role', 'soft_delete']),
  roleId: z.string().uuid().optional(),
  reason: z.string().optional(),
});

export const adminApprovalSchema = z.object({
  entityType: z.enum(['business', 'news', 'event', 'job', 'marketplace', 'property']),
  entityId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'feature', 'unfeature']),
  rejectionReason: z.string().optional(),
});

export const approveRejectSchema = z.object({
  targetModule: z.enum(['business', 'news', 'event', 'job', 'marketplace', 'property']),
  targetId: z.string().uuid(),
  action: z.enum(['approve', 'reject', 'feature']),
});

export const adminReportResolutionSchema = z.object({
  reportId: z.string().uuid(),
  status: z.enum(['resolved', 'dismissed', 'escalated']),
  actionTaken: z.enum(['none', 'content_removed', 'user_warned', 'user_banned']),
  notes: z.string().optional(),
});

export const adminSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  registrationOpen: z.boolean().optional(),
  aiConciergeEnabled: z.boolean().optional(),
  merchantSubscriptionsEnabled: z.boolean().optional(),
});
