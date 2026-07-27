'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Loader2, Search, type LucideIcon } from 'lucide-react';

/** Past this many options the dropdown adds type-to-search + a scrollable list. */
export const FILTER_SEARCH_THRESHOLD = 10;

export type FilterOption = string | { value: string; label: string };

function optionValue(option: FilterOption): string {
  return typeof option === 'string' ? option : option.value;
}

function optionLabel(option: FilterOption): string {
  return typeof option === 'string' ? option : option.label;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  /** Shown when value is empty / default. */
  placeholder?: string;
  /** Accessible name for the trigger. */
  label?: string;
  /** Search input placeholder when the list is long enough. */
  searchPlaceholder?: string;
  icon?: LucideIcon;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  compact?: boolean;
  /** Force search UI even under the threshold (default: auto when options > 10). */
  forceSearch?: boolean;
}

/**
 * Dropdown matching the header location picker — chip trigger, optional
 * type-to-filter when there are FILTER_SEARCH_THRESHOLD+ options, scrollable list.
 */
export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'All',
  label = 'Select option',
  searchPlaceholder = 'Search…',
  icon: Icon,
  loading = false,
  emptyMessage = 'No matches',
  className = '',
  compact = false,
  forceSearch = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showSearch = forceSearch || options.length > FILTER_SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => optionLabel(option).toLowerCase().includes(q));
  }, [options, query]);

  const displayLabel = useMemo(() => {
    if (!value) return placeholder;
    const match = options.find((option) => optionValue(option) === value);
    return match ? optionLabel(match) : value;
  }, [options, placeholder, value]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    if (showSearch) inputRef.current?.focus();

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, showSearch]);

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={`flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] transition hover:border-[#2563EB]/40 ${
          compact ? 'px-3 py-1.5' : 'h-10 w-full px-3.5'
        }`}
      >
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" aria-hidden /> : null}
        <span className="max-w-[11rem] truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#9CA3AF] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl">
          {showSearch && (
            <div className="relative border-b border-[#F3F4F6] p-2">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]"
                aria-hidden
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
              />
            </div>
          )}

          <div role="listbox" className="max-h-64 overflow-y-auto py-1">
            {loading ? (
              <p className="flex items-center gap-2 px-3 py-3 text-xs font-semibold text-[#6B7280]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" />
                Loading…
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs font-semibold text-[#6B7280]">
                {query ? `${emptyMessage} “${query}”` : emptyMessage}
              </p>
            ) : (
              filtered.map((option) => {
                const next = optionValue(option);
                const text = optionLabel(option);
                const selected = next === value || (!value && text === placeholder);
                return (
                  <button
                    key={next}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => select(next)}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold transition hover:bg-[#F8FAFC] ${
                      selected ? 'text-[#2563EB]' : 'text-[#111827]'
                    }`}
                  >
                    <span className="truncate">{text}</span>
                    {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
