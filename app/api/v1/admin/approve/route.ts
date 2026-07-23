import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { AdminService } from '@/lib/services/admin.service';
import { adminApprovalSchema } from '@/lib/validations/admin';
import { requireRole } from '@/lib/supabase/require-auth';

const ADMIN_ROLES = ['Moderator', 'City Admin', 'Super Admin', 'Marketing Executive'];

export async function POST(request: Request) {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const validated = adminApprovalSchema.parse(body);

    const moderated = await AdminService.moderateEntity(
      auth.supabase,
      auth.user.id,
      validated.entityType,
      validated.entityId,
      validated.action,
      validated.rejectionReason
    );

    return ApiResponse.success(moderated, `Entity ${validated.entityType} ${validated.action} completed successfully`);
  } catch (err: any) {
    return ApiResponse.error('MODERATION_ERROR', err.message, [], 400);
  }
}
