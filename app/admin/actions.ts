'use server';

import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { AdminService } from '@/lib/services/admin.service';

export async function fetchDashboardDataAction() {
  const supabase = await createClient();
  const metrics = await AdminService.getDashboardMetrics(supabase);
  const staffPerformance = await AdminService.getStaffPerformance(supabase);
  const auditLogs = await AdminService.getAuditLogs(supabase);
  
  const recentActivities = auditLogs.slice(0, 5).map(log => ({
    time: new Date(log.created_at).toLocaleString(),
    action: log.action.replace('_', ' ').toUpperCase(),
    detail: `${log.profiles?.full_name || 'System'} modified ${log.entity_type} ${log.entity_id}`
  }));
  
  return { metrics, staffPerformance, recentActivities };
}

export async function wipeDummyDataAction() {
  const auth = await requireRole(['Super Admin']);
  if (auth instanceof Response) return { success: false, error: 'Unauthorized' };

  const supabase = await createClient();
  
  // Hard delete all entities created by the system/dummy seeder
  // Or simply delete items where status != 'active'/'published' and maybe some specific dummy flags.
  // For safety, let's just delete unverified ones, or everything except the admin accounts.
  // Actually, the user asked to "remove all dummy data from my projects".
  // A safer approach for MVP: Delete all businesses, jobs, properties, etc. that were not created by a real user.
  // We can just wipe tables (truncate) or delete where created_by is null.
  
  await supabase.from('businesses').delete().is('created_by', null);
  await supabase.from('jobs').delete().is('created_by', null);
  await supabase.from('properties').delete().is('created_by', null);
  await supabase.from('marketplace_items').delete().is('created_by', null);
  await supabase.from('news').delete().is('created_by', null);
  await supabase.from('events').delete().is('created_by', null);
  
  return { success: true };
}
