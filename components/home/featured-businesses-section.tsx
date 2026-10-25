'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  Star,
  MapPin,
  Heart,
  ArrowRight,
  Phone,
  MessageCircle,
  Megaphone,
  ShieldCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { siteWhatsAppHref } from '@/config/constants';

export interface FeaturedBusinessItem {
  id: string;
  slug?: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  image?: string | null;
  phone?: string;
  isSponsored?: boolean;
}

interface FeaturedBusinessesSectionProps {
  businesses?: FeaturedBusinessItem[];
}

export const FeaturedBusinessesSection: React.FC<FeaturedBusinessesSectionProps> = ({
  businesses = [],
}) => {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const hasRealItems = businesses && businesses.length > 0;

  return (
    <section className="w-full bg-slate-50/80 py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                  Featured &amp; Premium Listings
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                  Sponsored
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
                Verified top-tier businesses, dining spots &amp; premier enterprises in Kozhikode
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/business/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Advertise With Us</span>
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

        {/* Dynamic Content Grid */}
        {hasRealItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {businesses.map((biz) => {
              const isFav = favorites[biz.id];
              const href = biz.slug ? `/business/${biz.slug}` : `/business/${biz.id}`;
              const cleanPhone = biz.phone?.replace(/[^0-9]/g, '');

              return (
                <div
                  key={biz.id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Image & Badges */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={biz.image || '/heroes/city-market.jpg'}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
                        <Crown className="w-3 h-3 fill-slate-950" /> Featured
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFav(biz.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
                      aria-label="Favorite"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                      />
                    </button>

                    {/* Category pill on image */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 font-bold text-[11px] shadow-xs">
                        {biz.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <Link href={href}>
                        <h3 className="font-bold text-slate-900 text-base sm:text-[17px] group-hover:text-[#2563EB] transition-colors line-clamp-1 leading-snug">
                          {biz.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{biz.rating ? biz.rating.toFixed(1) : '4.5'}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          ({biz.reviewCount >= 1000 ? `${(biz.reviewCount / 1000).toFixed(1)}k` : biz.reviewCount || 1} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Location & Quick Actions */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate font-medium">{biz.location || 'Kozhikode, Kerala'}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {cleanPhone ? (
                          <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-600" /> Call
                          </a>
                        ) : (
                          <Link
                            href={href}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                          >
                            Details
                          </Link>
                        )}

                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(biz.name)},%20I%20saw%20your%20listing%20on%20LiveCalicut`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                          </a>
                        ) : (
                          <Link
                            href={href}
                            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-colors shadow-xs"
                          >
                            Explore
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Advertiser Spotlight Callout Cards when no featured listings */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Spotlight Your Business',
                desc: 'Reach Kozhikode shoppers, diners & clients looking for verified local services daily.',
                badge: 'Homepage Prime Spot',
                icon: Crown,
              },
              {
                title: 'Featured Restaurant & Cafe',
                desc: 'Showcase menus, food offers, and delivery contacts right at the top of Calicut foodies.',
                badge: 'Top Dining Placement',
                icon: Building2,
              },
              {
                title: 'Property & Luxury Stays',
                desc: 'Promote premium villas, commercial spaces and homestays directly to verified buyers.',
                badge: 'Real Estate Spotlight',
                icon: Building2,
              },
              {
                title: 'Local Retail & Services',
                desc: 'Drive calls, footfall and WhatsApp inquiries directly to your store in Kozhikode.',
                badge: 'Business Boost',
                icon: TrendingUp,
              },
            ].map((slot, i) => {
              const Icon = slot.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between space-y-5 text-center items-center group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shadow-xs">
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                      {slot.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                      {slot.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {slot.desc}
                    </p>
                  </div>

                  <Link
                    href="/business/create"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 group-hover:bg-[#2563EB] text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span>Get Featured Here</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Interactive Advertiser Strip */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-4 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-slate-700/50">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Want your brand featured on LiveCalicut&apos;s home page &amp; search?
              </h4>
              <p className="text-xs text-slate-300 font-normal mt-0.5">
                Targeted local visibility, high-intent customer leads &amp; WhatsApp inquiries for your outlet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/merchant"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
            >
              Merchant Plans
            </Link>
            <a
              href={siteWhatsAppHref('Hi LiveCalicut, I would like to advertise my business on your portal')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

