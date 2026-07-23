'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Compass, MapPin, Star, Clock, Ticket, Globe, Phone, Loader2, Search } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  'All',
  'Beaches & Waterfronts',
  'Historical Sites & Forts',
  'Heritage Landmarks',
  'Nature & Eco Tourism',
  'Shopping & Markets',
  'Religious & Spiritual',
  'Parks & Gardens',
  'Museums & Art Galleries',
  'Food & Culinary Tourism',
  'Adventure & Sports',
];

export default function PlacesCatalogPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch('/api/places')
      .then((r) => r.json())
      .then((json) => setPlaces(json.data || []))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = places.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      activeCategory === 'All' ||
      p.place_categories?.name === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Places to Visit in Kozhikode"
        description="Historical heritage sites, pristine beach piers, SM Street shopping markets & nature spots."
        icon={<Compass className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Places to Visit' },
        ]}
      />

      {/* Search + Filter */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9CA3AF] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search places, beaches, heritage sites..."
            className="w-full pl-10 pr-4 h-[42px] rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                activeCategory === cat
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:border-[#2563EB] hover:text-[#2563EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading places...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <Compass className="w-14 h-14 text-[#D1D5DB] mx-auto" />
          <p className="text-[#6B7280] font-semibold text-base">
            {places.length === 0
              ? 'Tourism listings coming soon'
              : 'No places match your search'}
          </p>
          <p className="text-[#9CA3AF] text-sm">
            {places.length === 0
              ? 'Our team is currently adding verified tourist destinations across Kozhikode.'
              : 'Try searching with a different keyword or category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs hover:border-blue-200 hover:-translate-y-0.5 transition-all space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-[#111827] text-[16px] font-sans leading-snug">{p.name}</h3>
                  {p.rating_avg > 0 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {Number(p.rating_avg).toFixed(1)}
                    </div>
                  )}
                </div>
                <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] uppercase tracking-wider">
                  {p.place_categories?.name || 'Tourism'}
                </span>
              </div>

              {p.description && (
                <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">{p.description}</p>
              )}

              <div className="space-y-1.5 pt-2 border-t border-[#F3F4F6]">
                {p.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                    <span>{p.location}</span>
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
                {p.best_time_to_visit && (
                  <p className="text-xs text-[#6B7280]">
                    <span className="font-bold">Best time:</span> {p.best_time_to_visit}
                  </p>
                )}
              </div>

              {p.tips && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 leading-relaxed">
                  💡 {p.tips}
                </div>
              )}

              {(p.website || p.phone) && (
                <div className="flex items-center gap-4 pt-1">
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                  )}
                  {p.phone && (
                    <a href={`tel:${p.phone}`}
                      className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
