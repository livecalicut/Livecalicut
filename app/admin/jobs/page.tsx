'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { fetchAdminJobsAction } from './actions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Search, CheckCircle2, XCircle, Building2, MapPin } from 'lucide-react';

export default function AdminJobsPage() {
  const [search, setSearch] = useState('');

  const [jobsList, setJobsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const res = await fetchAdminJobsAction();
    if (res.success) {
      setJobsList(res.data || []);
    }
    setLoading(false);
  };

  const toggleJobStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'published' ? 'reject' : 'approve';
    const res = await fetch('/api/v1/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'job', entityId: id, action })
    });
    if (res.ok) loadJobs();
  };

  const deleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    const res = await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'job', entityId: id, hardDelete: true })
    });
    if (res.ok) loadJobs();
  };

  const filteredJobs = jobsList.filter((j) => j.title?.toLowerCase().includes(search.toLowerCase()) || j.businesses?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Cyberpark Jobs' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Briefcase className="w-7 h-7 text-[#2563EB]" />
                <span>Cyberpark & Local IT Jobs Desk</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Approve tech vacancies, verify Cyberpark corporate listings, and manage walk-in drives</p>
            </div>

            <Link href="/merchant/jobs/create">
              <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> Post New Job Opening
              </button>
            </Link>
          </div>

          {/* Search Card */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title or IT company..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Showing {filteredJobs.length} Vacancies</span>
          </Card>

          {/* Jobs Table Card */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Position / Company</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Compensation</th>
                    <th className="py-3.5 px-4">Job Type</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8">Loading jobs...</td></tr>
                  ) : filteredJobs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8">No jobs found</td></tr>
                  ) : filteredJobs.map((j) => (
                    <tr key={j.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{j.title}</p>
                        <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#2563EB]" /> {j.businesses?.name || 'Unknown Company'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-[#4B5563] font-medium">{j.location || j.city_id}</td>
                      <td className="py-4 px-4 text-emerald-600 font-extrabold">{j.salary}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold border border-blue-200 uppercase">
                          {j.employment_type?.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleJobStatus(j.id, j.status)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            j.status === 'published'
                              ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                              : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {j.status === 'published' ? 'Close Opening' : 'Publish Opening'}
                        </button>
                        <button
                          onClick={() => deleteJob(j.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
