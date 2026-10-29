'use client';
// components/admin/data-table/data-table.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react';
import { ConfirmDialog } from './confirm-dialog';

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Enables sorting on this column */
  sortValue?: (row: T) => string | number | null | undefined;
  className?: string;
  /** Hidden below the md breakpoint to keep phone layouts readable */
  hideOnMobile?: boolean;
};

export type TableFilter<T> = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  match: (row: T, value: string) => boolean;
};

export type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  loading?: boolean;
  searchPlaceholder?: string;
  /** Text the search box matches against; omit to hide the search box */
  searchText?: (row: T) => string;
  filters?: TableFilter<T>[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => Promise<void> | void;
  /** Describes the row in the delete confirmation */
  rowLabel?: (row: T) => string;
  /** Extra per-row buttons rendered before view/edit/delete */
  rowActions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  pageSize?: number;
};

const PAGE_SIZES = [10, 25, 50];

export function DataTable<T>({
  rows,
  columns,
  getRowId,
  loading = false,
  searchPlaceholder = 'Search…',
  searchText,
  filters = [],
  onView,
  onEdit,
  onDelete,
  rowLabel,
  rowActions,
  emptyMessage = 'No records yet.',
  pageSize: initialPageSize = 10,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((row) => {
      if (q && searchText && !searchText(row).toLowerCase().includes(q)) return false;
      return filters.every((f) => !filterValues[f.key] || f.match(row, filterValues[f.key]));
    });

    const sortCol = sort && columns.find((c) => c.key === sort.key);
    if (sort && sortCol?.sortValue) {
      const dir = sort.dir === 'asc' ? 1 : -1;
      list = [...list].sort((a, b) => {
        const av = sortCol.sortValue!(a) ?? '';
        const bv = sortCol.sortValue!(b) ?? '';
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir;
      });
    }
    return list;
  }, [rows, query, filterValues, filters, searchText, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Jump back to the first page whenever the result set changes shape
  useEffect(() => setPage(1), [query, filterValues, pageSize]);

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));

  const hasActions = Boolean(onView || onEdit || onDelete || rowActions);
  const colCount = columns.length + (hasActions ? 1 : 0);
  const mobileHidden = 'hidden md:table-cell';

  const confirmDelete = async () => {
    if (!pendingDelete || !onDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xs">
      {(searchText || filters.length > 0) && (
        <div className="flex flex-col gap-3 border-b border-[#E5E7EB] p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchText ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:bg-white focus:outline-none"
              />
            </div>
          ) : (
            <span />
          )}
          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((f) => (
                <select
                  key={f.key}
                  aria-label={f.label}
                  value={filterValues[f.key] ?? ''}
                  onChange={(e) => setFilterValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="h-9 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 text-xs font-semibold text-[#374151] focus:border-[#2563EB] focus:outline-none"
                >
                  <option value="">All {f.label.toLowerCase()}</option>
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 first:pl-5 ${col.hideOnMobile ? mobileHidden : ''} ${col.className ?? ''}`}
                >
                  {col.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 uppercase hover:text-[#111827]"
                    >
                      {col.header}
                      {sort?.key === col.key &&
                        (sort.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
              {hasActions && (
                <th scope="col" className="px-4 py-3 pr-5 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {Array.from({ length: colCount }).map((__, j) => (
                    <td key={j} className="px-4 py-4 first:pl-5">
                      <div className="h-3 w-full max-w-[140px] animate-pulse rounded bg-[#F1F5F9]" />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-14 text-center">
                  <Inbox className="mx-auto mb-2 h-8 w-8 text-[#D1D5DB]" />
                  <p className="text-sm font-semibold text-[#374151]">
                    {rows.length === 0 ? emptyMessage : 'No records match your search.'}
                  </p>
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={onView ? () => onView(row) : undefined}
                  className={`transition-colors hover:bg-[#F8FAFC] ${onView ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 align-middle text-[#374151] first:pl-5 ${col.hideOnMobile ? mobileHidden : ''} ${col.className ?? ''}`}
                    >
                      {col.cell(row)}
                    </td>
                  ))}
                  {hasActions && (
                    // Clicks inside the actions cell must not also open the view drawer
                    <td className="px-4 py-3 pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {rowActions?.(row)}
                        {onView && (
                          <IconButton label="View" onClick={() => onView(row)}>
                            <Eye className="h-4 w-4" />
                          </IconButton>
                        )}
                        {onEdit && (
                          <IconButton label="Edit" onClick={() => onEdit(row)}>
                            <Pencil className="h-4 w-4" />
                          </IconButton>
                        )}
                        {onDelete && (
                          <IconButton label="Delete" tone="danger" onClick={() => setPendingDelete(row)}>
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-[#E5E7EB] px-5 py-3 text-xs text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span>
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of{' '}
              {filtered.length}
            </span>
            <select
              aria-label="Rows per page"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-7 rounded-lg border border-[#E5E7EB] bg-white px-2 text-xs"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <IconButton label="Previous page" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </IconButton>
            <span className="px-2 font-semibold text-[#374151]">
              {currentPage} / {totalPages}
            </span>
            <IconButton
              label="Next page"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this record?"
        message={
          pendingDelete && rowLabel
            ? `“${rowLabel(pendingDelete)}” will be permanently removed. This cannot be undone.`
            : 'This record will be permanently removed. This cannot be undone.'
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  tone = 'default',
  disabled,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        tone === 'danger'
          ? 'text-[#9CA3AF] hover:bg-rose-50 hover:text-rose-600'
          : 'text-[#6B7280] hover:bg-[#EFF6FF] hover:text-[#2563EB]'
      }`}
    >
      {children}
    </button>
  );
}
