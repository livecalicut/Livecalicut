'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, EyeOff, Plus } from 'lucide-react';
import { fetchAdminEventsAction } from './actions';
import {
  AdminEntityTable,
  AdminPageHeader,
  IconButton,
  RecordFormModal,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { adminApi } from '@/lib/admin/client';
import type { EntityField } from '@/lib/admin/entities';
import { toast } from '@/lib/toast';

type CityEvent = {
  id: string;
  title: string;
  status: string;
  venue?: string | null;
  start_date: string;
  end_date?: string | null;
  banner?: string | null;
  gallery?: string[] | null;
  is_featured?: boolean;
  created_at: string;
  event_categories?: { name: string } | null;
  areas?: { name: string } | null;
  profiles?: { full_name?: string | null } | null;
  [key: string]: any;
};

const EVENT_CATEGORIES = [
  'Cultural Festival',
  'Music & Arts',
  'Literary Event',
  'Food & Culinary',
  'Sports & Fitness',
  'Business & Networking',
  'Education & Workshop',
  'Heritage & Tourism',
  'Community Gathering',
  'Government & Civic',
];

const createFields: EntityField[] = [
  { name: 'title', label: 'Event title', type: 'text', required: true, wide: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: EVENT_CATEGORIES.map((c) => ({ value: c, label: c })),
  },
  { name: 'venue', label: 'Venue', type: 'text' },
  { name: 'start_date', label: 'Starts', type: 'datetime', required: true },
  { name: 'end_date', label: 'Ends', type: 'datetime' },
  { name: 'description', label: 'Description', type: 'textarea', wide: true },
  { name: 'registration_link', label: 'Registration / ticket link', type: 'url', wide: true },
  { name: 'is_ticket_required', label: 'Ticket / registration required', type: 'checkbox' },
  { name: 'banner', label: 'Banner image', type: 'image', module: 'event', wide: true },
  { name: 'gallery', label: 'Gallery', type: 'images', module: 'event', wide: true },
];

const createDefaults = { category: 'Cultural Festival' };

const columns: Column<CityEvent>[] = [
  {
    key: 'title',
    header: 'Event',
    sortValue: (e) => e.title,
    cell: (e) => (
      <div className="flex min-w-0 items-center gap-3">
        {e.banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.banner} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] object-cover" />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#111827]">{e.title}</p>
          <p className="text-[11px] text-[#6B7280]">{e.event_categories?.name || 'General'}</p>
        </div>
      </div>
    ),
  },
  { key: 'venue', header: 'Venue', hideOnMobile: true, sortValue: (e) => e.venue, cell: (e) => e.venue || 'TBD' },
  {
    key: 'start_date',
    header: 'Schedule',
    sortValue: (e) => e.start_date,
    cell: (e) => (
      <div>
        <p className="font-medium text-[#111827]">{formatDate(e.start_date, true)}</p>
        {e.end_date && e.end_date !== e.start_date && (
          <p className="text-[11px] text-[#6B7280]">→ {formatDate(e.end_date, true)}</p>
        )}
      </div>
    ),
  },
  { key: 'status', header: 'Status', sortValue: (e) => e.status, cell: (e) => <StatusBadge status={e.status} /> },
];

const isUpcoming = (e: CityEvent) => new Date(e.end_date || e.start_date).getTime() >= Date.now();

const staticFilters: TableFilter<CityEvent>[] = [
  {
    key: 'status',
    label: 'Statuses',
    options: [
      { value: 'published', label: 'Published' },
      { value: 'pending', label: 'Pending' },
      { value: 'draft', label: 'Draft' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'archived', label: 'Archived' },
    ],
    match: (e, v) => e.status === v,
  },
  {
    key: 'when',
    label: 'Dates',
    options: [
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'past', label: 'Past' },
    ],
    match: (e, v) => (v === 'upcoming' ? isUpcoming(e) : !isUpcoming(e)),
  },
];

export default function AdminEventsPage() {
  const [rows, setRows] = useState<CityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // The events table may not exist yet in production; treat a failed load as an empty list
  const load = useCallback(async () => {
    try {
      const res = await fetchAdminEventsAction();
      setRows(res.success ? ((res.data as CityEvent[]) || []) : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filters = useMemo<TableFilter<CityEvent>[]>(() => {
    const categories = Array.from(new Set(rows.map((e) => e.event_categories?.name).filter(Boolean))) as string[];
    if (categories.length === 0) return staticFilters;
    return [
      ...staticFilters,
      {
        key: 'category',
        label: 'Categories',
        options: categories.sort().map((c) => ({ value: c, label: c })),
        match: (e, v) => e.event_categories?.name === v,
      },
    ];
  }, [rows]);

  const createEvent = async (values: Record<string, unknown>) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        end_date: values.end_date || undefined,
        registration_link: values.registration_link || undefined,
        banner: values.banner || null,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) throw new Error(json.message || 'Could not create event');

    toast.success('Event published', String(values.title));
    setCreating(false);
    await load();
  };

  const moderate = async (e: CityEvent, action: 'approve' | 'reject') => {
    try {
      await adminApi.moderate('event', e.id, action);
      toast.success(action === 'approve' ? 'Event published' : 'Event unpublished', e.title);
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Events"
        description="Approve cultural programmes, literary fests and community schedules across the city."
        count={rows.length}
        actions={
          <button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Create event
          </button>
        }
      />

      <AdminEntityTable<CityEvent>
        entityType="event"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        searchText={(e) => `${e.title} ${e.venue ?? ''} ${e.event_categories?.name ?? ''}`}
        searchPlaceholder="Search title, venue, category…"
        emptyMessage="No city events yet."
        titleOf={(e) => e.title}
        subtitleOf={(e) => <StatusBadge status={e.status} />}
        imageKeys={['banner', 'gallery']}
        extraViewFields={(e) => [
          { label: 'Category', value: e.event_categories?.name || 'General' },
          { label: 'Area', value: e.areas?.name },
          { label: 'Created by', value: e.profiles?.full_name },
          { label: 'Added', value: formatDate(e.created_at, true) },
        ]}
        rowActions={(e) =>
          e.status === 'published' ? (
            <IconButton label="Unpublish" tone="danger" onClick={() => moderate(e, 'reject')}>
              <EyeOff className="h-4 w-4" />
            </IconButton>
          ) : (
            <IconButton label="Approve & publish" onClick={() => moderate(e, 'approve')}>
              <CheckCircle2 className="h-4 w-4" />
            </IconButton>
          )
        }
      />

      <RecordFormModal
        open={creating}
        title="Create city event"
        fields={createFields}
        record={createDefaults}
        submitLabel="Publish event"
        onClose={() => setCreating(false)}
        onSubmit={createEvent}
      />
    </>
  );
}
