'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';

export type TrendPoint = { month: string; businesses: number; jobs: number; users: number };
export type Breakdown = { label: string; count: number };

export type PlatformAnalytics = {
  authorized: boolean;
  totals: {
    users: number;
    businesses: number;
    jobs: number;
    properties: number;
    marketplace: number;
    news: number;
  };
  statusMix: Breakdown[];
  categoryMix: Breakdown[];
  areaMix: Breakdown[];
  trend: TrendPoint[];
};

const EMPTY: PlatformAnalytics = {
  authorized: false,
  totals: { users: 0, businesses: 0, jobs: 0, properties: 0, marketplace: 0, news: 0 },
  statusMix: [],
  categoryMix: [],
  areaMix: [],
  trend: [],
};

/** Groups ISO timestamps into the trailing `months` buckets, oldest first. */
function bucketByMonth(rows: { created_at: string | null }[] | null, months: number) {
  const buckets = new Map<string, number>();
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, 0);
  }

  for (const row of rows ?? []) {
    if (!row.created_at) continue;
    const key = row.created_at.slice(0, 7);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return buckets;
}

function tally(values: (string | null | undefined)[], limit = 8): Breakdown[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = value?.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function fetchPlatformAnalyticsAction(): Promise<PlatformAnalytics> {
  const auth = await requireRole(['Super Admin', 'City Admin']);
  if (auth instanceof NextResponse) return EMPTY;

  const supabase = await createClient();

  const [
    { count: users },
    { count: businesses },
    { count: jobs },
    { count: properties },
    { count: marketplace },
    { count: news },
    { data: businessRows },
    { data: jobRows },
    { data: userRows },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('properties').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('marketplace_items').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('news').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    // Only the columns the aggregation needs, capped so a large table cannot
    // blow up the response.
    supabase
      .from('businesses')
      .select('created_at, status, business_categories(name), areas(name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(2000),
    supabase
      .from('jobs')
      .select('created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(2000),
    supabase
      .from('profiles')
      .select('created_at')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(2000),
  ]);

  const rows = businessRows ?? [];

  const businessBuckets = bucketByMonth(rows, 6);
  const jobBuckets = bucketByMonth(jobRows, 6);
  const userBuckets = bucketByMonth(userRows, 6);

  const trend: TrendPoint[] = [...businessBuckets.keys()].map((key) => {
    const [year, month] = key.split('-');
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-IN', {
      month: 'short',
    });
    return {
      month: label,
      businesses: businessBuckets.get(key) ?? 0,
      jobs: jobBuckets.get(key) ?? 0,
      users: userBuckets.get(key) ?? 0,
    };
  });

  // Supabase types embedded relations as either an object or an array depending
  // on the inferred cardinality, so normalise both shapes.
  const nameOf = (rel: unknown): string | undefined => {
    if (Array.isArray(rel)) return (rel[0] as { name?: string } | undefined)?.name;
    return (rel as { name?: string } | null)?.name;
  };

  return {
    authorized: true,
    totals: {
      users: users ?? 0,
      businesses: businesses ?? 0,
      jobs: jobs ?? 0,
      properties: properties ?? 0,
      marketplace: marketplace ?? 0,
      news: news ?? 0,
    },
    statusMix: tally(rows.map((r) => r.status as string | null)),
    categoryMix: tally(rows.map((r) => nameOf(r.business_categories))),
    areaMix: tally(rows.map((r) => nameOf(r.areas)), 6),
    trend,
  };
}
