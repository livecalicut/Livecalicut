import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCards } from '@/components/admin/stats-cards';
import { Building2, Plus, Clock, CheckCircle2, AlertTriangle, Activity, Database, Trophy, Trash2, ArrowUpRight } from 'lucide-react';
import { fetchDashboardDataAction } from './actions';
import { WipeDataButton } from './wipe-data-button';

export default async function AdminDashboardPage() {
  const { metrics, staffPerformance, recentActivities } = await fetchDashboardDataAction();

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Persistent SaaS Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Control Center' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header Banner & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans">
                Enterprise Operations Control Center
              </h1>
              <p className="text-sm text-[#6B7280] mt-1 font-normal">
                Real-time governance dashboard for 21 spatial wards across Kozhikode
              </p>
            </div>

            <div className="flex items-center gap-3">
              <WipeDataButton />
              
              <Link href="/admin/businesses">
                <button className="h-[40px] px-4 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-[#111827] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#2563EB]" /> Add Outlet
                </button>
              </Link>
              <Link href="/admin/jobs">
                <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Post IT Vacancy
                </button>
              </Link>
            </div>
          </div>

          {/* SaaS High-Impact Metrics Grid */}
          <StatsCards metrics={metrics} />

          {/* Two-Column Grid: Approval Queue & Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Field Performance Leaderboard */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#111827] flex items-center gap-2 font-sans">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Marketing Staff Leaderboard</span>
                </h3>
              </div>

              <div className="space-y-3">
                {staffPerformance.length === 0 ? (
                  <Card className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs text-center text-sm text-[#6B7280]">
                    No marketing staff data available.
                  </Card>
                ) : (
                  staffPerformance.map((staff, index) => (
                    <Card key={staff.id} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-[#111827]">{staff.name}</h4>
                          <p className="text-xs text-[#6B7280]">Marketing Executive</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <p className="text-xs text-[#6B7280]">Businesses</p>
                          <p className="font-bold text-[#111827]">{staff.businesses}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Properties</p>
                          <p className="font-bold text-[#111827]">{staff.properties}</p>
                        </div>
                        <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                          <p className="text-xs font-bold text-emerald-700">Total</p>
                          <p className="font-extrabold text-emerald-700 text-lg">{staff.total}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Platform Audit Feed & System Health */}
            <div className="lg:col-span-4 space-y-6">
              {/* System Health Status */}
              <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h4 className="text-sm font-extrabold text-[#111827] font-sans flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>System Infrastructure</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    100% Operational
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Universal Search Engine Latency</span>
                    <span className="font-bold text-[#111827]">14ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Supabase Auth Session Refresh</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Active Ward Physical Verification</span>
                    <span className="font-bold text-[#2563EB]">21 / 21 Wards</span>
                  </div>
                </div>
              </Card>

              {/* Real-time Activity Audit Feed */}
              <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h4 className="text-sm font-extrabold text-[#111827] font-sans">
                    Live Audit Activity
                  </h4>
                  <Link href="/admin/audit-logs" className="text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-0.5">
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentActivities.map((act, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#111827]">{act.action}</span>
                          <span className="text-[10px] text-[#9CA3AF]">{act.time}</span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] leading-snug">{act.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
