'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Tag, Plus, CheckCircle2, Trash2 } from 'lucide-react';

export default function MerchantOffersPage() {
  const [offers, setOffers] = useState([
    { id: '1', title: 'Weekend Special: 15% Off Malabar Feast', code: 'FEAST15', validUntil: 'Jul 31, 2026', status: 'Active' },
    { id: '2', title: 'Buy 1 Biryani Get 1 Dessert Free', code: 'SWEETBIRYAN', validUntil: 'Aug 15, 2026', status: 'Active' },
  ]);

  const removeOffer = (id: string) => {
    setOffers(offers.filter((o) => o.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Special Offers' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Tag className="w-7 h-7 text-[#2563EB]" />
                <span>Special Offers & Merchant Deals</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Create promotional coupons and seasonal discounts for Kozhikode citizens</p>
            </div>

            <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
              <Plus className="w-4 h-4" /> Create New Offer
            </button>
          </div>

          <div className="space-y-4">
            {offers.map((off) => (
              <Card key={off.id} className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold font-mono">
                    PROMO CODE: {off.code}
                  </span>
                  <span className="text-xs text-[#6B7280] font-medium">Valid until {off.validUntil}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[#111827] font-sans">{off.title}</h4>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => removeOffer(off.id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-all inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Deactivate Deal
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
