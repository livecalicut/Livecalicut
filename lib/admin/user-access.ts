// lib/admin/user-access.ts
// Server-side check that a staff member may manage another user's account.
import type { SupabaseClient } from '@supabase/supabase-js';
import { assignableRolesFor, isCreatorScoped, isSuperAdmin } from '@/lib/rbac/roles';

export type ManagedUser = { id: string; email: string | null; full_name: string | null; role: string };

/**
 * Returns the target user when the actor may manage them, otherwise an error
 * with the HTTP status to send. Rules:
 * - nobody manages their own account here (use the profile page)
 * - creator-scoped staff only manage users they created
 * - only a Super Admin touches Super Admin accounts
 * - other staff only manage roles they could assign, plus Users and Merchants
 */
export async function loadManageableUser(
  admin: SupabaseClient,
  actor: { id: string; role: string },
  targetId: string
): Promise<{ user: ManagedUser } | { error: string; status: number }> {
  if (targetId === actor.id) {
    return { error: 'Change your own password from your profile page', status: 400 };
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('id, email, full_name, created_by')
    .eq('id', targetId)
    .maybeSingle();
  if (!profile) return { error: 'User not found', status: 404 };

  if (isCreatorScoped(actor.role) && profile.created_by !== actor.id) {
    return { error: 'You can only manage users you created', status: 403 };
  }

  const { data: roleRows } = await admin.from('user_roles').select('roles(name)').eq('user_id', targetId);
  const role =
    (roleRows || [])
      .map((row) => {
        const raw = row.roles as { name?: string } | { name?: string }[] | null;
        return Array.isArray(raw) ? raw[0]?.name : raw?.name;
      })
      .find(Boolean) || 'User';

  if (!isSuperAdmin(actor.role)) {
    const manageable = new Set([...assignableRolesFor(actor.role), 'User', 'Merchant']);
    if (!manageable.has(role)) {
      return { error: `You cannot manage ${role} accounts`, status: 403 };
    }
  }

  return { user: { id: profile.id, email: profile.email, full_name: profile.full_name, role } };
}
