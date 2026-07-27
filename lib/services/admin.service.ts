import type { SupabaseClient } from '@supabase/supabase-js';
import { getVisibleProfileIds } from '@/lib/rbac/data-scope';
import { isCreatorScoped, isSuperAdmin } from '@/lib/rbac/roles';

/**
 * AdminService
 *
 * All methods accept a `supabase` client injected from the API route.
 * This ensures:
 * 1. Server-side client is always used (not the browser client).
 * 2. The authenticated user's RLS context is preserved.
 * 3. For privileged operations, the caller passes createAdminClient().
 */
export class AdminService {
  static async logAuditAction(
    supabase: SupabaseClient,
    adminId: string,
    action: string,
    targetEntity: string,
    targetId?: string,
    metadata: Record<string, unknown> = {}
  ) {
    const { error } = await supabase.from('audit_logs').insert({
      admin_id: adminId,
      action,
      target_entity: targetEntity,
      target_id: targetId ?? null,
      metadata,
    });
    if (error) console.error('[AdminService.logAuditAction]', error.message);
  }

  static async getUsers(
    supabase: SupabaseClient,
    filters: {
      search?: string;
      role?: string;
      page?: number;
      limit?: number;
      actorId?: string;
      actorRole?: string;
    } = {}
  ) {
    const actorId = filters.actorId;
    const actorRole = filters.actorRole || 'User';

    let query = supabase
      .from('profiles')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (actorId && actorRole) {
      const visible = await getVisibleProfileIds(supabase, actorRole, actorId);
      if (visible !== 'all') {
        if (visible.length === 0) return [];
        query = query.in('id', visible);
      }
    }

    if (filters.search) {
      query = query.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      );
    }

    const { data: profiles, error: profilesError } = await query;
    if (profilesError) throw profilesError;
    if (!profiles || profiles.length === 0) return [];

    // Fetch roles in a separate query to avoid schema relationship errors
    const profileIds = profiles.map(p => p.id);
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('user_id, roles(name)')
      .in('user_id', profileIds);

    const rolesMap = new Map();
    if (userRoles) {
      userRoles.forEach(ur => {
        const rawRoles = ur.roles as any;
        const roleName = Array.isArray(rawRoles) ? rawRoles[0]?.name : rawRoles?.name;
        rolesMap.set(ur.user_id, roleName || 'User');
      });
    }

    let merged = profiles.map(p => ({
      ...p,
      role: rolesMap.get(p.id) || 'User'
    }));

    // Never expose Super Admin accounts to non–Super Admin actors
    if (!isSuperAdmin(actorRole)) {
      merged = merged.filter((u) => u.role !== 'Super Admin');
    }

    return merged;
  }

  static async updateUserStatus(
    supabase: SupabaseClient,
    adminId: string,
    userId: string,
    action: string,
    roleId?: string,
    reason?: string
  ) {
    const updatePayload: Record<string, unknown> = {};

    if (action === 'assign_role' && roleId) {
      // Delete existing roles for the user to assign a fresh one
      await supabase.from('user_roles').delete().eq('user_id', userId);
      
      // Insert new role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role_id: roleId });
        
      if (roleError) throw roleError;
      
      await this.logAuditAction(supabase, adminId, `user_${action}`, 'profile', userId, {
        reason,
        roleId,
      });
      return { success: true };
    }

    if (action === 'ban') {
      updatePayload.account_status = 'deactivated';
    } else if (action === 'suspend') {
      updatePayload.account_status = 'suspended';
    } else if (action === 'activate') {
      updatePayload.account_status = 'active';
    } else if (action === 'soft_delete') {
      updatePayload.deleted_at = new Date().toISOString();
    }

    if (Object.keys(updatePayload).length === 0) {
      throw new Error(`Unknown action: ${action}`);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    await this.logAuditAction(supabase, adminId, `user_${action}`, 'profile', userId, {
      reason,
    });

    return data;
  }

  static async moderateEntity(
    supabase: SupabaseClient,
    adminId: string,
    entityType: string,
    entityId: string,
    action: string,
    rejectionReason?: string
  ) {
    const tableMap: Record<string, string> = {
      business: 'businesses',
      job: 'jobs',
      marketplace: 'marketplace_items',
      property: 'properties',
      news: 'news',
      event: 'events',
    };

    const tableName = tableMap[entityType];
    if (!tableName) throw new Error(`Unknown entity type: ${entityType}`);

    const updatePayload: Record<string, unknown> = {};
    if (action === 'approve') {
      if (['job', 'property', 'news', 'event'].includes(entityType)) {
        updatePayload.status = 'published';
      } else {
        updatePayload.status = 'active';
      }
    }
    if (action === 'reject') {
      if (entityType === 'job') updatePayload.status = 'closed';
      else if (entityType === 'property') updatePayload.status = 'draft';
      else if (['marketplace', 'news', 'event'].includes(entityType)) {
        updatePayload.status = 'archived';
      }
      else updatePayload.status = 'rejected';
      
      if (rejectionReason) updatePayload.rejection_reason = rejectionReason;
    }
    if (action === 'feature') updatePayload.is_featured = true;
    if (action === 'unfeature') updatePayload.is_featured = false;

    const { data, error } = await supabase
      .from(tableName)
      .update(updatePayload)
      .eq('id', entityId)
      .select()
      .single();

    if (error) throw error;

    await this.logAuditAction(supabase, adminId, `entity_${action}`, entityType, entityId, {
      rejectionReason,
    });

    return data;
  }

  static async deleteEntity(
    supabase: SupabaseClient,
    adminId: string,
    entityType: string,
    entityId: string,
    hardDelete: boolean = false
  ) {
    const tableMap: Record<string, string> = {
      business: 'businesses',
      job: 'jobs',
      marketplace: 'marketplace_items',
      property: 'properties',
      news: 'news',
      event: 'events',
      report: 'reports',
      area: 'areas',
      location: 'areas',
    };

    const tableName = tableMap[entityType];
    if (!tableName) throw new Error(`Unknown entity type: ${entityType}`);

    if (hardDelete) {
      const { error } = await supabase.from(tableName).delete().eq('id', entityId);
      if (error) throw error;
    } else {
      // Soft delete
      const { error } = await supabase.from(tableName).update({ deleted_at: new Date().toISOString() }).eq('id', entityId);
      if (error) throw error;
    }

    await this.logAuditAction(supabase, adminId, `entity_delete`, entityType, entityId, { hardDelete });
    return { success: true };
  }

  static async getDashboardMetrics(
    supabase: SupabaseClient,
    scope?: { userId: string; role: string }
  ) {
    const nowIso = new Date().toISOString();
    const scoped = scope && isCreatorScoped(scope.role);
    const uid = scope?.userId;

    const scopeEq = <T extends { eq: (c: string, v: unknown) => T }>(q: T) =>
      scoped && uid ? q.eq('created_by', uid) : q;

    // Every count is a `head: true` request, so Postgres returns the tally
    // without shipping any rows. All of them go out in one round trip.
    const [
      { count: totalUsers },
      { count: activeBusinesses },
      { count: publishedJobs },
      { count: marketplaceListings },
      { count: properties },
      { count: publishedNews },
      { count: upcomingEvents },
      { count: reportedContent },
      { count: pendingBusinesses },
      { count: pendingJobs },
      { count: pendingProperties },
    ] = await Promise.all([
      scoped && uid
        ? supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('created_by', uid).is('deleted_at', null)
        : supabase.from('profiles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
      scopeEq(supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'active').is('deleted_at', null)),
      scopeEq(supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'published').is('deleted_at', null)),
      scopeEq(supabase.from('marketplace_items').select('*', { count: 'exact', head: true }).eq('status', 'active').is('deleted_at', null)),
      scopeEq(supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'active').is('deleted_at', null)),
      scopeEq(supabase.from('news').select('*', { count: 'exact', head: true }).eq('status', 'published').is('deleted_at', null)),
      scopeEq(supabase.from('events').select('*', { count: 'exact', head: true }).gte('start_date', nowIso).is('deleted_at', null)),
      scoped
        ? Promise.resolve({ count: 0 })
        : supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      scopeEq(supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'pending').is('deleted_at', null)),
      scopeEq(supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending').is('deleted_at', null)),
      scopeEq(supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending').is('deleted_at', null)),
    ]);

    return {
      totalUsers: totalUsers ?? 0,
      activeBusinesses: activeBusinesses ?? 0,
      activeJobs: publishedJobs ?? 0,
      marketplaceItems: marketplaceListings ?? 0,
      activeProperties: properties ?? 0,
      publishedNews: publishedNews ?? 0,
      upcomingEvents: upcomingEvents ?? 0,
      reportedContent: reportedContent ?? 0,
      pendingApprovals: (pendingBusinesses ?? 0) + (pendingJobs ?? 0) + (pendingProperties ?? 0),
    };
  }

  static async getAuditLogs(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, profiles!admin_id(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('[AdminService.getAuditLogs]', error.message);
      return [];
    }
    return data ?? [];
  }

  static async getStaffPerformance(supabase: SupabaseClient) {
    // 1. Fetch Marketing Executives
    const { data: roles } = await supabase.from('roles').select('id').eq('name', 'Marketing Executive').single();
    if (!roles) return [];

    const { data: userRoles } = await supabase.from('user_roles').select('user_id').eq('role_id', roles.id);
    if (!userRoles || userRoles.length === 0) return [];
    
    const staffIds = userRoles.map(ur => ur.user_id);

    // 2. Fetch Profiles for these staff
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, email').in('id', staffIds);
    if (!profiles) return [];

    // 3. Attribute listings to staff. Two bulk queries rather than two per
    //    person, then tally in memory — the previous version issued 2N queries.
    const [{ data: businessRows }, { data: propertyRows }] = await Promise.all([
      supabase.from('businesses').select('created_by').in('created_by', staffIds),
      supabase.from('properties').select('created_by').in('created_by', staffIds),
    ]);

    const tally = (rows: { created_by: string | null }[] | null) => {
      const counts = new Map<string, number>();
      for (const row of rows ?? []) {
        if (!row.created_by) continue;
        counts.set(row.created_by, (counts.get(row.created_by) ?? 0) + 1);
      }
      return counts;
    };

    const businessCounts = tally(businessRows);
    const propertyCounts = tally(propertyRows);

    const performance = profiles.map((staff) => {
      const businesses = businessCounts.get(staff.id) ?? 0;
      const properties = propertyCounts.get(staff.id) ?? 0;

      return {
        id: staff.id,
        name: staff.full_name || staff.email,
        businesses,
        properties,
        total: businesses + properties,
      };
    });

    return performance.sort((a, b) => b.total - a.total);
  }
}
