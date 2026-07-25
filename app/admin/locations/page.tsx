'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Search, Loader2, X, Trash2 } from 'lucide-react';

type City = { id: string; name: string; slug: string };
type LocationRow = {
  id: string;
  name: string;
  slug: string;
  pincode?: string | null;
  city_id: string;
  cities?: { id: string; name: string; slug: string } | null;
};

export default function AdminLocationsPage() {
  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState<LocationRow[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [cityId, setCityId] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [locRes, cityRes] = await Promise.all([
        fetch('/api/v1/locations', { cache: 'no-store' }),
        fetch('/api/v1/cities', { cache: 'no-store' }),
      ]);
      const locJson = await locRes.json();
      const cityJson = await cityRes.json();
      setLocations(locJson.data || []);
      const cityList = cityJson.data || [];
      setCities(cityList);
      if (!cityId && cityList[0]?.id) setCityId(cityList[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

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
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await fetch('/api/v1/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'area', entityId: id, hardDelete: true }),
      });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = locations.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Locations</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Areas and wards shown across the public site
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8]"
        >
          <Plus className="h-4 w-4" />
          Add location
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#6B7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search locations…"
            className="h-9 w-full rounded-xl border border-[#D1D5DB] bg-white pl-9 pr-3 text-xs font-semibold text-[#111827] outline-none focus:border-[#2563EB]"
          />
        </div>
        <p className="text-xs font-semibold text-[#6B7280]">{filtered.length} locations</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[#6B7280]">
          <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
          Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-14 text-center">
          <MapPin className="mx-auto h-10 w-10 text-[#D1D5DB]" />
          <p className="mt-3 text-sm font-semibold text-[#6B7280]">No locations yet</p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white hover:bg-[#1D4ED8]"
          >
            <Plus className="h-4 w-4" />
            Add location
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] uppercase tracking-wide text-[#6B7280]">
              <tr>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Pincode</th>
                <th className="px-4 py-3 font-semibold text-right"> </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((loc) => (
                <tr key={loc.id} className="border-t border-[#F3F4F6]">
                  <td className="px-4 py-3 font-semibold text-[#111827]">{loc.name}</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {loc.cities?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{loc.pincode || '—'}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
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
                <label className="mb-1 block text-xs font-bold text-[#4B5563]">
                  Area name *
                </label>
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
