import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { OffersService, Offer } from '@/lib/services/offers.service';
import {
  Tag,
  Sparkles,
  ArrowRight,
  Store,
  Clock,
  Building2,
  Percent,
} from 'lucide-react';

export const revalidate = 60;

export default async function OffersPage() {
  const offers: Offer[] = await OffersService.getAllOffers({ activeOnly: true });

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

      {/* Featured Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Calicut Verified Merchant Deals
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Save Big at Verified Local Outlets
          </h2>
          <p className="text-xs sm:text-sm text-white/90">
            Show these digital vouchers at the counter or mention the promo code during billing to avail exclusive discounts directly from Calicut merchants.
          </p>
        </div>
      </div>

      {/* Offers Grid or Clean Zero-Dummy Empty State */}
      {offers.length === 0 ? (
        <EmptyState
          title="No Active Offers at the Moment"
          description="Local merchants, clinics, and stores across Calicut regularly update their promotional deals and seasonal coupons here. Check back soon or list your store offer."
          actionLabel="List Your Store Offer"
          actionHref="/merchant"
          hooks={[
            {
              href: '/business',
              label: 'Explore Businesses',
              description: 'Browse verified outlets in Calicut',
              icon: Building2,
            },
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-black text-xs">
                    <Percent className="w-3.5 h-3.5" /> {offer.discount}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-[#2563EB] flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#2563EB] transition-colors line-clamp-2">
                    {offer.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-1">{offer.business_name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{offer.location}</p>
                </div>

                {offer.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {offer.description}
                  </p>
                )}

                {offer.code && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Promo Code
                    </span>
                    <p className="font-mono font-bold text-sm text-slate-800 tracking-widest">
                      {offer.code}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {offer.valid_till || 'Ongoing'}
                </span>
                <Link
                  href={offer.link || '/business'}
                  className="font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1"
                >
                  View Store <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
