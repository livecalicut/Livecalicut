'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Hotel, Star, MapPin, ArrowRight, Loader2, Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

export default function HotelsDirectoryPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/explore')
      .then((r) => r.json())
      .then((json) => {
        setHotels(json?.data?.hotels || []);
      })
      .catch(() => setHotels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = hotels.filter((h) => {
    const matchesSearch =
      !search ||
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.location?.toLowerCase().includes(search.toLowerCase()) ||
      h.description?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <Container className="py-6 sm:py-10 space-y-8">
      <PageHeader
        title="Hotels, Stays & Beach Resorts"
        description="Luxury 5-star stays, waterfront river resorts on Chaliyar & heritage homestays in Calicut."
        icon={<Hotel className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Hotels & Resorts' },
        ]}
      />

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9CA3AF] pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hotels, beach resorts, homestays..."
          className="w-full pl-10 pr-4 h-[42px] rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading hotels & resorts...</span>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Hotel className="w-8 h-8 text-[#2563EB]" />}
          title="No hotels found"
          description="No hotel listings match your current search criteria. Check back soon for new accommodations in Calicut."
          actionLabel="Explore All Categories"
          actionHref="/explore"
        />
      ) : (
        <ResponsiveGrid cols={3}>
          {filtered.map((h) => (
            <Link key={h.slug || h.id} href={`/hotels/${h.slug || h.id}`} className="block group">
              <Card className="p-5 border border-slate-200 hover:border-[#2563EB]/40 bg-white hover:shadow-lg rounded-2xl transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {h.star_rating || h.starRating || 4} Star Luxury
                  </span>
                  <span className="text-xs font-extrabold text-[#2563EB]">
                    {h.price_per_night || h.pricePerNight ? `₹${h.price_per_night || h.pricePerNight} / night` : 'Contact for Rates'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                  {h.name}
                </h4>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {h.location || 'Calicut'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-slate-400 font-normal">Verified Property</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1 group-hover:text-[#2563EB] group-hover:underline">
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </ResponsiveGrid>
      )}
    </Container>
  );
}
