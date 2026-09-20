'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  Home,
  Tag,
  Wrench,
  Utensils,
  MapPin,
  Calendar,
  Heart,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

interface CategoryItem {
  name: string;
  href: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    name: 'Businesses',
    href: '/business',
    icon: Building2,
    bgColor: 'bg-emerald-50 hover:bg-emerald-100/80',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200/80',
  },
  {
    name: 'Jobs',
    href: '/jobs',
    icon: Briefcase,
    bgColor: 'bg-blue-50 hover:bg-blue-100/80',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200/80',
  },
  {
    name: 'Properties',
    href: '/properties',
    icon: Home,
    bgColor: 'bg-cyan-50 hover:bg-cyan-100/80',
    iconColor: 'text-cyan-600',
    borderColor: 'border-cyan-200/80',
  },
  {
    name: 'Classified',
    href: '/marketplace',
    icon: Tag,
    bgColor: 'bg-rose-50 hover:bg-rose-100/80',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200/80',
  },
  {
    name: 'Services',
    href: '/business?category=Services',
    icon: Wrench,
    bgColor: 'bg-purple-50 hover:bg-purple-100/80',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200/80',
  },
  {
    name: 'Food',
    href: '/restaurants',
    icon: Utensils,
    bgColor: 'bg-amber-50 hover:bg-amber-100/80',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200/80',
  },
  {
    name: 'Places',
    href: '/explore',
    icon: MapPin,
    bgColor: 'bg-sky-50 hover:bg-sky-100/80',
    iconColor: 'text-sky-600',
    borderColor: 'border-sky-200/80',
  },
  {
    name: 'Events',
    href: '/events',
    icon: Calendar,
    bgColor: 'bg-red-50 hover:bg-red-100/80',
    iconColor: 'text-red-600',
    borderColor: 'border-red-200/80',
  },
  {
    name: 'Wellness',
    href: `/business?category=${encodeURIComponent('Beauty & Wellness')}`,
    icon: Heart,
    bgColor: 'bg-pink-50 hover:bg-pink-100/80',
    iconColor: 'text-pink-600',
    borderColor: 'border-pink-200/80',
  },
  {
    name: 'Education',
    href: '/business?category=Education',
    icon: GraduationCap,
    bgColor: 'bg-indigo-50 hover:bg-indigo-100/80',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200/80',
  },
];

export const ExploreCategories: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-14 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-6 sm:pb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
              Find exactly what you need in Kozhikode
            </p>
          </div>
          <Link
            href="/business"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 10-Item Responsive Category Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className={`group flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border ${cat.borderColor} ${cat.bgColor} transition-all duration-200 hover:-translate-y-1 hover:shadow-sm text-center`}
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/90 shadow-xs flex items-center justify-center ${cat.iconColor} mb-2.5 transition-transform group-hover:scale-110`}>
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-[12px] sm:text-[13px] font-semibold text-slate-800 group-hover:text-slate-950 truncate max-w-full">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
