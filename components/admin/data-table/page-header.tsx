// components/admin/data-table/page-header.tsx
import React from 'react';

/** Consistent title row for admin list pages. */
export function AdminPageHeader({
  title,
  description,
  count,
  actions,
}: {
  title: string;
  description?: string;
  count?: number;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#111827]">
          {title}
          {typeof count === 'number' && (
            <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-xs font-semibold text-[#6B7280]">{count}</span>
          )}
        </h1>
        {description && <p className="mt-1 text-sm text-[#6B7280]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Primary action button styling shared by admin headers. */
export const primaryButtonClass =
  'inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] disabled:opacity-60';

export const secondaryButtonClass =
  'inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#374151] transition-colors hover:border-[#2563EB] hover:text-[#2563EB]';
