import { NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { AdminService } from '@/lib/services/admin.service';
import { adminUserActionSchema } from '@/lib/validations/admin';
import { requireRole } from '@/lib/supabase/require-auth';
import { createAdminClient } from '@/lib/supabase/server';
import { USER_MANAGERS, assignableRolesFor, isCreatorScoped, isSuperAdmin } from '@/lib/rbac/roles';

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
    const supabaseAdmin = await createAdminClient();

    // Creator-scoped staff may only act on users they created
    if (isCreatorScoped(auth.user.role)) {
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

    let roleId = validated.roleId;

    if (validated.action === 'assign_role') {
      const roleName = validated.roleName?.trim();
      if (!roleName && !roleId) {
        return ApiResponse.error('VALIDATION', 'Choose a role to assign', [], 400);
      }

      if (roleName) {
        if (roleName === 'Super Admin') {
          return ApiResponse.error('FORBIDDEN', 'Super Admin cannot be assigned here', [], 403);
        }

        const allowed = new Set([
          ...assignableRolesFor(auth.user.role),
          ...(isSuperAdmin(auth.user.role) || auth.user.role === 'City Admin'
            ? ['User', 'Merchant']
            : []),
        ]);

        if (!allowed.has(roleName)) {
          return ApiResponse.error(
            'FORBIDDEN',
            `You can assign: ${[...allowed].join(', ') || 'none'}`,
            [],
            403
          );
        }

        const { data: roleRow, error: roleLookupError } = await supabaseAdmin
          .from('roles')
          .select('id, name')
          .eq('name', roleName)
          .maybeSingle();

        if (roleLookupError || !roleRow) {
          return ApiResponse.error('VALIDATION', 'That role is not set up in the database', [], 400);
        }
        roleId = roleRow.id;
      }

      const { data: currentRoles } = await supabaseAdmin
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', validated.userId);

      const currentName = (currentRoles || [])
        .map((row) => {
          const raw = row.roles as { name?: string } | { name?: string }[] | null;
          return Array.isArray(raw) ? raw[0]?.name : raw?.name;
        })
        .find(Boolean);

      if (currentName === 'Super Admin' && !isSuperAdmin(auth.user.role)) {
        return ApiResponse.error('FORBIDDEN', 'Super Admin accounts cannot be changed', [], 403);
      }
    }

    const updatedUser = await AdminService.updateUserStatus(
      supabaseAdmin,
      auth.user.id,
      validated.userId,
      validated.action,
      roleId,
      validated.reason
    );

    return ApiResponse.success(updatedUser, `User ${validated.action} completed`);
  } catch (err: any) {
    return ApiResponse.error('MODERATION_ERROR', err.message, [], 400);
  }
}
