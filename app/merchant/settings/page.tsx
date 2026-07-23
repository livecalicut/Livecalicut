'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Settings, Bell, ShieldCheck, ToggleRight, ToggleLeft, Save, CheckCircle2 } from 'lucide-react';

export default function MerchantSettingsPage() {
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Settings' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <Settings className="w-7 h-7 text-[#2563EB]" />
              <span>Merchant Notification & Store Preferences</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Configure lead routing rules, real-time alert preferences, and account security</p>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Merchant settings saved successfully!</span>
            </div>
          )}

          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <h4 className="text-base font-bold text-[#111827] font-sans flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2563EB]" />
              <span>Instant Customer Lead Alerts</span>
            </h4>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div>
                  <p className="text-xs font-bold text-[#111827]">Instant WhatsApp Lead Dispatch</p>
                  <p className="text-[11px] text-[#6B7280]">Receive real-time WhatsApp alert whenever a citizen submits an inquiry</p>
                </div>
                <button onClick={() => setWhatsappAlerts(!whatsappAlerts)} className="text-[#2563EB]">
                  {whatsappAlerts ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-[#9CA3AF]" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB]">
                <div>
                  <p className="text-xs font-bold text-[#111827]">Daily Customer Analytics Email Digest</p>
                  <p className="text-[11px] text-[#6B7280]">Receive daily summary of storefront views and phone number clicks</p>
                </div>
                <button onClick={() => setEmailDigest(!emailDigest)} className="text-[#2563EB]">
                  {emailDigest ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-[#9CA3AF]" />}
                </button>
              </div>
            </div>
          </Card>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="px-6 h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
