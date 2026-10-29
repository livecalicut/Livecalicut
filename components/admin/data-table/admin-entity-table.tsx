'use client';
// components/admin/data-table/admin-entity-table.tsx
import React, { useState } from 'react';
import { DataTable, type Column, type TableFilter } from './data-table';
import { RecordDrawer, recordImages, viewFieldsFromConfig, type ViewField } from './record-drawer';
import { RecordFormModal } from './record-form';
import { ADMIN_ENTITIES, withJsonFields } from '@/lib/admin/entities';
import { adminApi } from '@/lib/admin/client';
import { toast } from '@/lib/toast';

type Row = Record<string, any> & { id: string };

/**
 * DataTable wired to the admin view/edit/delete flows for one entity type
 * from lib/admin/entities.ts. Pages supply columns and the data source.
 */
export function AdminEntityTable<T extends Row>({
  entityType,
  rows,
  loading,
  reload,
  columns,
  filters,
  searchText,
  searchPlaceholder,
  emptyMessage,
  titleOf,
  subtitleOf,
  imageKeys = [],
  extraViewFields,
  rowActions,
  drawerFooter,
  canEdit = true,
  canDelete = true,
  deleteEntityType,
}: {
  entityType: string;
  rows: T[];
  loading?: boolean;
  reload: () => void | Promise<void>;
  columns: Column<T>[];
  filters?: TableFilter<T>[];
  searchText?: (row: T) => string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  titleOf: (row: T) => string;
  subtitleOf?: (row: T) => React.ReactNode;
  /** Record keys holding a cover URL or gallery array, shown in the drawer */
  imageKeys?: string[];
  /** Read-only facts shown before the editable fields (e.g. category, owner, created date) */
  extraViewFields?: (row: T) => ViewField[];
  rowActions?: (row: T) => React.ReactNode;
  drawerFooter?: (row: T, close: () => void) => React.ReactNode;
  canEdit?: boolean;
  canDelete?: boolean;
  /** Delete API entity key when it differs from entityType */
  deleteEntityType?: string;
}) {
  const config = ADMIN_ENTITIES[entityType];
  const [viewing, setViewing] = useState<T | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  // Config image fields always show in the drawer, plus any page-specific keys
  const drawerImageKeys = Array.from(
    new Set([...imageKeys, ...config.fields.filter((f) => f.type === 'image' || f.type === 'images').map((f) => f.name)])
  );
  const viewed = viewing ? withJsonFields(config, viewing) : null;

  const save = async (values: Record<string, unknown>) => {
    if (!editing) return;
    await adminApi.update(entityType, editing.id, values);
    toast.success(`${config.label} updated`, titleOf({ ...editing, ...values } as T));
    setEditing(null);
    await reload();
  };

  const remove = async (row: T) => {
    try {
      await adminApi.remove(deleteEntityType ?? entityType, row.id);
      toast.success(`${config.label} deleted`, titleOf(row));
      if (viewing?.id === row.id) setViewing(null);
      await reload();
    } catch (err) {
      toast.error('Delete failed', err instanceof Error ? err.message : undefined);
    }
  };

  const openEdit = (row: T) => {
    setViewing(null);
    setEditing(row);
  };

  return (
    <>
      <DataTable<T>
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        filters={filters}
        searchText={searchText}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        rowLabel={titleOf}
        rowActions={rowActions}
        onView={setViewing}
        onEdit={canEdit ? openEdit : undefined}
        onDelete={canDelete ? remove : undefined}
      />

      <RecordDrawer
        open={viewing !== null}
        title={viewing ? titleOf(viewing) : ''}
        subtitle={viewing && subtitleOf?.(viewing)}
        images={viewed ? recordImages(viewed, drawerImageKeys) : []}
        fields={
          viewing && viewed
            ? [...(extraViewFields?.(viewing) ?? []), ...viewFieldsFromConfig(config.fields, viewed)]
            : []
        }
        onClose={() => setViewing(null)}
        onEdit={canEdit && viewing ? () => openEdit(viewing) : undefined}
        footer={viewing && drawerFooter?.(viewing, () => setViewing(null))}
      />

      <RecordFormModal
        open={editing !== null}
        title={`Edit ${config.label.toLowerCase()}`}
        fields={config.fields}
        record={editing ? withJsonFields(config, editing) : null}
        onClose={() => setEditing(null)}
        onSubmit={save}
      />
    </>
  );
}
