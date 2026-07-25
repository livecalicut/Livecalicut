import React from 'react';
import Link from 'next/link';
import { Users, Store, Briefcase, Building, ShoppingBag, Newspaper, ArrowUpRight } from 'lucide-react';
import { fetchPlatformAnalyticsAction } from './actions';
import { StatTile } from '@/components/dashboard/stat-tile';
import { BarBreakdown } from '@/components/dashboard/bar-breakdown';
import { TrendChart } from '@/components/dashboard/trend-chart';
import { Card } from '@/components/ui/card';

export const metadata = { title: 'Platform Analytics — LiveCalicut Admin' };

export default async function AdminAnalyticsPage() {
  const { authorized, totals, statusMix, categoryMix, areaMix, trend } =
    await fetchPlatformAnalyticsAction();

  if (!authorized) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <h1 className="text-lg font-extrabold text-[#111827]">Platform Analytics</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Analytics is limited to Super Admin and City Admin accounts.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            Platform Analytics
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Live totals and growth across every LiveCalicut vertical.
          </p>
        </div>

        <Link
          href="/admin/audit-logs"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#111827] shadow-xs transition-all hover:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
        >
          <span>Audit trail</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile title="Citizens" value={totals.users} icon={Users} tone="blue" />
        <StatTile title="Outlets" value={totals.businesses} icon={Store} tone="cyan" />
        <StatTile title="Jobs" value={totals.jobs} icon={Briefcase} tone="emerald" />
        <StatTile title="Properties" value={totals.properties} icon={Building} tone="indigo" />
        <StatTile title="Classifieds" value={totals.marketplace} icon={ShoppingBag} tone="purple" />
        <StatTile title="News" value={totals.news} icon={Newspaper} tone="teal" />
      </div>

      <TrendChart
        title="Six-month growth"
        rows={trend}
        series={[
          { key: 'businesses', label: 'Outlets', color: '#2563EB' },
          { key: 'jobs', label: 'Jobs', color: '#10B981' },
          { key: 'users', label: 'Citizens', color: '#A855F7' },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <BarBreakdown title="Outlets by category" rows={categoryMix} />
        <BarBreakdown title="Outlets by area" rows={areaMix} />
        <BarBreakdown title="Listing status mix" rows={statusMix} />
      </div>
    </>
  );
}
