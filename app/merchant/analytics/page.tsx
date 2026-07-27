import React from 'react';
import Link from 'next/link';
import { Gauge } from 'lucide-react';
import { fetchMerchantAnalyticsAction } from './actions';
import { StatTile } from '@/components/dashboard/stat-tile';
import { BarBreakdown } from '@/components/dashboard/bar-breakdown';
import { Card } from '@/components/ui/card';

export const metadata = { title: 'Store Analytics — LiveCalicut Merchant' };

export default async function MerchantAnalyticsPage() {
  const data = await fetchMerchantAnalyticsAction();

  if (!data.authorized) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <h1 className="text-lg font-extrabold text-[#111827]">Store Analytics</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Sign in as a merchant to view your analytics.</p>
      </Card>
    );
  }

  if (!data.hasBusiness) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <h1 className="text-lg font-extrabold text-[#111827]">No listing yet</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
          Analytics will appear here once your business listing is registered and approved.
        </p>
        <Link
          href="/merchant/profile"
          className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Complete your profile
        </Link>
      </Card>
    );
  }

  return (
    <>
      <div>
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
          Store Analytics
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Real engagement figures for your LiveCalicut listings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile title="Storefront views" value={data.totalViews} icon="eye" tone="blue" />
        <StatTile title="Reviews" value={data.totalReviews} icon="star" tone="amber" />
        <StatTile
          title="Average rating"
          value={data.ratingAvg}
          icon="star"
          tone="emerald"
          hint="Weighted across all listings"
        />
        <StatTile title="Total leads" value={data.leadsTotal} icon="users" tone="purple" />
        <StatTile
          title="Awaiting reply"
          value={data.leadsPending}
          icon="message-square"
          tone="rose"
        />
        <StatTile title="Listings" value={data.listingsCount} icon="store" tone="cyan" />
      </div>

      <Card className="space-y-3 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-sans text-sm font-extrabold text-[#111827]">
            <Gauge className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
            Profile completion
          </h2>
          <span className="text-sm font-extrabold text-[#111827] tabular-nums">
            {data.profileCompletion}%
          </span>
        </div>
        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]"
          role="progressbar"
          aria-valuenow={data.profileCompletion}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completion"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-[width] duration-700"
            style={{ width: `${data.profileCompletion}%` }}
          />
        </div>
        {data.profileCompletion < 100 && (
          <p className="text-xs text-[#6B7280]">
            Listings with a complete profile rank higher in search.{' '}
            <Link href="/merchant/profile" className="font-bold text-[#2563EB] hover:underline">
              Finish your profile
            </Link>
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarBreakdown
          title="Views by listing"
          rows={data.viewsByListing}
          emptyLabel="No views recorded yet."
        />
        <BarBreakdown
          title="Reviews by listing"
          rows={data.ratingByListing}
          emptyLabel="No reviews yet."
        />
        <BarBreakdown
          title="Leads by type"
          rows={data.leadsByKind}
          emptyLabel="No leads received yet."
        />
      </div>
    </>
  );
}
