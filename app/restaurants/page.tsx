'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { Utensils, Star, ArrowRight, MapPin, Search, Loader2 } from 'lucide-react';

const CATEGORIES = ['All', 'Dum Biryani', 'Traditional Malabar', 'Seafood', 'Cafes & Desserts', 'Vegetarian'];

export default function RestaurantsDirectoryPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/explore')
      .then((r) => r.json())
      .then((json) => {
        setRestaurants(json?.data?.restaurants || []);
      })
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesCat =
      selectedCategory === 'All' ||
      r.tag === selectedCategory ||
      r.cuisine?.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery =
      !searchQuery ||
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <Container className="py-6 sm:py-10 space-y-8">
      <PageHeader
        title="Calicut Culinary & Restaurants"
        description="Famous Malabar biryanis, seafood delicacies, SM Street halwa shops & sea-facing cafes across Calicut."
        icon={<Utensils className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Restaurants' },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search restaurant or dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading restaurants...</span>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <EmptyState
          icon={<Utensils className="w-8 h-8 text-[#2563EB]" />}
          title="No restaurants found"
          description="No dining spots match your current filter. Try selecting 'All' or searching for another dish."
          actionLabel="Explore All Categories"
          actionHref="/explore"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRestaurants.map((r) => (
            <Link key={r.slug || r.id} href={`/restaurants/${r.slug || r.id}`} className="block group">
              <Card className="h-full p-5 border border-slate-200/90 hover:border-[#2563EB]/40 bg-white hover:shadow-lg transition-all duration-200 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 line-clamp-1">
                      {r.cuisine || 'Malabar Dining'}
                    </span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {r.rating || 4.5}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                    {r.name}
                  </h4>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{r.location || 'Calicut'}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-normal">Approx Cost</span>
                    <span className="font-extrabold text-[#2563EB] text-sm">{r.avg_cost || r.avgCost || '₹300 for two'}</span>
                  </div>
                  <span className="font-bold text-slate-700 flex items-center gap-1 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all">
                    Menu & Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
