'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

interface ExploreCardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const EXPLORE_ITEMS: ExploreCardItem[] = [
  {
    id: 'e1',
    title: 'Beaches',
    subtitle: 'Feel the calm',
    image: '/heroes/coastal-life.jpg',
    href: '/explore?type=beaches',
  },
  {
    id: 'e2',
    title: 'Food Spots',
    subtitle: 'Taste Kozhikode',
    image: '/heroes/city-market.jpg',
    href: '/restaurants',
  },
  {
    id: 'e3',
    title: 'Tourist Places',
    subtitle: 'Explore the city',
    image: '/heroes/kerala-coast.jpg',
    href: '/explore',
  },
  {
    id: 'e4',
    title: 'Events',
    subtitle: "What's happening",
    image: '/heroes/workplace.jpg',
    href: '/events',
  },
  {
    id: 'e5',
    title: 'Local Stories',
    subtitle: 'People & culture',
    image: '/heroes/city-market.jpg',
    href: '/news',
  },
];

export const ExploreKozhikodeSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-6 sm:pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                Explore Kozhikode
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Places, experiences, food, events and more
              </p>
            </div>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {EXPLORE_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative flex flex-col h-60 sm:h-64 rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
                decoding="async"
              />

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Text info bottom */}
              <div className="relative z-10 mt-auto p-4 space-y-0.5 text-white">
                <h3 className="text-[17px] font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 font-normal">
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
