'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Loader2, MapPin, Search } from 'lucide-react';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';
import { LOCATION_SEARCH_THRESHOLD, useAllLocations } from '@/hooks/use-locations';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Rendered inside the trigger before the label. */
  compact?: boolean;
  /** `plain` sits inside a search bar without its own box. */
  tone?: 'field' | 'plain' | 'nav';
  /** Label shown when every area is selected. */
  allLabel?: string;
  /** `labeled` shows a caption above the selected area, for the home search bar. */
  appearance?: 'inline' | 'labeled';
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
  tone = 'field',
  appearance = 'inline',
  allLabel,
}) => {
  const { data, isLoading } = useAllLocations();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const options = useMemo(() => {
    const areas = (data?.rows || []).filter((area) => area.name);
    return [{ id: 'all', name: ALL_LOCATIONS_LABEL, pincode: null as string | null }, ...areas];
  }, [data]);

  const showSearch = options.length > LOCATION_SEARCH_THRESHOLD;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((area) =>
      `${area.name} ${area.pincode || ''}`.toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    if (showSearch) inputRef.current?.focus();

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
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

  useEffect(() => {
    if (!open || !rootRef.current) return;

    const place = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(320, Math.max(rect.width, 240));
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < 260 && rect.top > spaceBelow;
      setMenuStyle({
        position: 'fixed',
        left,
        width,
        zIndex: 80,
        ...(openUp ? { bottom: window.innerHeight - rect.top + 8 } : { top: rect.bottom + 8 }),
      });
    };

    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  const select = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  const selected = options.find((area) => area.name === value) || options[0];
  const displayName =
    selected?.name === ALL_LOCATIONS_LABEL && allLabel
      ? allLabel
      : appearance === 'labeled' && (!selected || selected.name === ALL_LOCATIONS_LABEL)
        ? 'Calicut'
        : selected?.name || ALL_LOCATIONS_LABEL;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select location"
        className={`flex items-center gap-2 text-xs font-semibold transition ${
          appearance === 'labeled'
            ? 'h-14 w-full rounded-2xl bg-transparent px-3 text-left text-slate-700 hover:bg-slate-50 lg:rounded-none'
            : tone === 'nav'
              ? 'h-9 rounded-full bg-white/10 px-3 text-white hover:bg-white/15'
            : tone === 'plain'
              ? 'h-11 w-full rounded-xl bg-transparent px-3 text-slate-700 hover:bg-slate-50'
              : `rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] text-[#111827] hover:border-[#2563EB]/40 ${
                  compact ? 'px-3 py-1.5' : 'h-10 w-full px-3.5'
                }`
        }`}
      >
        <MapPin className={`shrink-0 ${tone === 'nav' ? 'text-sky-300' : 'text-[#2563EB]'} ${appearance === 'labeled' ? 'h-5 w-5' : 'h-3.5 w-3.5'}`} aria-hidden />
        {appearance === 'labeled' ? (
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold leading-tight text-slate-500">Location</span>
            <span className="block truncate text-sm font-semibold text-slate-900">{displayName}</span>
          </span>
        ) : (
          <span className="max-w-[9rem] truncate">{displayName}</span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${tone === 'nav' ? 'text-white/70' : 'text-[#9CA3AF]'} ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-xl"
          >
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
              filtered.map((area) => (
                <button
                  key={area.id || area.name}
                  type="button"
                  role="option"
                  aria-selected={area.name === value}
                  onClick={() => select(area.name)}
                  className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold transition hover:bg-[#F8FAFC] ${
                    area.name === value ? 'text-[#2563EB]' : 'text-[#111827]'
                  }`}
                >
                  <span className="truncate">{area.name}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    {area.pincode && area.name !== ALL_LOCATIONS_LABEL && (
                      <span className="font-medium text-[#9CA3AF]">{area.pincode}</span>
                    )}
                    {area.name === value && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
