'use server';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/require-auth';
import { MerchantService } from '@/lib/services/merchant.service';
import type { Breakdown } from '@/app/admin/analytics/actions';

export type MerchantAnalytics = {
  authorized: boolean;
  hasBusiness: boolean;
  totalViews: number;
  totalReviews: number;
  ratingAvg: number;
  profileCompletion: number;
  listingsCount: number;
  leadsTotal: number;
  leadsPending: number;
  viewsByListing: Breakdown[];
  leadsByKind: Breakdown[];
  ratingByListing: Breakdown[];
};

const EMPTY: MerchantAnalytics = {
  authorized: false,
  hasBusiness: false,
  totalViews: 0,
  totalReviews: 0,
  ratingAvg: 0,
  profileCompletion: 0,
  listingsCount: 0,
  leadsTotal: 0,
  leadsPending: 0,
  viewsByListing: [],
  leadsByKind: [],
  ratingByListing: [],
};

export async function fetchMerchantAnalyticsAction(): Promise<MerchantAnalytics> {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return EMPTY;

  const { supabase, user } = auth;

  const [businesses, metrics, leads] = await Promise.all([
    MerchantService.getOwnedBusinesses(supabase, user.id),
    MerchantService.getDashboardMetrics(supabase, user.id),
    MerchantService.getCustomerLeads(supabase, user.id),
  ]);

  return {
    authorized: true,
    hasBusiness: metrics.hasBusiness,
    totalViews: metrics.totalViews,
    totalReviews: metrics.totalReviews,
    ratingAvg: metrics.ratingAvg,
    profileCompletion: metrics.profileCompletion,
    listingsCount: metrics.listingsCount,
    leadsTotal: leads.length,
    leadsPending: leads.filter((lead) => lead.status === 'pending').length,
    viewsByListing: businesses
      .map((b) => ({ label: b.name as string, count: (b.view_count as number) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    ratingByListing: businesses
      .map((b) => ({ label: b.name as string, count: (b.review_count as number) ?? 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    leadsByKind: [
      { label: 'Property inquiries', count: leads.filter((l) => l.kind === 'property').length },
      { label: 'Job applications', count: leads.filter((l) => l.kind === 'job').length },
    ].filter((row) => row.count > 0),
  };
}
