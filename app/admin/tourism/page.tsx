'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { Compass, Plus, Search, XCircle, X, Loader2, MapPin, Star, Globe, Phone, Clock, Ticket } from 'lucide-react';

const INPUT = 'w-full h-11 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]';
const LABEL = 'text-xs font-bold text-[#4B5563] uppercase tracking-wider';

export default function AdminTourismPage() {
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Beaches & Waterfronts');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [openHours, setOpenHours] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [bestTime, setBestTime] = useState('');
  const [tips, setTips] = useState('');

  useEffect(() => { loadPlaces(); }, []);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/places');
      const json = await res.json();
      setPlaces(json.data || []);
    } catch {
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName(''); setDescription(''); setCategory('Beaches & Waterfronts');
    setLocation(''); setAddress(''); setOpenHours(''); setEntryFee('');
    setWebsite(''); setPhone(''); setBestTime(''); setTips('');
    setError('');
  };

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !location) { setError('Place name and location are required.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, category, location, address, open_hours: openHours, entry_fee: entryFee, website, phone, best_time_to_visit: bestTime, tips }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed');
      setShowModal(false);
      resetForm();
      loadPlaces();
    } catch (err: any) {
      setError(err.message || 'Could not add place.');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePlace = async (id: string) => {
    if (!window.confirm('Remove this tourist place?')) return;
    await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'place', entityId: id, hardDelete: true }),
    });
    loadPlaces();
  };

  const filtered = places.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.place_categories?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tourism & Places' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Compass className="w-7 h-7 text-[#2563EB]" />
                <span>Kozhikode Tourism & Heritage Desk</span>
              </h1>
              <p className="text-sm text-[#6B7280]">
                Manage tourist attractions, heritage sites, beaches, and travel destinations across Calicut
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Tourist Place
            </button>
          </div>

          {/* Search */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search place, location, category..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] font-semibold focus:border-[#2563EB] focus:outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Total Places: {filtered.length}</span>
          </Card>

          {/* Places Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-[#6B7280]">
              <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
              <span className="text-sm">Loading tourist places...</span>
            </div>
          ) : filtered.length === 0 ? (
            <Card className="p-12 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs text-center space-y-3">
              <Compass className="w-12 h-12 text-[#D1D5DB] mx-auto" />
              <p className="text-[#6B7280] font-semibold text-base">No tourist places added yet</p>
              <p className="text-[#9CA3AF] text-sm">Click "Add Tourist Place" to list Kozhikode's first attraction.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 px-5 py-2.5 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Tourist Place
              </button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <Card key={p.id} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs hover:border-blue-200 transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <h3 className="font-extrabold text-[#111827] text-[15px] font-sans leading-snug truncate">{p.name}</h3>
                      <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] uppercase tracking-wider">
                        {p.place_categories?.name || 'Tourism'}
                      </span>
                    </div>
                    <button
                      onClick={() => deletePlace(p.id)}
                      className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-all shrink-0"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {p.description && (
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">{p.description}</p>
                  )}

                  <div className="space-y-1.5 pt-1 border-t border-[#F3F4F6]">
                    {p.location && (
                      <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                    )}
                    {p.open_hours && (
                      <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                        <span>{p.open_hours}</span>
                      </div>
                    )}
                    {p.entry_fee && (
                      <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                        <Ticket className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                        <span>{p.entry_fee}</span>
                      </div>
                    )}
                    {p.rating_avg > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" />
                        <span>{Number(p.rating_avg).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {(p.website || p.phone) && (
                    <div className="flex items-center gap-3 pt-1">
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[11px] text-[#2563EB] font-bold hover:underline">
                          <Globe className="w-3 h-3" /> Website
                        </a>
                      )}
                      {p.phone && (
                        <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold hover:underline">
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ─── Add Tourist Place Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#2563EB]" /> Add Tourist Place
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#2563EB] font-semibold">
              🗺️ This place will appear on the public "Places to Visit in Kozhikode" page.
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">⚠️ {error}</div>
            )}

            <form onSubmit={handleAddPlace} className="space-y-4">
              {/* Place Name + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className={LABEL}>Place Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Kozhikode Beach" className={INPUT} />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className={LABEL}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT}>
                    <option>Beaches & Waterfronts</option>
                    <option>Historical Sites & Forts</option>
                    <option>Heritage Landmarks</option>
                    <option>Nature & Eco Tourism</option>
                    <option>Shopping & Markets</option>
                    <option>Religious & Spiritual</option>
                    <option>Parks & Gardens</option>
                    <option>Museums & Art Galleries</option>
                    <option>Food & Culinary Tourism</option>
                    <option>Adventure & Sports</option>
                    <option>Waterfalls & Hills</option>
                    <option>Family & Kids</option>
                  </select>
                </div>
              </div>

              {/* Location + Address */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className={LABEL}>Area / Locality *</label>
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Beach Road, Kozhikode" className={INPUT} />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className={LABEL}>Full Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Kozhikode Beach, Beach Rd, Kerala 673001" className={INPUT} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className={LABEL}>Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this place — history, highlights, what to expect..."
                  className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF] resize-none" />
              </div>

              {/* Open Hours + Entry Fee */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={LABEL}>Open Hours</label>
                  <input type="text" value={openHours} onChange={(e) => setOpenHours(e.target.value)}
                    placeholder="e.g. 6:00 AM – 9:00 PM daily" className={INPUT} />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL}>Entry Fee</label>
                  <input type="text" value={entryFee} onChange={(e) => setEntryFee(e.target.value)}
                    placeholder="e.g. Free / ₹20 per person" className={INPUT} />
                </div>
              </div>

              {/* Best Time + Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={LABEL}>Best Time to Visit</label>
                  <input type="text" value={bestTime} onChange={(e) => setBestTime(e.target.value)}
                    placeholder="e.g. October to March (winter)" className={INPUT} />
                </div>
                <div className="space-y-1.5">
                  <label className={LABEL}>Contact Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98950 xxxxx" className={INPUT} />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1.5">
                <label className={LABEL}>Official Website / Google Maps Link</label>
                <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..." className={INPUT} />
              </div>

              {/* Tips */}
              <div className="space-y-1.5">
                <label className={LABEL}>Visitor Tips</label>
                <textarea rows={2} value={tips} onChange={(e) => setTips(e.target.value)}
                  placeholder="e.g. Avoid weekends if you want a peaceful visit. Parking available nearby."
                  className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF] resize-none" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E5E7EB]">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-5 py-2.5 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50 inline-flex items-center gap-2">
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                    : <><Compass className="w-4 h-4" /> Add to Tourism Directory</>}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
