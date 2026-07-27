import type { SupabaseClient } from '@supabase/supabase-js';
import { isCreatorScoped, isSuperAdmin } from '@/lib/rbac/roles';

/**
 * Resolve all profile IDs that hold the Super Admin role.
 */
export async function getSuperAdminUserIds(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data: superRole } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Super Admin')
    .maybeSingle();

  if (!superRole?.id) return [];

  const { data: rows } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role_id', superRole.id);

  return (rows || []).map((r) => r.user_id).filter(Boolean);
}

/**
 * Listing / content scope for admin modules.
 *
 * - Super Admin → everything
 * - Marketing Executive → only rows they created
 * - Everyone else → hide Super Admin–owned rows (and null/unowned platform rows)
 */
export async function applyListingScope(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  supabase: SupabaseClient,
  role: string,
  userId: string,
  column = 'created_by'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (isSuperAdmin(role)) return query;

  if (isCreatorScoped(role)) {
    return query.eq(column, userId);
  }

  const superIds = await getSuperAdminUserIds(supabase);
  let next = query.not(column, 'is', null);
  if (superIds.length > 0) {
    next = next.not(column, 'in', `(${superIds.join(',')})`);
  }
  return next;
}

/** Sync helper: Marketing Executive → own rows only. */
export function applyCreatorScope<
  T extends { eq: (c: string, v: unknown) => T },
>(query: T, role: string, userId: string, column = 'created_by'): T {
  if (isCreatorScoped(role)) {
    return query.eq(column, userId);
  }
  return query;
}

/**
 * Profile IDs visible on the Users admin screen.
 * Super Admin accounts are NEVER returned to any other role.
 */
export async function getVisibleProfileIds(
  supabase: SupabaseClient,
  role: string,
  userId: string
): Promise<'all' | string[]> {
  if (isSuperAdmin(role)) return 'all';

  const superIds = new Set(await getSuperAdminUserIds(supabase));

  if (isCreatorScoped(role)) {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('created_by', userId)
      .is('deleted_at', null);
    return (data || []).map((p) => p.id).filter((id) => !superIds.has(id));
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .is('deleted_at', null);

  return (profiles || []).map((p) => p.id).filter((id) => !superIds.has(id));
}

export function canViewAllMetrics(role: string): boolean {
  return !isCreatorScoped(role);
}
