'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Compass,
  MapPin,
  Star,
  Clock,
  Ticket,
  Search,
  Camera,
  Palmtree,
  Utensils,
  Hotel,
  Calendar,
  ArrowRight,
  Bookmark,
  Share2,
} from 'lucide-react';

const TOURISM_CATEGORIES = [
  'All',
  'Beaches & Waterfronts',
  'Heritage & Historical',
  'Parks & Eco-Tourism',
  'Backwaters & Waterfalls',
  'Shopping & Culture',
];

const TOURIST_DESTINATIONS = [
  {
    title: 'Calicut Beach & Freedom Square',
    slug: 'kozhikode-beach-freedom-square',
    category: 'Beaches & Waterfronts',
    location: 'Beach Road, Calicut',
    rating: 4.8,
    reviews: 2450,
    entryFee: 'Free Entry',
    timings: 'Open 24 Hours • Best at 4:30 PM – 8:00 PM',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    description: 'Iconic Arabian sea coastline with century-old sea piers, Freedom Square cultural pavilion, lighthouse views, and famous beachside pickled fruit & crushed ice stalls.',
    highlights: ['Historical Sea Pier', 'Freedom Square Pavilion', 'Beachside Street Food', 'Sunset Viewpoint'],
  },
  {
    title: 'Beypore Beach, Sea Walk & Uru Shipyard',
    slug: 'beypore-beach-marina',
    category: 'Beaches & Waterfronts',
    location: 'Beypore Marina, 10 km from Calicut City',
    rating: 4.9,
    reviews: 1890,
    entryFee: '₹20 Entry for Walkway',
    timings: '06:00 AM – 07:30 PM',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60',
    description: 'Ancient port town famous for the 1500-year-old handcrafted wooden dhow (Uru) shipbuilding tradition and a 1.5 km stone walkway extending straight into the Arabian Sea.',
    highlights: ['1.5 km Sea Bridge', 'Uru Shipbuilding Yard', 'Marina Waterfront', 'Fresh Fish Market'],
  },
  {
    title: 'Kappad Historical Blue Flag Beach',
    slug: 'kappad-beach',
    category: 'Beaches & Waterfronts',
    location: 'Kappad, 16 km north of Calicut',
    rating: 4.8,
    reviews: 1620,
    entryFee: '₹25 Entry',
    timings: '06:00 AM – 07:00 PM',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=60',
    description: 'Historic beach where Portuguese explorer Vasco da Gama first stepped ashore on May 20, 1498. An eco-friendly Blue Flag certified beach with rock promenades.',
    highlights: ['Vasco da Gama Monument', 'Blue Flag Certified Waters', 'Rocky Promontory', 'Water Sports'],
  },
  {
    title: 'Mananchira Square & Heritage Palace Gardens',
    slug: 'mananchira-square',
    category: 'Heritage & Historical',
    location: 'Town Hall Junction, Heart of Calicut',
    rating: 4.7,
    reviews: 1410,
    entryFee: 'Free Entry',
    timings: '03:30 PM – 08:30 PM',
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?w=800&auto=format&fit=crop&q=60',
    description: 'Serene man-made reservoir built in the 14th century by King Mana Vikrama, surrounded by traditional Kerala-style architectural monuments, lush lawns, and musical fountains.',
    highlights: ['Zamorin Royal Reservoir', 'Traditional Kerala Architecture', 'Musical Light Fountain', 'Mananchira Public Library'],
  },
  {
    title: 'Sarovaram Bio Park & Mangrove Eco Trail',
    slug: 'sarovaram-bio-park',
    category: 'Parks & Eco-Tourism',
    location: 'Mini Bypass Road, Eranhipalam',
    rating: 4.6,
    reviews: 1120,
    entryFee: '₹30 per adult',
    timings: '09:00 AM – 07:30 PM',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60',
    description: 'Protected eco-friendly urban park dedicated to preserving natural wetlands and mangrove forests with wooden boardwalks, boating facilities, butterfly gardens, and open-air theater.',
    highlights: ['Mangrove Wetland Boardwalk', 'Canal Boating', 'Bird Watching Trails', 'Musical Fountain'],
  },
  {
    title: 'Thusharagiri Waterfalls & Trekking Trails',
    slug: 'thusharagiri-waterfalls',
    category: 'Backwaters & Waterfalls',
    location: 'Kodenchery, Western Ghats Foothills',
    rating: 4.9,
    reviews: 1340,
    entryFee: '₹50 per person',
    timings: '08:00 AM – 05:00 PM',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=60',
    description: 'Known as the "Mist-Capped Mountain", Thusharagiri features three cascading waterfalls converging into the Chalippuzha river, nestled inside dense rubber and spice plantations.',
    highlights: ['3 Cascading Waterfalls', 'Rainforest Trekking', 'Rock Climbing & Rappelling', 'Spice Plantation Walks'],
  },
  {
    title: 'S.M. Street (Sweetmeat Street) Heritage Walk',
    slug: 'sm-street-bazaar',
    category: 'Shopping & Culture',
    location: 'Palayam, Calicut Town',
    rating: 4.9,
    reviews: 3100,
    entryFee: 'Free Access',
    timings: '10:00 AM – 10:00 PM',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=60',
    description: '600-year-old pedestrian heritage shopping promenade celebrated for legendary Kozhikodan Black Halwa shops, freshly fried banana chips, handloom textiles, and aromatic bakeries.',
    highlights: ['Calicut Halwa Tasting', 'Banana Chips Stalls', 'S.K. Pottekkatt Statue', 'Vehicle-Free Pedestrian Zone'],
  },
  {
    title: 'Kadalundi Bird Sanctuary & Mangrove Delta',
    slug: 'kadalundi-bird-sanctuary',
    category: 'Backwaters & Waterfalls',
    location: 'Kadalundi, 19 km from Calicut',
    rating: 4.7,
    reviews: 890,
    entryFee: '₹25 Entry • Boating extra',
    timings: '06:00 AM – 06:00 PM',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
    description: 'Estuarine wetland haven where the Kadalundi River meets the Arabian Sea. Home to over 100 species of native and migratory birds, river otters, crabs, and mangrove islands.',
    highlights: ['Country Boat Rides', 'Over 100 Migratory Bird Species', 'Hilltop Estuary Viewpoint', 'Dense Mangrove Islands'],
  },
];

export default function TourismPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = TOURIST_DESTINATIONS.filter((dest) => {
    const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
    const matchesSearch =
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <Container className="py-6 sm:py-10 space-y-8">
      <PageHeader
        title="Calicut Tourism & Sightseeing Guide"
        description="Discover historical Zamorin landmarks, blue-flag beaches, Beypore shipyards, Thusharagiri waterfalls, and heritage food trails across Calicut."
        icon={<Compass className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Tourism' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link href="/restaurants">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-slate-200">
                <Utensils className="w-4 h-4 text-[#2563EB]" /> Food & Dining
              </Button>
            </Link>
            <Link href="/hotels">
              <Button size="sm" className="gap-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                <Hotel className="w-4 h-4" /> Book Resorts
              </Button>
            </Link>
          </div>
        }
      />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link href="/places">
          <Card className="p-4 border border-slate-200/90 hover:border-[#2563EB]/40 bg-white hover:shadow-md space-y-2 text-center group rounded-2xl transition-all">
            <Palmtree className="w-6 h-6 text-[#2563EB] mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#2563EB]">Beaches & Waterfronts</h4>
            <p className="text-[11px] text-slate-400 font-normal">Beach Pier, Beypore, Kappad</p>
          </Card>
        </Link>

        <Link href="/restaurants">
          <Card className="p-4 border border-slate-200/90 hover:border-amber-400/50 bg-white hover:shadow-md space-y-2 text-center group rounded-2xl transition-all">
            <Utensils className="w-6 h-6 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600">Malabar Food Trails</h4>
            <p className="text-[11px] text-slate-400 font-normal">Paragon, Halwa & Biryani</p>
          </Card>
        </Link>

        <Link href="/hotels">
          <Card className="p-4 border border-slate-200/90 hover:border-purple-400/50 bg-white hover:shadow-md space-y-2 text-center group rounded-2xl transition-all">
            <Hotel className="w-6 h-6 text-purple-500 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600">Resorts & Stays</h4>
            <p className="text-[11px] text-slate-400 font-normal">Beach villas & Ayurvedic spas</p>
          </Card>
        </Link>

        <Link href="/events">
          <Card className="p-4 border border-slate-200/90 hover:border-emerald-400/50 bg-white hover:shadow-md space-y-2 text-center group rounded-2xl transition-all">
            <Calendar className="w-6 h-6 text-emerald-500 mx-auto group-hover:scale-110 transition-transform" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-600">Fests & Culture</h4>
            <p className="text-[11px] text-slate-400 font-normal">Literature fest & boat races</p>
          </Card>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TOURISM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-sm font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search beaches, waterfalls, SM Street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      </div>

      {/* Destination Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaces.map((dest) => (
          <Link
            key={dest.slug}
            href={`/places/${dest.slug}`}
            className="group block h-full"
          >
            <Card className="h-full border border-slate-200/90 hover:border-[#2563EB]/50 bg-white hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between">
              <div>
                {/* Image / Category Banner */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[#2563EB] text-[11px] font-bold shadow-xs">
                      {dest.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {dest.rating}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-medium text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate">{dest.location}</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {dest.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {dest.description}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dest.highlights.slice(0, 3).map((h) => (
                      <span
                        key={h}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-600"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Information */}
              <div className="p-4 pt-3 sm:px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Entry & Timings</span>
                  <span className="font-bold text-slate-700">{dest.entryFee}</span>
                </div>

                <span className="font-bold text-[#2563EB] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Explore Place <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
