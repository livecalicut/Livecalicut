'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Store, Save, CheckCircle2, MapPin, Clock, Phone, MessageCircle, Globe, Camera } from 'lucide-react';

export default function MerchantProfilePage() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [bName, setBName] = useState('Paragon Restaurant & Malabar Dining');
  const [phone, setPhone] = useState('+91 495 276 8888');
  const [whatsapp, setWhatsapp] = useState('+91 98470 55667');
  const [ward, setWard] = useState('Ward 12 - Mavoor Road Junction, Calicut');
  const [hours, setHours] = useState('07:00 AM - 11:30 PM (Mon - Sun)');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Business Profile' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <Store className="w-7 h-7 text-[#2563EB]" />
              <span>Business Storefront Profile</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Update commercial outlet details, operational hours, ward location, and direct customer contact desks</p>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Commercial profile modifications saved! Your live storefront will reflect these updates instantly.</span>
            </div>
          )}

          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
                  Business Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                  <Input
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
                    Contact Phone Desk *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
                    WhatsApp Inquiry Line *
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
                    Spatial Ward & Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                    <Input
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
                    Working Hours *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                    <Input
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1">
                  Store Bio & Description *
                </label>
                <textarea
                  rows={4}
                  defaultValue="Iconic Malabar dining experience located near Mavoor Road Junction, Kozhikode. Renowned for authentic Malabar Dum Biryani, fresh seafood specialties, and traditional Kerala hospitality."
                  className="w-full p-3.5 text-xs font-medium rounded-xl border border-[#E5E7EB] bg-white text-[#111827] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2">
                  <Save className="w-4 h-4" /> Save Business Profile
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}
