'use client';
// components/admin/data-table/record-drawer.tsx
import React from 'react';
import { Pencil, X } from 'lucide-react';
import { Modal } from './modal';
import type { EntityField } from '@/lib/admin/entities';

export type ViewField = { label: string; value: React.ReactNode; wide?: boolean };

/** Read-only side panel for one record. */
export function RecordDrawer({
  open,
  title,
  subtitle,
  fields,
  images = [],
  onClose,
  onEdit,
  footer,
}: {
  open: boolean;
  title: string;
  subtitle?: React.ReactNode;
  fields: ViewField[];
  images?: string[];
  onClose: () => void;
  onEdit?: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} variant="drawer" labelledBy="record-drawer-title">
      <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-6 py-5">
        <div className="min-w-0">
          <h2 id="record-drawer-title" className="truncate text-lg font-bold text-[#111827]">
            {title}
          </h2>
          {subtitle && <div className="mt-1 text-xs text-[#6B7280]">{subtitle}</div>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${src}-${i}`}
                src={src}
                alt=""
                className={`w-full rounded-xl border border-[#E5E7EB] object-cover ${
                  i === 0 ? 'col-span-3 aspect-video' : 'aspect-square'
                }`}
              />
            ))}
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          {fields.map((f) => (
            <div key={f.label} className={f.wide ? 'col-span-2' : 'col-span-2 sm:col-span-1'}>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">{f.label}</dt>
              <dd className="mt-1 whitespace-pre-line break-words text-sm text-[#111827]">
                {f.value === null || f.value === undefined || f.value === '' ? (
                  <span className="text-[#9CA3AF]">—</span>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {(onEdit || footer) && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
          {footer}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8]"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}

/** Formats a record's configured fields for the drawer. */
export function viewFieldsFromConfig(fields: EntityField[], row: Record<string, unknown>): ViewField[] {
  return fields
    .filter((f) => f.type !== 'image' && f.type !== 'images')
    .map((f) => ({ label: f.label, value: formatValue(f, row[f.name]), wide: f.wide }));
}

export function formatValue(field: EntityField, value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === '') return null;
  switch (field.type) {
    case 'checkbox':
      return value ? 'Yes' : 'No';
    case 'select':
      return field.options?.find((o) => o.value === value)?.label ?? String(value);
    case 'date':
      return formatDate(value, false);
    case 'datetime':
      return formatDate(value, true);
    case 'url':
      return (
        <a href={String(value)} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline">
          {String(value)}
        </a>
      );
    case 'number':
      return Number(value).toLocaleString('en-IN');
    default:
      return String(value);
  }
}

export function formatDate(value: unknown, withTime = false): string {
  if (!value) return '';
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {}),
  });
}

/** Collects cover + gallery URLs from a record, de-duplicated. */
export function recordImages(row: Record<string, unknown>, keys: string[] = []): string[] {
  const urls: string[] = [];
  for (const key of keys) {
    const v = row[key];
    if (typeof v === 'string' && v) urls.push(v);
    if (Array.isArray(v)) urls.push(...v.filter((u): u is string => typeof u === 'string' && !!u));
  }
  return Array.from(new Set(urls));
}
