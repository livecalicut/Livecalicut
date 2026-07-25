'use server';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';
import { MerchantService, type MerchantLead } from '@/lib/services/merchant.service';

export type MerchantReview = {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type MerchantSubscription = {
  planName: string;
  billingCycle: string;
  status: string;
  daysRemaining: number | null;
};

export type MerchantDashboardData = {
  authorized: boolean;
  hasBusiness: boolean;
  businessName: string;
  isVerified: boolean;
  metrics: {
    totalViews: number;
    totalReviews: number;
    ratingAvg: number;
    newLeadsCount: number;
    profileCompletion: number;
  };
  leads: MerchantLead[];
  reviews: MerchantReview[];
  subscription: MerchantSubscription | null;
};

const EMPTY: MerchantDashboardData = {
  authorized: false,
  hasBusiness: false,
  businessName: '',
  isVerified: false,
  metrics: {
    totalViews: 0,
    totalReviews: 0,
    ratingAvg: 0,
    newLeadsCount: 0,
    profileCompletion: 0,
  },
  leads: [],
  reviews: [],
  subscription: null,
};

export async function fetchMerchantDashboardAction(): Promise<MerchantDashboardData> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return EMPTY;

  const { supabase, user } = auth;

  const [businesses, metrics, leads] = await Promise.all([
    MerchantService.getOwnedBusinesses(supabase, user.id),
    MerchantService.getDashboardMetrics(supabase, user.id),
    MerchantService.getCustomerLeads(supabase, user.id),
  ]);

  if (businesses.length === 0) {
    return { ...EMPTY, authorized: true };
  }

  const businessIds = businesses.map((b) => b.id);

  const [{ data: reviewRows }, { data: subscriptionRow }] = await Promise.all([
    supabase
      .from('business_reviews')
      .select('id, rating, comment, created_at, profiles(full_name)')
      .in('business_id', businessIds)
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('subscriptions')
      .select('billing_cycle, status, ends_at, subscription_plans(name)')
      .eq('merchant_id', user.id)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('ends_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const nameOf = (rel: unknown, key: 'full_name' | 'name'): string | undefined => {
    if (Array.isArray(rel)) return (rel[0] as Record<string, string> | undefined)?.[key];
    return (rel as Record<string, string> | null)?.[key];
  };

  const reviews: MerchantReview[] = (reviewRows ?? []).map((row: any) => ({
    id: row.id,
    reviewer: nameOf(row.profiles, 'full_name') ?? 'Verified customer',
    rating: row.rating ?? 0,
    comment: row.comment ?? '',
    created_at: row.created_at,
  }));

  let subscription: MerchantSubscription | null = null;
  if (subscriptionRow) {
    const endsAt = subscriptionRow.ends_at ? new Date(subscriptionRow.ends_at as string) : null;
    const daysRemaining = endsAt
      ? Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86_400_000))
      : null;

    subscription = {
      planName: nameOf(subscriptionRow.subscription_plans, 'name') ?? 'Active plan',
      billingCycle: (subscriptionRow.billing_cycle as string) ?? 'monthly',
      status: (subscriptionRow.status as string) ?? 'active',
      daysRemaining,
    };
  }

  return {
    authorized: true,
    hasBusiness: true,
    businessName: (businesses[0].name as string) ?? 'Your outlet',
    isVerified: Boolean(businesses[0].is_verified),
    metrics: {
      totalViews: metrics.totalViews,
      totalReviews: metrics.totalReviews,
      ratingAvg: metrics.ratingAvg,
      newLeadsCount: metrics.newLeadsCount,
      profileCompletion: metrics.profileCompletion,
    },
    leads: leads.slice(0, 6),
    reviews,
    subscription,
  };
}
