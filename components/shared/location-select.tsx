'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Loader2, MapPin, Search } from 'lucide-react';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { LOCATION_SEARCH_THRESHOLD, useAllLocations } from '@/hooks/use-locations';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Rendered inside the trigger before the label. */
  compact?: boolean;
}

/**
 * Area picker backed by the `areas` table. Past LOCATION_SEARCH_THRESHOLD rows it
 * shows a type-to-filter field instead of a long scroll list.
 */
export const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  className = '',
  compact = false,
}) => {
  const { data, isLoading } = useAllLocations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => {
    const names = (data?.rows || []).map((area) => area.name).filter(Boolean);
    return [ALL_LOCATIONS_LABEL, ...names];
  }, [data]);

  const showSearch = options.length > LOCATION_SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((name) => name.toLowerCase().includes(q));
  }, [options, query]);

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

  const select = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select location"
        className={`flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] transition hover:border-[#2563EB]/40 ${
          compact ? 'px-3 py-1.5' : 'h-10 w-full px-3.5'
        }`}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" aria-hidden />
        <span className="max-w-[9rem] truncate">{value || ALL_LOCATIONS_LABEL}</span>
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
                placeholder="Search area or pincode…"
                className="h-9 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-9 pr-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
              />
            </div>
          )}

          <div role="listbox" className="max-h-64 overflow-y-auto py-1">
            {isLoading ? (
              <p className="flex items-center gap-2 px-3 py-3 text-xs font-semibold text-[#6B7280]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" />
                Loading areas…
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs font-semibold text-[#6B7280]">No area matches “{query}”</p>
            ) : (
              filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={name === value}
                  onClick={() => select(name)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold transition hover:bg-[#F8FAFC] ${
                    name === value ? 'text-[#2563EB]' : 'text-[#111827]'
                  }`}
                >
                  <span className="truncate">{name}</span>
                  {name === value && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
