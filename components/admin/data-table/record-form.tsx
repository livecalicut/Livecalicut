'use client';
// components/admin/data-table/record-form.tsx
import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Modal } from './modal';
import { ImageUploader } from '@/components/shared/image-uploader';
import { MultiImageUploader } from '@/components/shared/multi-image-uploader';
import type { EntityField } from '@/lib/admin/entities';

type Values = Record<string, unknown>;

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:bg-white focus:outline-none';

/** datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time */
function toLocalInput(value: unknown) {
  if (!value) return '';
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function initialValues(fields: EntityField[], record: Values): Values {
  const values: Values = {};
  for (const f of fields) {
    const v = record[f.name];
    if (f.type === 'checkbox') values[f.name] = Boolean(v);
    else if (f.type === 'images') values[f.name] = Array.isArray(v) ? v : [];
    else if (f.type === 'datetime') values[f.name] = toLocalInput(v);
    else if (f.type === 'date') values[f.name] = v ? String(v).slice(0, 10) : '';
    else values[f.name] = v ?? '';
  }
  return values;
}

/** Create/edit form generated from an entity field config. */
export function RecordFormModal({
  open,
  title,
  fields,
  record,
  submitLabel = 'Save changes',
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  fields: EntityField[];
  record: Values | null;
  submitLabel?: string;
  onClose: () => void;
  /** Throw to keep the form open; the message is shown inline */
  onSubmit: (values: Values) => Promise<void>;
}) {
  const [values, setValues] = useState<Values>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(initialValues(fields, record ?? {}));
      setError('');
    }
  }, [open, fields, record]);

  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // datetime-local has no zone; convert in the browser so the server stores the admin's local time
      const out: Values = { ...values };
      for (const f of fields) {
        if (f.type === 'datetime' && out[f.name]) out[f.name] = new Date(String(out[f.name])).toISOString();
      }
      await onSubmit(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={saving ? () => {} : onClose} size="lg" labelledBy="record-form-title">
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <h2 id="record-form-title" className="text-lg font-bold text-[#111827]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className={f.wide || f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <FieldInput field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
          <p className="min-w-0 truncate text-xs font-semibold text-rose-600" role="alert">
            {error}
          </p>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#374151] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8] disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: EntityField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `field-${field.name}`;
  const label = (
    <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#374151]">
      {field.label}
      {field.required && <span className="text-rose-500"> *</span>}
    </label>
  );

  switch (field.type) {
    case 'checkbox':
      return (
        <label className="flex h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-sm font-medium text-[#111827] sm:mt-[22px]">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-[#D1D5DB] accent-[#2563EB]"
          />
          {field.label}
        </label>
      );
    case 'textarea':
      return (
        <>
          {label}
          <textarea
            id={id}
            rows={field.name === 'content' ? 8 : 4}
            required={field.required}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} h-auto py-2 leading-relaxed`}
          />
        </>
      );
    case 'select':
      return (
        <>
          {label}
          <select
            id={id}
            required={field.required}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            {!field.required && <option value="">—</option>}
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      );
    case 'image':
      return (
        <ImageUploader
          variant="light"
          label={field.label}
          module={field.module}
          value={String(value ?? '')}
          onChange={onChange}
        />
      );
    case 'images':
      return (
        <MultiImageUploader
          label={field.label}
          module={field.module}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );
    default: {
      const type =
        field.type === 'datetime' ? 'datetime-local' : field.type === 'number' ? 'number' : field.type;
      return (
        <>
          {label}
          <input
            id={id}
            type={type}
            step={field.type === 'number' ? 'any' : undefined}
            required={field.required}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </>
      );
    }
  }
}
