'use client';

import React from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { CreditCard, ShieldCheck, Check, ArrowRight, Download } from 'lucide-react';

export default function MerchantSubscriptionPage() {
  const invoices = [
    { id: 'INV-2026-001', date: 'Jul 01, 2026', plan: 'Verified Storefront Tier (Annual)', amount: '₹9,999', status: 'Paid' },
    { id: 'INV-2025-001', date: 'Jul 01, 2025', plan: 'Verified Storefront Tier (Annual)', amount: '₹9,999', status: 'Paid' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Subscription Plan' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-[#2563EB]" />
              <span>Merchant Subscription & Billing Desk</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Manage your active verified store plan, download GST invoices, and upgrade listing visibility</p>
          </div>

          {/* Active Plan Card */}
          <Card className="p-6 sm:p-8 border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 rounded-3xl shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200/60 pb-6">
              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider">
                  Active Tier
                </span>
                <h3 className="text-2xl font-extrabold text-[#111827] font-sans">Verified Commercial Store Plan</h3>
                <p className="text-xs text-[#6B7280]">Renews on July 01, 2027 • Unlimited customer leads</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-3xl font-black text-[#111827] font-sans">₹9,999<span className="text-xs text-[#6B7280] font-normal"> / year</span></p>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">100% Ward Check Included</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#111827] font-bold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Physical Ward Verification Badge</span>
              </div>
              <div className="flex items-center gap-2 text-[#111827] font-bold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Top Search Result Ranking on Wards</span>
              </div>
              <div className="flex items-center gap-2 text-[#111827] font-bold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Phone & WhatsApp Lead Routing</span>
              </div>
              <div className="flex items-center gap-2 text-[#111827] font-bold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited Cyberpark IT Job Postings</span>
              </div>
            </div>
          </Card>

          {/* Invoices History Table */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#E5E7EB]">
              <h4 className="text-base font-bold text-[#111827] font-sans">Billing & Invoice History</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Invoice ID</th>
                    <th className="py-3.5 px-4">Billing Date</th>
                    <th className="py-3.5 px-4">Subscription Plan</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-6 text-right">Download GST Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#111827]">{inv.id}</td>
                      <td className="py-4 px-4 text-[#6B7280] font-medium">{inv.date}</td>
                      <td className="py-4 px-4 font-bold text-[#111827]">{inv.plan}</td>
                      <td className="py-4 px-4 font-black text-[#111827]">{inv.amount}</td>
                      <td className="py-4 px-6 text-right">
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] text-[#2563EB] text-xs font-bold transition-all">
                          <Download className="w-3.5 h-3.5" /> PDF Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
