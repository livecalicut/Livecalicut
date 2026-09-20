'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';

interface HeroRedesignProps {
  locations?: Array<{ id: string; name: string }>;
  initialQuery?: string;
  initialLocation?: string;
}

const POPULAR_TAGS = [
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Flats for Rent', href: '/properties?type=rent' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Mobiles', href: '/marketplace?q=mobile' },
  { label: 'Tours', href: '/explore' },
  { label: 'Hospitals', href: '/business?category=Healthcare' },
  { label: 'Events', href: '/events' },
];

export const HeroRedesign: React.FC<HeroRedesignProps> = ({
  locations: initialLocations = [],
  initialQuery = '',
  initialLocation = ALL_LOCATIONS_LABEL,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [locationsList] = useState<string[]>(() => {
    const list = [ALL_LOCATIONS_LABEL];
    if (initialLocations && initialLocations.length > 0) {
      initialLocations.forEach((l) => list.push(l.name));
    }
    return list;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedLocation && selectedLocation !== ALL_LOCATIONS_LABEL) {
      params.set('location', selectedLocation);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[540px] bg-slate-900 text-white overflow-hidden flex flex-col justify-center py-14 px-4 sm:px-6 lg:px-8">
      {/* Visual Background Layers */}
      <div className="absolute inset-0 z-0">
        <img
          src="/heroes/calicut-hero.jpg"
          alt="Kozhikode Heritage Gate, Beach Lighthouse and City Skyline"
          className="w-full h-full object-cover object-center scale-100 filter brightness-[0.88] contrast-[1.02]"
          fetchPriority="high"
          decoding="async"
        />
        {/* Subtle Light Scrim for Image Clarity & Perfect Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/30 to-slate-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-900/20 to-slate-950/40" />
      </div>

      {/* Hero Content Box */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-7">
        {/* Top Right / Brand Script */}
        <div className="flex justify-end items-center pr-2">
          <span className="font-serif italic text-blue-200/90 text-sm sm:text-base tracking-wide select-none drop-shadow-md">
            Our City &bull; Our People &bull; Our Stories
          </span>
        </div>

        {/* Main Headings */}
        <div className="space-y-3.5">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] font-sans">
            Everything Kozhikode. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Connected in One Place.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-100 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Discover local businesses, buy &amp; sell, find jobs, properties, services, explore places, events and more &mdash; all in one place.
          </p>
        </div>

        {/* Universal Search Container */}
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 backdrop-blur-md"
        >
          {/* Query Input */}
          <div className="flex items-center gap-2.5 px-3 py-2 flex-1 w-full text-slate-800">
            <Search className="w-5 h-5 text-blue-600 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for in Kozhikode?"
              className="w-full bg-transparent text-sm sm:text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 border-t sm:border-t-0 sm:border-l border-slate-200 w-full sm:w-auto text-slate-700">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer py-1 max-w-[150px] truncate"
            >
              {locationsList.map((loc) => (
                <option key={loc} value={loc} className="bg-white text-slate-900">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm sm:text-[15px] rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Popular Search Tags & Kozhikode Tagline */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs sm:text-[13px]">
          {/* Tags */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-slate-300">
            <span className="font-bold text-slate-400">Popular:</span>
            {POPULAR_TAGS.map((tag, idx) => (
              <React.Fragment key={tag.label}>
                <a
                  href={tag.href}
                  className="hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                >
                  {tag.label}
                </a>
                {idx < POPULAR_TAGS.length - 1 && (
                  <span className="text-slate-600 select-none">&bull;</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tagline Watermark */}
          <div className="text-slate-400 text-xs font-serif italic select-none">
            Kozhikode &mdash; A City That Inspires
          </div>
        </div>
      </div>
    </section>
  );
};
