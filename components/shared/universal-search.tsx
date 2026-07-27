'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebouncedValue } from '@/hooks/use-locations';

interface UniversalSearchProps {
  /** Fires after debounce while typing (and on clear → empty string). */
  onSearch?: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  compact?: boolean;
  /** Debounce delay in ms (default 300). */
  debounceMs?: number;
  /**
   * @deprecated Location lives in the page filter row (LocationSelect), not inside search.
   */
  defaultLocation?: string;
}

/**
 * Clean search field — type to search.
 * No submit button, no embedded location picker, no recent-search cache.
 */
export const UniversalSearch: React.FC<UniversalSearchProps> = ({
  onSearch,
  placeholder = 'Search shops, jobs, news, classifieds…',
  defaultValue = '',
  autoFocus = false,
  compact = false,
  debounceMs = 300,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const debounced = useDebouncedValue(query, debounceMs);
  const lastEmitted = useRef<string | null>(null);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  // Sync from outside only when the field isn't being typed in
  useEffect(() => {
    if (!focused) setQuery(defaultValue);
  }, [defaultValue, focused]);

  // Auto-search as the user types (debounced)
  useEffect(() => {
    const q = debounced.trim();
    if (lastEmitted.current === q) return;
    lastEmitted.current = q;

    if (onSearchRef.current) {
      onSearchRef.current(q);
      return;
    }

    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : '/search', { scroll: false });
  }, [debounced, router]);

  const isPending = query.trim() !== debounced.trim();

  return (
    <div
      className={`relative mx-auto flex w-full max-w-3xl items-center rounded-2xl border border-[#E5E7EB] bg-white transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 ${
        compact ? 'h-11' : 'h-12'
      }`}
    >
      <span className="pointer-events-none absolute left-3.5 text-[#9CA3AF]" aria-hidden>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </span>

      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search Kozhikode"
        autoComplete="off"
        spellCheck={false}
        className="h-full w-full border-none bg-transparent py-0 pl-10 pr-10 text-[14px] font-medium text-[#111827] outline-none placeholder:text-[#9CA3AF] sm:text-[15px]"
      />

      {query ? (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setQuery('')}
          className="absolute right-2.5 rounded-lg p-1.5 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
};
