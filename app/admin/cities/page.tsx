'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  AdminEntityTable,
  AdminPageHeader,
  RecordFormModal,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import type { EntityField } from '@/lib/admin/entities';
import { toast } from '@/lib/toast';

type City = {
  id: string;
  name: string;
  slug: string;
  state?: string | null;
  status?: string | null;
  is_active: boolean;
  created_at?: string;
  areas_count: number;
  [key: string]: any;
};

const createFields: EntityField[] = [
  { name: 'name', label: 'City name', type: 'text', required: true, wide: true },
  { name: 'state', label: 'State', type: 'text' },
  {
    name: 'status',
    label: 'Operating status',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Active operating city' },
      { value: 'expansion', label: 'Expansion prepared (inactive)' },
    ],
  },
];

const createDefaults = { state: 'Kerala', status: 'active' };

const statusLabel = (c: City) => (c.is_active ? 'Active' : 'Inactive');

const columns: Column<City>[] = [
  {
    key: 'name',
    header: 'City',
    sortValue: (c) => c.name,
    cell: (c) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#111827]">{c.name}</p>
        <p className="font-mono text-[11px] text-[#6B7280]">/{c.slug}</p>
      </div>
    ),
  },
  { key: 'state', header: 'State', hideOnMobile: true, sortValue: (c) => c.state, cell: (c) => c.state || '—' },
  { key: 'areas', header: 'Areas', sortValue: (c) => c.areas_count, cell: (c) => c.areas_count.toLocaleString('en-IN') },
  {
    key: 'status',
    header: 'Status',
    sortValue: statusLabel,
    cell: (c) => <StatusBadge status={statusLabel(c)} />,
  },
];

const filters: TableFilter<City>[] = [
  {
    key: 'active',
    label: 'Statuses',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    match: (c, v) => (v === 'active' ? c.is_active : !c.is_active),
  },
];

export default function AdminCitiesPage() {
  const [rows, setRows] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await createClient()
      .from('cities')
      .select('*, areas(count)')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) toast.error('Could not load cities', error.message);
    else
      setRows(
        (data || []).map((c: any) => ({ ...c, areas: undefined, areas_count: c.areas?.[0]?.count ?? 0 }))
      );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createCity = async (values: Record<string, unknown>) => {
    const res = await fetch('/api/v1/admin/taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'city', ...values }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Could not add city');

    toast.success('City added', String(values.name));
    setCreating(false);
    await load();
  };

  return (
    <>
      <AdminPageHeader
        title="Cities"
        description="Configure the cities the platform operates in and prepare new regions for launch."
        count={rows.length}
        actions={
          <button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add city
          </button>
        }
      />

      <AdminEntityTable<City>
        entityType="city"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        searchText={(c) => `${c.name} ${c.state ?? ''} ${c.slug}`}
        searchPlaceholder="Search city or state…"
        emptyMessage="No cities configured yet."
        titleOf={(c) => c.name}
        subtitleOf={(c) => <StatusBadge status={statusLabel(c)} />}
        extraViewFields={(c) => [
          { label: 'Slug', value: `/${c.slug}` },
          { label: 'Areas', value: c.areas_count.toLocaleString('en-IN') },
          { label: 'Added', value: formatDate(c.created_at, true) },
        ]}
      />

      <RecordFormModal
        open={creating}
        title="Add city"
        fields={createFields}
        record={createDefaults}
        submitLabel="Save city"
        onClose={() => setCreating(false)}
        onSubmit={createCity}
      />
    </>
  );
}
