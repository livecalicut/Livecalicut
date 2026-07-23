import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { AdminService } from '@/lib/services/admin.service';
import { requireRole } from '@/lib/supabase/require-auth';

const ADMIN_ROLES = ['Moderator', 'City Admin', 'Super Admin', 'Marketing Executive'];

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const auditLogs = await AdminService.getAuditLogs(auth.supabase);
    return ApiResponse.success(auditLogs, 'Audit logs retrieved successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}
