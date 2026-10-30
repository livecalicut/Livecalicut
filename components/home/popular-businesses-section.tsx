'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Star,
  MapPin,
  ArrowRight,
  Store,
  Building2,
  Utensils,
  Heart,
  Home,
  Briefcase,
  PlusCircle,
} from 'lucide-react';
import { getExactBusinessLocation } from '@/lib/business/location';

export interface PopularBusinessItem {
  id: string;
  slug?: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  image?: string | null;
}

interface PopularBusinessesSectionProps {
  businesses?: PopularBusinessItem[];
}

export const PopularBusinessesSection: React.FC<PopularBusinessesSectionProps> = ({
  businesses = [],
}) => {
  const hasRealItems = businesses && businesses.length > 0;

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-6 sm:pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                Popular &amp; Verified Businesses
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal">
                Discover top rated dining, shopping, hospitals &amp; retail across Calicut
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/business/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Business</span>
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {hasRealItems ? (
          /* 6 Cards Responsive Grid with real DB data */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {businesses.map((biz) => {
              const href = biz.slug ? `/business/${biz.slug}` : `/business/${biz.id}`;

              return (
                <Link
                  key={biz.id}
                  href={href}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Clean Logo Container (100% visible, centered, not cropped) */}
                  <div className="relative w-full h-32 sm:h-36 bg-white border-b border-slate-100 flex items-center justify-center p-3 overflow-hidden">
                    <img
                      src={biz.image || '/heroes/city-market.jpg'}
                      alt={biz.name}
                      className="max-h-full max-w-full object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {biz.name}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                        {biz.category}
                      </p>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      {/* Genuine Reviews Only - No fake default ratings */}
                      {biz.reviewCount > 0 && biz.rating > 0 ? (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{biz.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-slate-400 text-[11px]">
                            ({biz.reviewCount})
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-400 text-[11px] font-medium">No reviews yet</span>
                        </div>
                      )}

                      {/* Exact Location */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-700 truncate font-semibold">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{getExactBusinessLocation(biz)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Category Explorer Cards when 0 businesses */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Food & Dining', icon: Utensils, href: '/restaurants', count: 'Explore Menus' },
              { name: 'Healthcare', icon: Heart, href: '/business?category=Healthcare', count: 'Find Doctors' },
              { name: 'Shopping & Retail', icon: Store, href: '/business?category=Shopping', count: 'Local Shops' },
              { name: 'Real Estate', icon: Home, href: '/properties', count: 'Homes & Plots' },
              { name: 'IT & Careers', icon: Briefcase, href: '/jobs', count: 'Job Openings' },
              { name: 'Enterprises', icon: Building2, href: '/business', count: 'All Outlets' },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-[#2563EB]/40 hover:shadow-md transition-all flex flex-col items-center text-center space-y-2.5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white group-hover:bg-[#2563EB] text-[#2563EB] group-hover:text-white shadow-xs flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-[#2563EB] transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
