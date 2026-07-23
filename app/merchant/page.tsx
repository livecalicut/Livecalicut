import React from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Store,
  ShieldCheck,
  Eye,
  PhoneCall,
  MessageCircle,
  Star,
  Users,
  Plus,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  Building2,
  Briefcase,
  Tag,
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantDashboardPage() {
  const kpis = [
    { label: 'Monthly Storefront Views', value: '12,480', sub: '+18.4% vs last month', icon: Eye, color: 'text-[#2563EB]', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Direct Call Leads', value: '428', sub: 'Verified phone clicks', icon: PhoneCall, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'WhatsApp Inquiries', value: '184', sub: 'Instant chat leads', icon: MessageCircle, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
    { label: 'Customer Trust Score', value: '4.9 ★', sub: '1,240 verified reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  ];

  const recentLeads = [
    { name: 'Dr. Faisal Rahman', phone: '+91 98950 12345', type: 'Table Reservation', Ward: 'Ward 12 Beach Road', time: '15 mins ago' },
    { name: 'Anjali Nambiar', phone: '+91 94471 98765', type: 'Software Lead Inquiry', Ward: 'Ward 8 Cyberpark', time: '1 hour ago' },
    { name: 'Moideenkutty K.', phone: '+91 98470 54321', type: 'Bulk Catering Query', Ward: 'Ward 1 SM Street', time: '3 hours ago' },
  ];

  const recentReviews = [
    { reviewer: 'Dr. Faisal', rating: 5, comment: 'Exceptional Malabar cuisine and prompt customer response. Ward physical verification gives complete peace of mind!', time: 'Today' },
    { reviewer: 'Anjali N.', rating: 5, comment: 'Great ambiance and smooth booking process via LiveCalicut.', time: 'Yesterday' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Dashboard' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Welcome Banner Card */}
          <Card className="p-6 sm:p-8 border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 rounded-3xl shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Ward Physical Verification Verified</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-sans tracking-tight">
                  Welcome to Paragon Restaurant Merchant OS
                </h1>
                <p className="text-sm text-[#6B7280]">
                  Your commercial outlet is actively connected to Kozhikode citizens across 21 spatial wards.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/merchant/profile">
                  <button className="h-[44px] px-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-[#111827] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#2563EB]" /> Edit Outlet Details
                  </button>
                </Link>
                <Link href="/merchant/jobs">
                  <button className="h-[44px] px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Post Job Vacancy
                  </button>
                </Link>
              </div>
            </div>
          </Card>

          {/* High-Impact Performance KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <Card key={k.label} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs space-y-3 hover:border-blue-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B7280] font-sans">{k.label}</span>
                    <div className={`w-9 h-9 rounded-xl ${k.bg} border ${k.border} flex items-center justify-center ${k.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-[#111827] font-sans tracking-tight">{k.value}</p>
                    <p className="text-[11px] text-[#6B7280] font-medium mt-0.5">{k.sub}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Customer Leads CRM & Reviews Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Recent Customer Inquiries & Leads */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#111827] flex items-center gap-2 font-sans">
                  <Users className="w-5 h-5 text-[#2563EB]" />
                  <span>Recent Customer Inquiries & Leads</span>
                </h3>
                <Link href="/merchant/leads" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-0.5">
                  <span>View All Leads</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                        <th className="py-3.5 px-6">Customer Name</th>
                        <th className="py-3.5 px-4">Inquiry Category</th>
                        <th className="py-3.5 px-4">Spatial Ward</th>
                        <th className="py-3.5 px-4">Time</th>
                        <th className="py-3.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] text-xs">
                      {recentLeads.map((lead, i) => (
                        <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-4 px-6 font-bold text-[#111827]">{lead.name}</td>
                          <td className="py-4 px-4 text-[#4B5563] font-medium">{lead.type}</td>
                          <td className="py-4 px-4 text-[#6B7280] font-medium">{lead.Ward}</td>
                          <td className="py-4 px-4 text-[#9CA3AF] text-[11px]">{lead.time}</td>
                          <td className="py-4 px-6 text-right">
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Contact
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right Column: Reviews & Subscription Plan */}
            <div className="lg:col-span-4 space-y-6">
              {/* Subscription Status Card */}
              <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h4 className="text-sm font-extrabold text-[#111827] font-sans flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#2563EB]" />
                    <span>Active Merchant Tier</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2563EB] text-[10px] font-bold">
                    Verified Plan
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Listing Visibility</span>
                    <span className="font-bold text-emerald-600">Top Ward Search</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Lead Capture & Phone Clicks</span>
                    <span className="font-bold text-[#111827]">Unlimited</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Renews In</span>
                    <span className="font-bold text-[#2563EB]">184 Days</span>
                  </div>
                </div>
              </Card>

              {/* Recent Reviews Feed */}
              <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                  <h4 className="text-sm font-extrabold text-[#111827] font-sans">
                    Latest Citizen Feedback
                  </h4>
                  <Link href="/merchant/reviews" className="text-xs text-[#2563EB] font-bold hover:underline">
                    Manage All
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentReviews.map((rev, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">{rev.reviewer}</span>
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating)].map((_, r) => (
                            <Star key={r} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-[12px] text-[#4B5563] leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
