'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminPageHeader,
  DataTable,
  RecordDrawer,
  formatDate,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { toast } from '@/lib/toast';

type AuditLog = {
  id: string;
  action: string;
  target_entity?: string | null;
  target_id?: string | null;
  metadata?: unknown;
  created_at: string;
  profiles?: { full_name?: string | null; email?: string | null } | null;
  [key: string]: any;
};

const label = (s: string) => s.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const actorOf = (l: AuditLog) => l.profiles?.full_name || l.profiles?.email || 'System';
const targetOf = (l: AuditLog) =>
  [l.target_entity && label(l.target_entity), l.target_id && `#${l.target_id.slice(0, 8)}`]
    .filter(Boolean)
    .join(' ');

const hasMetadata = (m: unknown) =>
  m !== null && m !== undefined && !(typeof m === 'object' && Object.keys(m as object).length === 0);

const columns: Column<AuditLog>[] = [
  {
    key: 'created_at',
    header: 'When',
    sortValue: (l) => l.created_at,
    cell: (l) => <span className="whitespace-nowrap text-[#6B7280]">{formatDate(l.created_at, true)}</span>,
  },
  {
    key: 'actor',
    header: 'Actor',
    sortValue: actorOf,
    cell: (l) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#111827]">{actorOf(l)}</p>
        {l.profiles?.full_name && l.profiles.email && (
          <p className="truncate text-[11px] text-[#6B7280]">{l.profiles.email}</p>
        )}
      </div>
    ),
  },
  {
    key: 'action',
    header: 'Action',
    sortValue: (l) => l.action,
    cell: (l) => (
      <span className="inline-flex rounded-md bg-[#EFF6FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#2563EB]">
        {l.action}
      </span>
    ),
  },
  {
    key: 'target',
    header: 'Target',
    hideOnMobile: true,
    sortValue: targetOf,
    cell: (l) => targetOf(l) || '—',
  },
];

export default function AdminAuditLogsPage() {
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<AuditLog | null>(null);

  // The API returns an empty list when the audit_logs table is missing
  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/audit-logs');
      const json = await res.json().catch(() => ({}));
      if (json.success) setRows(json.data || []);
      else toast.error('Could not load audit logs', json.error?.message || json.error);
    } catch (err) {
      toast.error('Could not load audit logs', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filters = useMemo<TableFilter<AuditLog>[]>(() => {
    const distinct = (values: (string | null | undefined)[]) =>
      Array.from(new Set(values.filter((v): v is string => Boolean(v)))).sort();
    return [
      {
        key: 'action',
        label: 'Actions',
        options: distinct(rows.map((l) => l.action)).map((v) => ({ value: v, label: v })),
        match: (l, v) => l.action === v,
      },
      {
        key: 'target_entity',
        label: 'Targets',
        options: distinct(rows.map((l) => l.target_entity)).map((v) => ({ value: v, label: label(v) })),
        match: (l, v) => l.target_entity === v,
      },
    ];
  }, [rows]);

  return (
    <>
      <AdminPageHeader
        title="Audit trail"
        description="Administrative activity: role changes, approvals, edits and deletions (latest 100)."
        count={rows.length}
      />

      <DataTable<AuditLog>
        rows={rows}
        columns={columns}
        getRowId={(l) => l.id}
        loading={loading}
        filters={filters}
        searchText={(l) =>
          `${l.action} ${actorOf(l)} ${l.profiles?.email ?? ''} ${l.target_entity ?? ''} ${l.target_id ?? ''}`
        }
        searchPlaceholder="Search action, actor, target…"
        emptyMessage="No administrative actions recorded yet."
        onView={setViewing}
      />

      <RecordDrawer
        open={viewing !== null}
        title={viewing?.action ?? ''}
        subtitle={viewing && formatDate(viewing.created_at, true)}
        fields={
          viewing
            ? [
                { label: 'Actor', value: actorOf(viewing) },
                { label: 'Actor email', value: viewing.profiles?.email },
                { label: 'Target type', value: viewing.target_entity && label(viewing.target_entity) },
                {
                  label: 'Target ID',
                  value: viewing.target_id ? <span className="font-mono text-xs">{viewing.target_id}</span> : null,
                },
                {
                  label: 'Metadata',
                  wide: true,
                  value: hasMetadata(viewing.metadata) ? (
                    <pre className="overflow-x-auto whitespace-pre rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3 font-mono text-[11px] leading-relaxed text-[#374151]">
                      {JSON.stringify(viewing.metadata, null, 2)}
                    </pre>
                  ) : null,
                },
                {
                  label: 'Log ID',
                  wide: true,
                  value: <span className="font-mono text-xs text-[#6B7280]">{viewing.id}</span>,
                },
              ]
            : []
        }
        onClose={() => setViewing(null)}
      />
    </>
  );
}
