'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { MapPin, Plus, Search, XCircle, Loader2, X } from 'lucide-react';

export default function AdminLocationsPage() {
  const [search, setSearch] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/locations');
      const json = await res.json();
      setLocations(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: locationName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to add location');
      
      setShowModal(false);
      setLocationName('');
      fetchLocations();
    } catch (err: any) {
      setError(err.message || 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!window.confirm('Delete this location? This might affect businesses linked to it.')) return;
    try {
      await fetch('/api/v1/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entityType: 'area', entityId: id, hardDelete: true }),
      });
      fetchLocations();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLocations = locations.filter(
    (l) => l.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Locations & Areas' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <MapPin className="w-7 h-7 text-[#2563EB]" />
                <span>Locations & Areas</span>
              </h1>
              <p className="text-sm text-[#6B7280]">
                Add and manage specific areas, wards, and junctions within your cities.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add New Location
            </button>
          </div>

          {/* Search Bar */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search location or area name..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] font-semibold focus:border-[#2563EB] focus:outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Total Locations: {filteredLocations.length}</span>
          </Card>

          {/* Locations Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-[#6B7280]">
              <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
              <span className="text-sm">Loading locations...</span>
            </div>
          ) : filteredLocations.length === 0 ? (
            <Card className="p-12 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs text-center space-y-3">
              <MapPin className="w-12 h-12 text-[#D1D5DB] mx-auto" />
              <p className="text-[#6B7280] font-semibold text-base">No locations found</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 px-5 py-2.5 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Your First Location
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLocations.map((loc) => (
                <Card key={loc.id} className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs hover:border-blue-200 transition-all flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-[#111827] text-sm font-sans">{loc.name}</h3>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">{loc.cities?.name || 'Kozhikode'}</p>
                  </div>
                  <button
                    onClick={() => deleteLocation(loc.id)}
                    className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all shrink-0"
                    title="Delete Location"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add Location */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Add New Location</h2>
              <button onClick={() => { setShowModal(false); setError(''); }} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Location / Area Name *</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Mavoor Road, Palayam, Chevayur"
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                />
                <p className="text-[10px] text-[#6B7280] pt-1">
                  This will appear in the main location dropdown search.
                </p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setError(''); }}
                  className="px-4 py-2 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Location
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
