'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Search, Loader2, X, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import {
  useDebouncedValue,
  useLocationsFeed,
  type AreaRow,
} from '@/hooks/use-locations';

type City = { id: string; name: string; slug: string };

export default function AdminLocationsPage() {
  const { hasRole } = useAuthStore();
  const canManage = hasRole('Super Admin');
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [cities, setCities] = useState<City[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLocationsFeed({ search: debouncedSearch, limit: 20 });

  const rows: AreaRow[] = useMemo(
    () => (data?.pages || []).flatMap((page) => page.rows),
    [data]
  );
  const total = data?.pages?.[0]?.meta?.total ?? rows.length;
  const searching = isFetching && !isFetchingNextPage && !isLoading;

  const refreshLocations = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['locations-feed'] }),
      // Footer, header picker and filter dropdowns all read from this cache
      queryClient.invalidateQueries({ queryKey: ['locations-all'] }),
    ]);

  useEffect(() => {
    fetch('/api/v1/cities', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        const list: City[] = json.data || [];
        setCities(list);
        setCityId((current) => current || list[0]?.id || '');
      })
      .catch(() => setCities([]));
  }, []);

  // Auto-load the next page when the table bottom comes into view
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage || !name.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/v1/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          city_id: cityId || undefined,
          pincode: pincode.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || json.message || 'Failed to add location');
      }
      setShowModal(false);
      setName('');
      setPincode('');
      await refreshLocations();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!canManage) return;
    if (!window.confirm('Delete this location?')) return;
    try {
      const res = await fetch('/api/v1/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'area', entityId: id, hardDelete: true }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || json.message || 'Delete failed');
      }
      await refreshLocations();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Could not delete location');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Areas</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Only Super Admin can add or remove locations. Public pickers show these rows only.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8]"
          >
            <Plus className="h-4 w-4" />
            Add location
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          {searching ? (
            <Loader2 className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 animate-spin text-[#2563EB]" />
          ) : (
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
          )}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search area or pincode…"
            className="h-9 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
          />
        </div>
        <p className="text-xs font-semibold text-[#6B7280]">
          {debouncedSearch ? `${total} match${total === 1 ? '' : 'es'}` : `${total} in database`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6B7280]">
          <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
          Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center">
          <MapPin className="mx-auto h-10 w-10 text-[#D1D5DB]" />
          <p className="mt-3 text-sm font-semibold text-[#6B7280]">
            {debouncedSearch
              ? `No area matches “${debouncedSearch}”`
              : 'No locations in the database yet'}
          </p>
          {debouncedSearch ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="mt-4 inline-flex h-9 items-center rounded-xl border border-[#E5E7EB] px-4 text-xs font-bold text-[#2563EB] hover:border-[#2563EB]"
            >
              Clear search
            </button>
          ) : (
            canManage && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8]"
              >
                <Plus className="h-4 w-4" />
                Add location
              </button>
            )
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] uppercase tracking-wide text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Area</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Pincode</th>
                  {canManage && <th className="px-4 py-3 text-right font-semibold"> </th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((loc) => (
                  <tr key={loc.id} className="border-t border-[#F3F4F6]">
                    <td className="px-4 py-3 font-semibold text-[#111827]">{loc.name}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{loc.cities?.name || '—'}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{loc.pincode || '—'}</td>
                    {canManage && (
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => deleteLocation(loc.id)}
                          className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div ref={sentinelRef}>
            {isFetchingNextPage ? (
              <p className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-[#6B7280]">
                <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
                Loading more…
              </p>
            ) : hasNextPage ? (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                className="mx-auto block h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#2563EB] hover:border-[#2563EB]"
              >
                Load more
              </button>
            ) : (
              <p className="py-2 text-center text-[11px] font-semibold text-[#9CA3AF]">
                Showing all {rows.length} of {total}
              </p>
            )}
          </div>
        </div>
      )}

      {showModal && canManage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111827]">Add location</h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError('');
                }}
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F3F4F6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#4B5563]">City</label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#4B5563]">Area name *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mavoor Road, Palayam"
                  className="h-10 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-[#4B5563]">Pincode</label>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Optional"
                  className="h-10 w-full rounded-xl border border-[#D1D5DB] bg-white px-3 text-sm font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError('');
                  }}
                  className="h-9 rounded-xl px-4 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-sm font-bold text-white hover:bg-[#1D4ED8] disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
