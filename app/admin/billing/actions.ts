'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/supabase/require-auth';
import type { Breakdown } from '@/app/admin/analytics/actions';

export type PaymentRow = {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  created_at: string;
};

export type BillingOverview = {
  authorized: boolean;
  revenueCaptured: number;
  revenuePending: number;
  activeSubscriptions: number;
  paymentsCount: number;
  invoicesCount: number;
  planMix: Breakdown[];
  statusMix: Breakdown[];
  recentPayments: PaymentRow[];
};

const EMPTY: BillingOverview = {
  authorized: false,
  revenueCaptured: 0,
  revenuePending: 0,
  activeSubscriptions: 0,
  paymentsCount: 0,
  invoicesCount: 0,
  planMix: [],
  statusMix: [],
  recentPayments: [],
};

export async function fetchBillingOverviewAction(): Promise<BillingOverview> {
  const auth = await requireRole(['Super Admin']);
  if (auth instanceof NextResponse) return EMPTY;

  const supabase = await createClient();

  const [
    { data: payments },
    { count: activeSubscriptions },
    { count: invoicesCount },
    { data: subscriptions },
  ] = await Promise.all([
    supabase
      .from('payments')
      .select('id, amount, currency, status, payment_gateway, created_at, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .is('deleted_at', null),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase
      .from('subscriptions')
      .select('subscription_plans(name)')
      .is('deleted_at', null)
      .limit(1000),
  ]);

  const rows = payments ?? [];

  const nameOf = (rel: unknown, key: 'full_name' | 'email' | 'name'): string | undefined => {
    if (Array.isArray(rel)) return (rel[0] as Record<string, string> | undefined)?.[key];
    return (rel as Record<string, string> | null)?.[key];
  };

  const sumWhere = (status: string) =>
    rows
      .filter((row) => row.status === status)
      .reduce((total, row) => total + Number(row.amount ?? 0), 0);

  const statusCounts = new Map<string, number>();
  for (const row of rows) {
    const key = (row.status as string) ?? 'unknown';
    statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);
  }

  const planCounts = new Map<string, number>();
  for (const sub of subscriptions ?? []) {
    const plan = nameOf(sub.subscription_plans, 'name') ?? 'Unknown plan';
    planCounts.set(plan, (planCounts.get(plan) ?? 0) + 1);
  }

  return {
    authorized: true,
    revenueCaptured: sumWhere('captured'),
    revenuePending: sumWhere('pending'),
    activeSubscriptions: activeSubscriptions ?? 0,
    paymentsCount: rows.length,
    invoicesCount: invoicesCount ?? 0,
    planMix: [...planCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    statusMix: [...statusCounts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count),
    recentPayments: rows.slice(0, 15).map((row) => ({
      id: row.id as string,
      merchant:
        nameOf(row.profiles, 'full_name') ?? nameOf(row.profiles, 'email') ?? 'Unknown merchant',
      amount: Number(row.amount ?? 0),
      currency: (row.currency as string) ?? 'INR',
      status: (row.status as string) ?? 'unknown',
      gateway: (row.payment_gateway as string) ?? 'razorpay',
      created_at: row.created_at as string,
    })),
  };
}
