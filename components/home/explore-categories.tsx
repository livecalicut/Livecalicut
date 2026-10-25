'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  Home,
  Wrench,
  Utensils,
  Calendar,
  Plane,
  ChevronRight,
  ArrowRight,
  Store,
  Megaphone,
  Tag,
  MapPin,
  Heart,
  GraduationCap,
} from 'lucide-react';

interface CategoryItem {
  name: string;
  href: string;
  icon: React.ElementType;
  iconClass: string;
}

const PAGES: CategoryItem[][] = [
  [
    { name: 'Restaurants', href: '/restaurants', icon: Utensils, iconClass: 'bg-orange-500' },
    { name: 'Shops', href: '/business', icon: Store, iconClass: 'bg-[#2563EB]' },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, iconClass: 'bg-emerald-500' },
    { name: 'Properties', href: '/properties', icon: Home, iconClass: 'bg-violet-500' },
    { name: 'Events', href: '/events', icon: Calendar, iconClass: 'bg-pink-500' },
    { name: 'Services', href: '/business?category=Services', icon: Wrench, iconClass: 'bg-teal-500' },
    { name: 'Tourism', href: '/tourism', icon: Plane, iconClass: 'bg-[#2563EB]' },
    { name: 'Advertise', href: '/merchant', icon: Megaphone, iconClass: 'bg-violet-600' },
  ],
  [
    { name: 'Classified', href: '/marketplace', icon: Tag, iconClass: 'bg-rose-500' },
    { name: 'Places', href: '/explore', icon: MapPin, iconClass: 'bg-sky-500' },
    { name: 'Wellness', href: `/business?category=${encodeURIComponent('Beauty & Wellness')}`, icon: Heart, iconClass: 'bg-fuchsia-500' },
    { name: 'Education', href: '/business?category=Education', icon: GraduationCap, iconClass: 'bg-amber-500' },
    { name: 'Businesses', href: '/business', icon: Building2, iconClass: 'bg-[#2563EB]' },
  ],
];

export const ExploreCategories: React.FC = () => {
  const [page, setPage] = useState(0);

  return (
    <section className="w-full bg-white px-4 pt-2 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              <span className="border-b-[3px] border-[#2563EB] pb-1">Popular Categories</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500">Explore what you need, right here.</p>
          </div>
          <Link
            href="/business"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-wrap [&::-webkit-scrollbar]:hidden">
          {PAGES[page].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${cat.iconClass}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-slate-900">{cat.name}</span>
                <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-[#2563EB]" />
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          {PAGES.map((_, dot) => (
            <button
              key={dot}
              type="button"
              aria-label={`Show category page ${dot + 1}`}
              aria-current={dot === page ? 'true' : undefined}
              onClick={() => setPage(dot)}
              className={`h-1.5 rounded-full transition-all ${dot === page ? 'w-4 bg-[#2563EB]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
