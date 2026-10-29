// components/admin/data-table/status-badge.tsx
import React from 'react';

const TONES: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  gray: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

const STATUS_TONE: Record<string, keyof typeof TONES> = {
  active: 'green',
  published: 'green',
  approved: 'green',
  verified: 'green',
  paid: 'green',
  resolved: 'green',
  pending: 'amber',
  draft: 'amber',
  contacted: 'blue',
  sold: 'blue',
  rented: 'blue',
  rejected: 'red',
  suspended: 'red',
  cancelled: 'red',
  failed: 'red',
  deactivated: 'red',
  closed: 'gray',
  archived: 'gray',
  inactive: 'gray',
};

/** Pill showing a record status; the colour is derived from the status text. */
export function StatusBadge({ status, tone }: { status?: string | null; tone?: keyof typeof TONES }) {
  if (!status) return <span className="text-[#9CA3AF]">—</span>;
  const key = status.toLowerCase();
  const label = key.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
        TONES[tone ?? STATUS_TONE[key] ?? 'gray']
      }`}
    >
      {label}
    </span>
  );
}
