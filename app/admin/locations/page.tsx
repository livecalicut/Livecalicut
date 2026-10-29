'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import type { AreaRow } from '@/hooks/use-locations';
import {
  AdminPageHeader,
  DataTable,
  RecordDrawer,
  RecordFormModal,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { adminApi } from '@/lib/admin/client';
import type { EntityField } from '@/lib/admin/entities';
import { toast } from '@/lib/toast';

type City = { id: string; name: string; slug: string };

// The public locations API omits coordinates and is_active, so the form only
// edits what the row actually carries; sending blanks would wipe stored values.
const editFields: EntityField[] = [
  { name: 'name', label: 'Area name', type: 'text', required: true, wide: true },
  { name: 'pincode', label: 'Pincode', type: 'text' },
];

const columns: Column<AreaRow>[] = [
  {
    key: 'name',
    header: 'Area',
    sortValue: (a) => a.name,
    cell: (a) => <span className="font-semibold text-[#111827]">{a.name}</span>,
  },
  { key: 'city', header: 'City', sortValue: (a) => a.cities?.name, cell: (a) => a.cities?.name || '—' },
  { key: 'pincode', header: 'Pincode', sortValue: (a) => a.pincode, cell: (a) => a.pincode || '—' },
];

export default function AdminLocationsPage() {
  const { hasRole } = useAuthStore();
  const canManage = hasRole('Super Admin');
  const queryClient = useQueryClient();

  const [rows, setRows] = useState<AreaRow[]>([]);
  const [loading, setLoading] = useState(true);
  // Static fallback rows have no database ids, so they can't be edited
  const [offline, setOffline] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [viewing, setViewing] = useState<AreaRow | null>(null);
  const [editing, setEditing] = useState<AreaRow | null>(null);
  const [creating, setCreating] = useState(false);

  const canEditRows = canManage && !offline;

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/locations?all=1', { cache: 'no-store' });
      const json = await res.json();
      setRows(json.data || []);
      setOffline(Boolean(json.meta?.fallback));
    } catch {
      setRows([]);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    fetch('/api/v1/cities', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => setCities(json.data || []))
      .catch(() => setCities([]));
  }, [load]);

  const refreshLocations = async () => {
    await Promise.all([
      load(),
      queryClient.invalidateQueries({ queryKey: ['locations-feed'] }),
      // Footer, header picker and filter dropdowns all read from this cache
      queryClient.invalidateQueries({ queryKey: ['locations-all'] }),
    ]);
  };

  const createFields = useMemo<EntityField[]>(
    () => [
      {
        name: 'city_id',
        label: 'City',
        type: 'select',
        // Left blank, the API falls back to the default Calicut city
        required: cities.length > 0,
        options: cities.map((c) => ({ value: c.id, label: c.name })),
      },
      { name: 'pincode', label: 'Pincode', type: 'text' },
      { name: 'name', label: 'Area name', type: 'text', required: true, wide: true },
    ],
    [cities]
  );
  const createDefaults = useMemo(() => ({ city_id: cities[0]?.id ?? '' }), [cities]);

  const filters = useMemo<TableFilter<AreaRow>[]>(() => {
    const names = Array.from(new Set(rows.map((a) => a.cities?.name).filter(Boolean))) as string[];
    if (names.length < 2) return [];
    return [
      {
        key: 'city',
        label: 'Cities',
        options: names.sort().map((n) => ({ value: n, label: n })),
        match: (a, v) => a.cities?.name === v,
      },
    ];
  }, [rows]);

  const create = async (values: Record<string, unknown>) => {
    const res = await fetch('/api/v1/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(values.name ?? '').trim(),
        city_id: values.city_id || undefined,
        pincode: String(values.pincode ?? '').trim() || undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || json.message || 'Could not add area');
    }
    toast.success('Area added', String(values.name));
    setCreating(false);
    await refreshLocations();
  };

  const save = async (values: Record<string, unknown>) => {
    if (!editing) return;
    await adminApi.update('area', editing.id, values);
    toast.success('Area updated', String(values.name ?? editing.name));
    setEditing(null);
    await refreshLocations();
  };

  const remove = async (a: AreaRow) => {
    try {
      await adminApi.remove('area', a.id);
      toast.success('Area deleted', a.name);
      if (viewing?.id === a.id) setViewing(null);
      await refreshLocations();
    } catch (err) {
      toast.error('Delete failed', err instanceof Error ? err.message : undefined);
    }
  };

  const openEdit = (a: AreaRow) => {
    setViewing(null);
    setEditing(a);
  };

  return (
    <>
      <AdminPageHeader
        title="Areas"
        description="Only Super Admin can add, edit or remove areas. Public pickers show these rows only."
        count={rows.length}
        actions={
          canManage && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              disabled={offline}
              className={primaryButtonClass}
            >
              <Plus className="h-4 w-4" /> Add area
            </button>
          )
        }
      />

      {offline && (
        <p className="text-xs font-semibold text-amber-700">
          Database is not responding — showing the built-in area list (read-only). Refresh to retry.
        </p>
      )}

      <DataTable<AreaRow>
        rows={rows}
        columns={columns}
        getRowId={(a) => a.id}
        loading={loading}
        filters={filters}
        searchText={(a) => `${a.name} ${a.pincode ?? ''} ${a.cities?.name ?? ''}`}
        searchPlaceholder="Search area or pincode…"
        emptyMessage="No areas in the database yet."
        rowLabel={(a) => a.name}
        pageSize={25}
        onView={setViewing}
        onEdit={canEditRows ? openEdit : undefined}
        onDelete={canEditRows ? remove : undefined}
      />

      <RecordDrawer
        open={viewing !== null}
        title={viewing?.name ?? ''}
        subtitle={viewing?.cities?.name}
        fields={
          viewing
            ? [
                { label: 'City', value: viewing.cities?.name },
                { label: 'Pincode', value: viewing.pincode },
                { label: 'Slug', value: viewing.slug ? `/${viewing.slug}` : null },
              ]
            : []
        }
        onClose={() => setViewing(null)}
        onEdit={canEditRows && viewing ? () => openEdit(viewing) : undefined}
      />

      {canEditRows && (
        <>
          <RecordFormModal
            open={editing !== null}
            title="Edit area"
            fields={editFields}
            record={editing}
            onClose={() => setEditing(null)}
            onSubmit={save}
          />
          <RecordFormModal
            open={creating}
            title="Add area"
            fields={createFields}
            record={createDefaults}
            submitLabel="Save area"
            onClose={() => setCreating(false)}
            onSubmit={create}
          />
        </>
      )}
    </>
  );
}
