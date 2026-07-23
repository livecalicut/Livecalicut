'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { Flag, CheckCircle2, Trash2, ShieldAlert, XCircle } from 'lucide-react';
import { fetchAdminReportsAction } from './actions';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const res = await fetchAdminReportsAction();
    if (res.success) {
      setReports(res.data || []);
    }
    setLoading(false);
  };

  const dismissReport = async (id: string) => {
    // Ideally call an API to update report resolution_status to 'dismissed'
    // For now we'll just update UI to filter it
    setReports(reports.filter((r) => r.id !== id));
  };

  const deleteReport = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    const res = await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'report', entityId: id, hardDelete: true })
    });
    if (res.ok) loadReports();
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Moderation Flags' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <Flag className="w-7 h-7 text-rose-600" />
              <span>Moderation & Content Safety Queue</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Review user report flags, moderate inappropriate reviews, or issue account warnings</p>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center py-8 text-sm text-[#6B7280]">Loading reports...</p>
            ) : reports.map((rep) => (
              <Card key={rep.id} className="p-6 border border-rose-200 bg-white rounded-3xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
                    {rep.entity_type} Flag
                  </span>
                  <span className="text-xs text-[#6B7280]">Reported by {rep.reporter?.full_name || 'Anonymous User'}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#111827] font-sans">Entity ID: {rep.entity_id}</h4>
                  <p className="text-xs font-medium text-rose-600">Reason: {rep.reason}</p>
                  <p className="text-xs text-[#4B5563]">Details: {rep.details || 'No additional details provided.'}</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => dismissReport(rep.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Dismiss Flag
                  </button>
                  <button
                    onClick={() => deleteReport(rep.id)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Delete Report
                  </button>
                </div>
              </Card>
            ))}

            {!loading && reports.length === 0 && (
              <Card className="p-12 text-center space-y-3 border border-[#E5E7EB] bg-white rounded-3xl">
                <ShieldAlert className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-[#111827]">Zero Pending Moderation Flags</h3>
                <p className="text-xs text-[#6B7280]">All citizen reports across Kozhikode wards have been resolved!</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
