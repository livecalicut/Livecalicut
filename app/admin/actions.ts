'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { AdminService } from '@/lib/services/admin.service';

const EMPTY_METRICS = {
  totalUsers: 0,
  activeBusinesses: 0,
  activeJobs: 0,
  marketplaceItems: 0,
  activeProperties: 0,
  publishedNews: 0,
  upcomingEvents: 0,
  reportedContent: 0,
  pendingApprovals: 0,
};

export async function fetchDashboardDataAction() {
  // Server actions are publicly callable endpoints, so this needs the same
  // role gate as any API route.
  const auth = await requireRole([
    'Super Admin',
    'City Admin',
    'Moderator',
    'Marketing Executive',
  ]);
  if (auth instanceof NextResponse) {
    return { metrics: EMPTY_METRICS, staffPerformance: [], recentActivities: [], authorized: false };
  }

  const supabase = await createClient();

  const scope = { userId: auth.user.id, role: auth.user.role };
  const isScoped = auth.user.role === 'Marketing Executive';

  const [metrics, staffPerformance, auditLogs] = await Promise.all([
    AdminService.getDashboardMetrics(supabase, scope),
    isScoped ? Promise.resolve([]) : AdminService.getStaffPerformance(supabase),
    isScoped ? Promise.resolve([]) : AdminService.getAuditLogs(supabase),
  ]);

  const recentActivities = auditLogs.slice(0, 5).map((log) => ({
    time: new Date(log.created_at).toLocaleString(),
    action: String(log.action || '').replace('_', ' ').toUpperCase(),
    detail: `${log.profiles?.full_name || 'System'} modified ${log.target_entity}${
      log.target_id ? ` ${log.target_id}` : ''
    }`,
  }));

  return { metrics, staffPerformance, recentActivities, authorized: true };
}

/** Seeded demo rows. Real user content and reference data (cities, areas, roles) stay. */
const DUMMY_SLUGS: Record<string, string[]> = {
  jobs: [
    'frontend-engineer-nextjs-cyberpark',
    'backend-engineer-supabase-cyberpark',
    'ui-designer-product-cyberpark',
    'qa-engineer-internship-cyberpark',
  ],
  businesses: [
    'beachside-paragon',
    'cyberpark-hub-cafe',
    'sm-street-textiles',
    'malabar-care-clinic',
    'mavoor-stay-inn',
    'zam-zam-mandi-house',
  ],
  news: [
    'cyberpark-expansion-2026',
    'beach-road-weekend-market',
    'mavoor-road-signal-upgrade',
  ],
  companies: ['malabar-soft-labs'],
};

export async function wipeDummyDataAction() {
  const auth = await requireRole(['Super Admin']);
  if (auth instanceof Response) return { success: false, error: 'Unauthorized' };

  const { createAdminClient } = await import('@/lib/supabase/server');
  const supabase = await createAdminClient();
  const removed: string[] = [];

  for (const [table, slugs] of Object.entries(DUMMY_SLUGS)) {
    const { data, error } = await supabase.from(table).delete().in('slug', slugs).select('id');
    if (error) return { success: false, error: `${table}: ${error.message}` };
    removed.push(`${table}:${data?.length || 0}`);
  }

  return { success: true, removed };
}
