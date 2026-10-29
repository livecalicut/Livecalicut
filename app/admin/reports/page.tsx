'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Trash2, XCircle } from 'lucide-react';
import { fetchAdminReportsAction, resolveReportAction } from './actions';
import {
  AdminPageHeader,
  ConfirmDialog,
  DataTable,
  IconButton,
  RecordDrawer,
  StatusBadge,
  formatDate,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { adminApi } from '@/lib/admin/client';
import { toast } from '@/lib/toast';

type Report = {
  id: string;
  entity_type: string;
  entity_id: string;
  reason: string;
  details?: string | null;
  resolution_status?: string | null;
  created_at: string;
  reporter?: { full_name?: string | null } | null;
  [key: string]: any;
};

type Resolution = 'resolved' | 'dismissed';

const label = (s: string) => s.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const resolutionOf = (r: Report) => r.resolution_status || 'pending';
const reporterOf = (r: Report) => r.reporter?.full_name || 'Anonymous';
const titleOf = (r: Report) => `${label(r.entity_type)} flagged: ${label(r.reason)}`;

const RESOLUTION_TONE: Record<string, 'green' | 'amber' | 'blue' | 'gray'> = {
  pending: 'amber',
  investigating: 'blue',
  resolved: 'green',
  dismissed: 'gray',
};

const resolutionBadge = (r: Report) => (
  <StatusBadge status={resolutionOf(r)} tone={RESOLUTION_TONE[resolutionOf(r)]} />
);

const columns: Column<Report>[] = [
  {
    key: 'reason',
    header: 'Report',
    sortValue: (r) => r.reason,
    cell: (r) => (
      <div className="min-w-0 max-w-xs">
        <p className="truncate font-semibold text-[#111827]">{label(r.reason)}</p>
        <p className="truncate text-[11px] text-[#6B7280]">{r.details || 'No additional details'}</p>
      </div>
    ),
  },
  {
    key: 'entity_type',
    header: 'Content',
    sortValue: (r) => r.entity_type,
    cell: (r) => <StatusBadge status={r.entity_type} tone="red" />,
  },
  { key: 'reporter', header: 'Reported by', hideOnMobile: true, sortValue: reporterOf, cell: reporterOf },
  { key: 'status', header: 'Status', sortValue: resolutionOf, cell: resolutionBadge },
  {
    key: 'created_at',
    header: 'Reported',
    hideOnMobile: true,
    sortValue: (r) => r.created_at,
    cell: (r) => formatDate(r.created_at),
  },
];

export default function AdminReportsPage() {
  const [rows, setRows] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Report | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetchAdminReportsAction();
    if (res.success) setRows((res.data as Report[]) || []);
    else toast.error('Could not load reports', res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resolve = async (r: Report, resolution: Resolution) => {
    const res = await resolveReportAction(r.id, resolution);
    if (!res.success) {
      toast.error('Report not updated', res.error);
      return;
    }
    toast.success(resolution === 'resolved' ? 'Report resolved' : 'Report dismissed', titleOf(r));
    setViewing(null);
    await load();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApi.remove('report', pendingDelete.id);
      toast.success('Report deleted', titleOf(pendingDelete));
      setPendingDelete(null);
      setViewing(null);
      await load();
    } catch (err) {
      toast.error('Delete failed', err instanceof Error ? err.message : undefined);
    } finally {
      setDeleting(false);
    }
  };

  const entityTypes = Array.from(new Set(rows.map((r) => r.entity_type))).sort();
  const filters: TableFilter<Report>[] = [
    {
      key: 'status',
      label: 'Statuses',
      options: ['pending', 'investigating', 'resolved', 'dismissed'].map((v) => ({ value: v, label: label(v) })),
      match: (r, v) => resolutionOf(r) === v,
    },
    {
      key: 'entity_type',
      label: 'Content types',
      options: entityTypes.map((v) => ({ value: v, label: label(v) })),
      match: (r, v) => r.entity_type === v,
    },
  ];

  const isOpen = (r: Report) => !['resolved', 'dismissed'].includes(resolutionOf(r));
  const pendingCount = rows.filter(isOpen).length;

  return (
    <>
      <AdminPageHeader
        title="Moderation"
        description={`Review reported content and close out flags. ${pendingCount} open.`}
        count={rows.length}
      />

      <DataTable<Report>
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        filters={filters}
        searchText={(r) => `${r.reason} ${r.details ?? ''} ${r.entity_type} ${r.entity_id} ${reporterOf(r)}`}
        searchPlaceholder="Search reason, details, reporter…"
        emptyMessage="No reports — the moderation queue is clear."
        onView={setViewing}
        rowActions={(r) => (
          <>
            {isOpen(r) && (
              <>
                <IconButton label="Resolve" onClick={() => resolve(r, 'resolved')}>
                  <CheckCircle2 className="h-4 w-4" />
                </IconButton>
                <IconButton label="Dismiss" onClick={() => resolve(r, 'dismissed')}>
                  <XCircle className="h-4 w-4" />
                </IconButton>
              </>
            )}
            <IconButton label="Delete" tone="danger" onClick={() => setPendingDelete(r)}>
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </>
        )}
      />

      <RecordDrawer
        open={viewing !== null}
        title={viewing ? titleOf(viewing) : ''}
        subtitle={viewing && resolutionBadge(viewing)}
        fields={
          viewing
            ? [
                { label: 'Content type', value: label(viewing.entity_type) },
                { label: 'Reason', value: label(viewing.reason) },
                {
                  label: 'Content ID',
                  value: <span className="font-mono text-xs">{viewing.entity_id}</span>,
                  wide: true,
                },
                { label: 'Details', value: viewing.details, wide: true },
                { label: 'Reported by', value: reporterOf(viewing) },
                { label: 'Reported', value: formatDate(viewing.created_at, true) },
                { label: 'Last updated', value: formatDate(viewing.updated_at, true) },
              ]
            : []
        }
        onClose={() => setViewing(null)}
        footer={
          viewing && (
            <>
              <button
                type="button"
                onClick={() => {
                  setPendingDelete(viewing);
                  setViewing(null);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
              {isOpen(viewing) && (
                <>
                  <button
                    type="button"
                    onClick={() => resolve(viewing, 'dismissed')}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#374151] hover:border-[#2563EB] hover:text-[#2563EB]"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Dismiss
                  </button>
                  <button
                    type="button"
                    onClick={() => resolve(viewing, 'resolved')}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                  </button>
                </>
              )}
            </>
          )
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this report?"
        message="The report will be permanently removed. The reported content is not affected."
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
