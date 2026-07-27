import type { SupabaseClient } from '@supabase/supabase-js';
import { isCreatorScoped, isSuperAdmin } from '@/lib/rbac/roles';

/**
 * Apply creator-based listing scope.
 * - Super Admin / City Admin: no creator filter (platform / city-wide).
 * - Marketing Executive / Moderator: only rows where created_by = actor.
 */
export function applyCreatorScope<T extends { eq: (c: string, v: unknown) => T }>(
  query: T,
  role: string,
  userId: string,
  column = 'created_by'
): T {
  if (isCreatorScoped(role)) {
    return query.eq(column, userId);
  }
  return query;
}

/**
 * Load profile IDs visible to this actor for the Users admin screen.
 * - Super Admin: everyone (optional search applied by caller)
 * - City Admin: everyone except Super Admin accounts
 * - Marketing Executive / Moderator: only profiles they created
 */
export async function getVisibleProfileIds(
  supabase: SupabaseClient,
  role: string,
  userId: string
): Promise<'all' | string[]> {
  if (isSuperAdmin(role)) return 'all';

  if (isCreatorScoped(role)) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('created_by', userId)
      .is('deleted_at', null);
    return (data || []).map((p) => p.id);
  }

  // City Admin: all profiles that are not Super Admin
  const { data: superRoles } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Super Admin')
    .maybeSingle();

  if (!superRoles?.id) return 'all';

  const { data: superUserRoles } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role_id', superRoles.id);

  const superIds = new Set((superUserRoles || []).map((r) => r.user_id));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .is('deleted_at', null);

  return (profiles || []).map((p) => p.id).filter((id) => !superIds.has(id));
}

export function canViewAllMetrics(role: string): boolean {
  return !isCreatorScoped(role);
}
