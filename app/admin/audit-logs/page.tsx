'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/v1/admin/audit-logs');
        const json = await res.json();
        if (json.success) {
          setAuditLogs(json.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Audit Trail Logs' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#2563EB]" />
              <span>Platform Administrative Audit Trail</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Immutable system activity logs tracking role changes, approvals, and security events</p>
          </div>

          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Timestamp</th>
                    <th className="py-3.5 px-4">Administrative Actor</th>
                    <th className="py-3.5 px-4">Event Code</th>
                    <th className="py-3.5 px-6">Target Activity / Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-[#6B7280]">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-[#2563EB]" />
                        Loading real-time audit trail...
                      </td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-[#6B7280]">
                        <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#D1D5DB]" />
                        <p className="font-semibold text-sm">No recent administrative actions recorded.</p>
                      </td>
                    </tr>
                  ) : auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 text-[#6B7280] font-mono">
                        {new Date(log.created_at).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#111827]">
                        {log.profiles?.full_name || log.profiles?.email || 'System Default'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-mono font-bold border border-blue-200 uppercase">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#4B5563] font-medium">
                        Modified {log.target_entity} {log.target_id ? `(#${log.target_id.slice(0, 8)})` : ''}
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
