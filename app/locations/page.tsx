'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { Loader2, MapPin, Search } from 'lucide-react';

type LocationRow = {
  id: string;
  name: string;
  slug: string;
  pincode?: string | null;
  cities?: { id: string; name: string; slug: string } | null;
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch('/api/v1/locations', { cache: 'no-store' });
        const json = await res.json();
        if (!json.success) {
          setError(json.error?.message || 'Failed to load locations');
          return;
        }
        setLocations(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? locations.filter(
          (l) =>
            l.name.toLowerCase().includes(q) ||
            l.cities?.name?.toLowerCase().includes(q) ||
            l.pincode?.includes(q)
        )
      : locations;

    const map = new Map<string, LocationRow[]>();
    for (const loc of filtered) {
      const city = loc.cities?.name || 'Other';
      if (!map.has(city)) map.set(city, []);
      map.get(city)!.push(loc);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [locations, search]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Locations</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Areas and wards across LiveCalicut
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search area or city…"
              className="h-9 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isPending && locations.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-10 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
            Loading locations…
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center">
            <MapPin className="mx-auto h-10 w-10 text-[#D1D5DB]" />
            <p className="mt-3 text-sm font-semibold text-[#6B7280]">No locations listed yet</p>
            <Link
              href="/admin/locations"
              className="mt-4 inline-flex text-xs font-bold text-[#2563EB] hover:underline"
            >
              Super Admin can add locations
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(([city, rows]) => (
              <section key={city} className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#111827]">{city}</h2>
                  <span className="text-[11px] font-semibold text-[#6B7280]">
                    {rows.length} areas
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rows.map((loc) => (
                    <span
                      key={loc.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#111827]"
                    >
                      <MapPin className="h-3 w-3 text-[#2563EB]" />
                      {loc.name}
                      {loc.pincode ? (
                        <span className="font-medium text-[#9CA3AF]">{loc.pincode}</span>
                      ) : null}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
