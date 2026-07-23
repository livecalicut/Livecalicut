'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Store, LogOut, ChevronRight, ExternalLink, X } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { RoleBadge } from '@/components/auth/role-badge';
import { useRouter } from 'next/navigation';

interface MerchantHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
}

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({
  breadcrumbs = [{ label: 'Merchant', href: '/merchant' }, { label: 'Dashboard' }],
}) => {
  const { profile, roleName, signOut } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 border-b border-[#E5E7EB] backdrop-blur-md px-6 py-3.5 flex items-center justify-between shadow-xs">
      {/* 1. Breadcrumbs & Store Switcher */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
        <Store className="w-4 h-4 text-[#2563EB]" />
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-[#2563EB] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-[#111827] font-bold">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 2. Controls & Actions */}
      <div className="flex items-center gap-4">
        {/* Global Merchant Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#6B7280] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, listings, orders..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] placeholder-[#9CA3AF] focus:bg-white focus:border-[#2563EB] focus:outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-[#6B7280] hover:text-[#111827]">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Live Public Storefront Button */}
        <Link
          href="/business"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold hover:bg-blue-100 transition-colors"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Real-time Lead Notification Center */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#6B7280] transition-colors"
          >
            <Bell className="w-4 h-4 text-[#111827]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </button>

          {/* Lead Notification Drawer */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl p-4 space-y-3 z-50 animate-fade-in-up">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <h4 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider font-sans">
                  Merchant Leads & Inquiries
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  2 New Enquiries
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                  <p className="font-bold text-[#111827]">New Customer Inquiry</p>
                  <p className="text-[11px] text-[#6B7280]">Dr. Anjali requested table reservation details.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] space-y-1">
                  <p className="font-bold text-[#111827]">New Job Application</p>
                  <p className="text-[11px] text-[#6B7280]">Fullstack developer applied to Cyberpark vacancy.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Authenticated Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {profile?.full_name?.charAt(0) || 'M'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#111827] leading-none font-sans">
                {profile?.full_name || 'Merchant Console'}
              </p>
              <div className="mt-0.5">
                <RoleBadge roleName={roleName} />
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="p-2 rounded-xl text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
