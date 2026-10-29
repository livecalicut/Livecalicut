'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Flame, Plus, Star, XCircle } from 'lucide-react';
import { fetchAdminJobsAction } from './actions';
import {
  AdminEntityTable,
  AdminPageHeader,
  IconButton,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { adminApi } from '@/lib/admin/client';
import { toast } from '@/lib/toast';

type Job = {
  id: string;
  title: string;
  status: string;
  is_featured: boolean;
  is_urgent?: boolean;
  salary?: string | null;
  employment_type?: string | null;
  location?: string | null;
  application_deadline?: string | null;
  created_at: string;
  businesses?: { name: string } | null;
  job_categories?: { name: string } | null;
  [key: string]: any;
};

const humanize = (v?: string | null) => (v ? v.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');

const columns: Column<Job>[] = [
  {
    key: 'title',
    header: 'Position',
    sortValue: (j) => j.title,
    cell: (j) => (
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate font-semibold text-[#111827]">
          {j.title}
          {j.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
          {j.is_urgent && <Flame className="h-3.5 w-3.5 shrink-0 text-rose-500" />}
        </p>
        <p className="text-[11px] text-[#6B7280]">{j.businesses?.name || 'Unknown company'}</p>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    hideOnMobile: true,
    sortValue: (j) => j.job_categories?.name,
    cell: (j) => j.job_categories?.name || '—',
  },
  {
    key: 'employment_type',
    header: 'Type',
    hideOnMobile: true,
    sortValue: (j) => j.employment_type,
    cell: (j) => humanize(j.employment_type) || '—',
  },
  { key: 'salary', header: 'Salary', hideOnMobile: true, cell: (j) => j.salary || '—' },
  { key: 'status', header: 'Status', sortValue: (j) => j.status, cell: (j) => <StatusBadge status={j.status} /> },
  {
    key: 'created_at',
    header: 'Posted',
    hideOnMobile: true,
    sortValue: (j) => j.created_at,
    cell: (j) => formatDate(j.created_at),
  },
];

const filters: TableFilter<Job>[] = [
  {
    key: 'status',
    label: 'Statuses',
    options: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'closed', label: 'Closed' },
    ],
    match: (j, v) => j.status === v,
  },
  {
    key: 'employment_type',
    label: 'Job types',
    options: ['full-time', 'part-time', 'internship', 'temporary', 'contract', 'freelance', 'walk-in', 'wfh'].map(
      (value) => ({ value, label: humanize(value) })
    ),
    match: (j, v) => j.employment_type === v,
  },
  {
    key: 'featured',
    label: 'Listings',
    options: [
      { value: 'featured', label: 'Featured' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'standard', label: 'Standard' },
    ],
    match: (j, v) => (v === 'featured' ? j.is_featured : v === 'urgent' ? !!j.is_urgent : !j.is_featured),
  },
];

export default function AdminJobsPage() {
  const [rows, setRows] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetchAdminJobsAction();
    if (res.success) setRows((res.data as Job[]) || []);
    else toast.error('Could not load jobs', res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const moderate = async (j: Job, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    try {
      await adminApi.moderate('job', j.id, action);
      toast.success('Job updated', j.title);
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Jobs"
        description="Publish vacancies, close filled openings and feature priority hiring."
        count={rows.length}
        actions={
          <Link href="/merchant/jobs/create" className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Post job
          </Link>
        }
      />

      <AdminEntityTable<Job>
        entityType="job"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        searchText={(j) =>
          `${j.title} ${j.businesses?.name ?? ''} ${j.job_categories?.name ?? ''} ${j.location ?? ''} ${j.salary ?? ''}`
        }
        searchPlaceholder="Search title, company, category…"
        emptyMessage="No jobs yet."
        titleOf={(j) => j.title}
        subtitleOf={(j) => <StatusBadge status={j.status} />}
        extraViewFields={(j) => [
          { label: 'Company', value: j.businesses?.name },
          { label: 'Category', value: j.job_categories?.name },
          { label: 'Location', value: j.location },
          { label: 'Posted', value: formatDate(j.created_at, true) },
        ]}
        rowActions={(j) => (
          <>
            {j.status !== 'published' && (
              <IconButton label="Publish" onClick={() => moderate(j, 'approve')}>
                <CheckCircle2 className="h-4 w-4" />
              </IconButton>
            )}
            {j.status === 'published' && (
              <IconButton label="Close opening" tone="danger" onClick={() => moderate(j, 'reject')}>
                <XCircle className="h-4 w-4" />
              </IconButton>
            )}
            <IconButton
              label={j.is_featured ? 'Remove from featured' : 'Feature'}
              onClick={() => moderate(j, j.is_featured ? 'unfeature' : 'feature')}
            >
              <Star className={`h-4 w-4 ${j.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
            </IconButton>
          </>
        )}
      />
    </>
  );
}
