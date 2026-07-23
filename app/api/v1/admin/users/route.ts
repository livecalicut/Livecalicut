import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { AdminService } from '@/lib/services/admin.service';
import { adminUserActionSchema } from '@/lib/validations/admin';
import { requireRole } from '@/lib/supabase/require-auth';

import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_ROLES = ['City Admin', 'Super Admin'];

export async function GET(request: Request) {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const supabaseAdmin = await createAdminClient();
    const users = await AdminService.getUsers(supabaseAdmin, { search });
    
    return ApiResponse.success(users, 'User records fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

export async function PATCH(request: Request) {
  try {
    // Only Super Admin and City Admin can modify user accounts
    const auth = await requireRole(ADMIN_ROLES);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const validated = adminUserActionSchema.parse(body);

    const updatedUser = await AdminService.updateUserStatus(
      auth.supabase,
      auth.user.id,
      validated.userId,
      validated.action,
      validated.roleId,
      validated.reason
    );

    return ApiResponse.success(updatedUser, `User ${validated.action} completed`);
  } catch (err: any) {
    return ApiResponse.error('MODERATION_ERROR', err.message, [], 400);
  }
}
