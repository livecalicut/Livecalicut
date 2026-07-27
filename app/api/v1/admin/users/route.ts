import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { AdminService } from '@/lib/services/admin.service';
import { adminUserActionSchema } from '@/lib/validations/admin';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_MANAGERS, isCreatorScoped } from '@/lib/rbac/roles';

export async function GET(request: Request) {
  try {
    const auth = await requireRole([...USER_MANAGERS]);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const supabaseAdmin = await createAdminClient();
    const users = await AdminService.getUsers(supabaseAdmin, {
      search,
      actorId: auth.user.id,
      actorRole: auth.user.role,
    });

    return ApiResponse.success(users, 'User records fetched successfully');
  } catch (err: any) {
    return ApiResponse.error('FETCH_ERROR', err.message, [], 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireRole([...USER_MANAGERS]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const validated = adminUserActionSchema.parse(body);

    // Creator-scoped staff may only act on users they created
    if (isCreatorScoped(auth.user.role)) {
      const supabaseAdmin = await createAdminClient();
      const { data: target } = await supabaseAdmin
        .from('profiles')
        .select('id, created_by')
        .eq('id', validated.userId)
        .maybeSingle();

      if (!target || target.created_by !== auth.user.id) {
        return ApiResponse.error(
          'FORBIDDEN',
          'You can only manage users you created',
          [],
          403
        );
      }
    }

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
