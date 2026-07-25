import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { StatsCards } from '@/components/admin/stats-cards';
import { Building2, Plus, Clock, Trophy, ArrowUpRight, ShieldAlert, BarChart3 } from 'lucide-react';
import { fetchDashboardDataAction } from './actions';
import { WipeDataButton } from './wipe-data-button';

export default async function AdminDashboardPage() {
  const { metrics, staffPerformance, recentActivities, authorized } =
    await fetchDashboardDataAction();

  if (!authorized) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-rose-500" aria-hidden="true" />
        <h1 className="mt-3 text-lg font-extrabold text-[#111827]">Control Center unavailable</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Your account does not have permission to view platform metrics.
        </p>
      </Card>
    );
  }

  return (
    <>
      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            Operations Control Center
          </h1>
          <p className="mt-1 text-sm font-normal text-[#6B7280]">
            Live governance dashboard for the LiveCalicut platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <WipeDataButton />

          <Link
            href="/admin/businesses"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#111827] shadow-xs transition-all hover:border-[#2563EB]"
          >
            <Building2 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" /> Add Outlet
          </Link>
          <Link
            href="/admin/jobs"
            className="flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white shadow-md transition-all hover:bg-[#1D4ED8]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Post IT Vacancy
          </Link>
        </div>
      </div>

      <StatsCards metrics={metrics} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Field Performance Leaderboard */}
        <div className="space-y-4 lg:col-span-8">
          <h2 className="flex items-center gap-2 font-sans text-lg font-extrabold text-[#111827]">
            <Trophy className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <span>Marketing Staff Leaderboard</span>
          </h2>

          <div className="space-y-3">
            {staffPerformance.length === 0 ? (
              <Card className="rounded-2xl p-5 text-center text-sm text-[#6B7280]">
                No marketing staff have onboarded listings yet.
              </Card>
            ) : (
              staffPerformance.map((staff, index) => (
                <Card
                  key={staff.id}
                  className="flex flex-col gap-4 rounded-2xl p-5 transition-all hover:border-blue-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-[#111827]">{staff.name}</h3>
                      <p className="text-xs text-[#6B7280]">Marketing Executive</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-xs text-[#6B7280]">Businesses</p>
                      <p className="font-bold text-[#111827] tabular-nums">{staff.businesses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Properties</p>
                      <p className="font-bold text-[#111827] tabular-nums">{staff.properties}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                      <p className="text-xs font-bold text-emerald-700">Total</p>
                      <p className="text-lg font-extrabold text-emerald-700 tabular-nums">
                        {staff.total}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Approval Queue & Audit Feed */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h2 className="flex items-center gap-2 font-sans text-sm font-extrabold text-[#111827]">
                <Clock className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span>Approval Queue</span>
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  metrics.pendingApprovals > 0
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {metrics.pendingApprovals > 0 ? `${metrics.pendingApprovals} waiting` : 'All clear'}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-[#6B7280]">
              {metrics.pendingApprovals > 0
                ? 'Listings submitted by merchants are awaiting moderation before they go live.'
                : 'Every submitted listing has been reviewed. Nothing is waiting on you.'}
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/businesses"
                className="rounded-xl border border-[#E5E7EB] px-3 py-1.5 text-[11px] font-bold text-[#111827] transition-colors hover:border-[#2563EB]"
              >
                Review outlets
              </Link>
              <Link
                href="/admin/reports"
                className="rounded-xl border border-[#E5E7EB] px-3 py-1.5 text-[11px] font-bold text-[#111827] transition-colors hover:border-[#2563EB]"
              >
                Moderation flags
              </Link>
            </div>
          </Card>

          <Card className="space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h2 className="font-sans text-sm font-extrabold text-[#111827]">
                Live Audit Activity
              </h2>
              <Link
                href="/admin/audit-logs"
                className="flex items-center gap-0.5 text-xs font-bold text-[#2563EB] hover:underline"
              >
                <span>View All</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {recentActivities.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#6B7280]">
                No administrative actions recorded yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-[#111827]">{act.action}</span>
                        <span className="text-[10px] text-[#9CA3AF]">{act.time}</span>
                      </div>
                      <p className="text-[11px] leading-snug break-words text-[#6B7280]">
                        {act.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Link
            href="/admin/analytics"
            className="flex items-center justify-between gap-3 rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-6 text-white shadow-md transition-transform hover:-translate-y-0.5"
          >
            <div>
              <p className="font-sans text-sm font-extrabold">Platform Analytics</p>
              <p className="mt-0.5 text-[11px] text-blue-100">
                Growth trends across every vertical
              </p>
            </div>
            <BarChart3 className="h-6 w-6 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
