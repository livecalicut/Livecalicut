'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  AdminPageHeader,
  DataTable,
  RecordDrawer,
  RecordFormModal,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { viewFieldsFromConfig } from '@/components/admin/data-table/record-drawer';
import { ADMIN_ENTITIES, type EntityField } from '@/lib/admin/entities';
import { adminApi } from '@/lib/admin/client';
import { toast } from '@/lib/toast';

type ModuleKey = 'businesses' | 'jobs' | 'news' | 'marketplace' | 'properties';

const MODULES: { key: ModuleKey; label: string; table: string; entity: string }[] = [
  { key: 'businesses', label: 'Businesses', table: 'business_categories', entity: 'business_category' },
  { key: 'jobs', label: 'Jobs', table: 'job_categories', entity: 'job_category' },
  { key: 'news', label: 'News', table: 'news_categories', entity: 'news_category' },
  { key: 'marketplace', label: 'Marketplace', table: 'marketplace_categories', entity: 'marketplace_category' },
  { key: 'properties', label: 'Properties', table: 'property_categories', entity: 'property_category' },
];

const moduleLabel = (key: ModuleKey) => MODULES.find((m) => m.key === key)?.label ?? key;

type Category = {
  /** Unique across tables: ids are only unique within one category table */
  rowKey: string;
  id: string;
  name: string;
  slug: string;
  is_active?: boolean;
  created_at?: string;
  module: ModuleKey;
  entity: string;
  [key: string]: any;
};

// All category tables share the same editable fields
const editFields = ADMIN_ENTITIES.business_category.fields;

const createFields: EntityField[] = [
  {
    name: 'module',
    label: 'Module',
    type: 'select',
    required: true,
    options: MODULES.map((m) => ({ value: m.key, label: m.label })),
  },
  { name: 'name', label: 'Category name', type: 'text', required: true },
];

const createDefaults = { module: 'businesses' };

const activeLabel = (c: Category) => (c.is_active === false ? 'Inactive' : 'Active');

const columns: Column<Category>[] = [
  {
    key: 'name',
    header: 'Category',
    sortValue: (c) => c.name,
    cell: (c) => (
      <div className="min-w-0">
        <p className="truncate font-semibold text-[#111827]">{c.name}</p>
        <p className="font-mono text-[11px] text-[#6B7280]">/{c.slug}</p>
      </div>
    ),
  },
  {
    key: 'module',
    header: 'Module',
    sortValue: (c) => moduleLabel(c.module),
    cell: (c) => (
      <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-bold text-[#2563EB]">
        {moduleLabel(c.module)}
      </span>
    ),
  },
  { key: 'status', header: 'Status', sortValue: activeLabel, cell: (c) => <StatusBadge status={activeLabel(c)} /> },
  {
    key: 'created_at',
    header: 'Added',
    hideOnMobile: true,
    sortValue: (c) => c.created_at,
    cell: (c) => formatDate(c.created_at) || '—',
  },
];

const filters: TableFilter<Category>[] = [
  {
    key: 'module',
    label: 'Modules',
    options: MODULES.map((m) => ({ value: m.key, label: m.label })),
    match: (c, v) => c.module === v,
  },
  {
    key: 'active',
    label: 'Statuses',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
    match: (c, v) => (v === 'active' ? c.is_active !== false : c.is_active === false),
  },
];

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [viewing, setViewing] = useState<Category | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  // Some category tables are not live in production yet, so each one loads independently
  const load = useCallback(async () => {
    const supabase = createClient();
    const results = await Promise.all(
      MODULES.map(async (m) => {
        try {
          const { data, error } = await supabase
            .from(m.table)
            .select('*')
            .is('deleted_at', null)
            .order('name', { ascending: true });
          if (error) return { module: m, rows: null };
          return { module: m, rows: data || [] };
        } catch {
          return { module: m, rows: null };
        }
      })
    );

    setRows(
      results.flatMap(({ module: m, rows: list }) =>
        (list || []).map((c: any) => ({
          ...c,
          rowKey: `${m.key}:${c.id}`,
          module: m.key,
          entity: m.entity,
        }))
      )
    );
    setUnavailable(results.filter((r) => r.rows === null).map((r) => r.module.label));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (values: Record<string, unknown>) => {
    if (!editing) return;
    await adminApi.update(editing.entity, editing.id, values);
    toast.success('Category updated', String(values.name ?? editing.name));
    setEditing(null);
    await load();
  };

  const remove = async (c: Category) => {
    try {
      await adminApi.remove(c.entity, c.id);
      toast.success('Category deleted', c.name);
      if (viewing?.rowKey === c.rowKey) setViewing(null);
      await load();
    } catch (err) {
      // Categories still referenced by listings are rejected by the API
      toast.error('Delete failed', err instanceof Error ? err.message : undefined);
    }
  };

  const create = async (values: Record<string, unknown>) => {
    const res = await fetch('/api/v1/admin/taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'category', module: values.module, name: values.name }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Could not create category');

    toast.success('Category added', `${values.name} · ${moduleLabel(values.module as ModuleKey)}`);
    setCreating(false);
    await load();
  };

  const openEdit = (c: Category) => {
    setViewing(null);
    setEditing(c);
  };

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Manage the categories used across businesses, jobs, news, marketplace and properties."
        count={rows.length}
        actions={
          <button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add category
          </button>
        }
      />

      {!loading && unavailable.length > 0 && (
        <p className="text-xs font-semibold text-amber-700">
          Not available yet: {unavailable.join(', ')} categories (database tables pending).
        </p>
      )}

      <DataTable<Category>
        rows={rows}
        columns={columns}
        getRowId={(c) => c.rowKey}
        loading={loading}
        filters={filters}
        searchText={(c) => `${c.name} ${c.slug} ${moduleLabel(c.module)}`}
        searchPlaceholder="Search category…"
        emptyMessage="No categories yet."
        rowLabel={(c) => `${c.name} (${moduleLabel(c.module)})`}
        onView={setViewing}
        onEdit={openEdit}
        onDelete={remove}
      />

      <RecordDrawer
        open={viewing !== null}
        title={viewing?.name ?? ''}
        subtitle={viewing && moduleLabel(viewing.module)}
        fields={
          viewing
            ? [
                { label: 'Module', value: moduleLabel(viewing.module) },
                { label: 'Slug', value: `/${viewing.slug}` },
                { label: 'Added', value: formatDate(viewing.created_at, true) },
                ...viewFieldsFromConfig(editFields, viewing),
              ]
            : []
        }
        onClose={() => setViewing(null)}
        onEdit={viewing ? () => openEdit(viewing) : undefined}
      />

      <RecordFormModal
        open={editing !== null}
        title="Edit category"
        fields={editFields}
        record={editing}
        onClose={() => setEditing(null)}
        onSubmit={save}
      />

      <RecordFormModal
        open={creating}
        title="Add category"
        fields={createFields}
        record={createDefaults}
        submitLabel="Create category"
        onClose={() => setCreating(false)}
        onSubmit={create}
      />
    </>
  );
}
