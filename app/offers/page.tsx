'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Tag, Sparkles, Percent, ArrowRight, Store, Utensils, ShoppingBag, Clock } from 'lucide-react';

const OFFERS = [
  {
    id: '1',
    title: 'Flat 20% Off Malabar Feast & Biryani',
    business: 'Paragon Restaurant',
    location: 'CH Flyover, Kozhikode',
    discount: '20% OFF',
    code: 'MALABAR20',
    validTill: 'Valid till 30 Nov 2026',
    category: 'Dining & Cafés',
    icon: Utensils,
    href: '/restaurants',
  },
  {
    id: '2',
    title: 'Buy 2 Get 1 Free on Wedding Silks',
    business: 'Kalyan Silks',
    location: 'Palayam, Kozhikode',
    discount: 'B2G1 FREE',
    code: 'FESTIVE26',
    validTill: 'Weekend Special',
    category: 'Shopping & Retail',
    icon: ShoppingBag,
    href: '/business?category=shopping-entertainment',
  },
  {
    id: '3',
    title: 'Free Modular Kitchen Consultation',
    business: 'Decolink Interio',
    location: 'Nadakkavu, Calicut',
    discount: 'FREE DESIGN',
    code: 'DECO2026',
    validTill: 'Limited Slots',
    category: 'Local Services',
    icon: Store,
    href: '/business',
  },
  {
    id: '4',
    title: '30% Off on Full Body Health Checkup',
    business: 'Aster MIMS Specialty Care',
    location: 'Mini Bypass Road, Govindapuram',
    discount: '30% OFF',
    code: 'CARE30',
    validTill: 'Valid this month',
    category: 'Lifestyle & Wellness',
    icon: Sparkles,
    href: '/business?category=lifestyle-wellness',
  },
];

export default function OffersPage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="LiveCalicut Offers & Deals"
        description="Exclusive discounts, seasonal vouchers & special merchant deals across Calicut city."
        icon={<Tag className="w-6 h-6 text-rose-500" />}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Offers & Discounts' },
        ]}
      />

      {/* Featured Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Calicut Super Saver Deals
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Save Big at Your Favorite Local Outlets
          </h2>
          <p className="text-xs sm:text-sm text-white/90">
            Show these digital vouchers at the counter or mention the code during billing to avail exclusive discounts.
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {OFFERS.map((offer) => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-black text-xs">
                    {offer.discount}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#2563EB] transition-colors line-clamp-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{offer.business}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{offer.location}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Promo Code</span>
                  <p className="font-mono font-bold text-sm text-slate-800 tracking-widest">{offer.code}</p>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {offer.validTill}
                </span>
                <Link
                  href={offer.href}
                  className="font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

