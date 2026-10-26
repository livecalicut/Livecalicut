'use client';

import React from 'react';
import Link from 'next/link';
import {
  Megaphone,
  ArrowRight,
  Award,
  Layout,
  Globe,
  Tag,
  Calendar,
  Briefcase,
  MessageCircle,
  PlusCircle,
} from 'lucide-react';
import { siteWhatsAppHref } from '@/config/constants';

const PACKAGES = [
  {
    title: 'Featured Listing',
    desc: 'Top search & home visibility',
    icon: Award,
  },
  {
    title: 'Banner Advertising',
    desc: 'High-impact brand exposure',
    icon: Layout,
  },
  {
    title: 'Verified Storefront',
    desc: 'Direct WhatsApp & phone leads',
    icon: Globe,
  },
  {
    title: 'Offer Promotion',
    desc: 'Flash sales & discount deals',
    icon: Tag,
  },
  {
    title: 'Event Promotion',
    desc: 'Audience ticket booking boost',
    icon: Calendar,
  },
  {
    title: 'Job Vacancy Boost',
    desc: 'Hire verified local talent fast',
    icon: Briefcase,
  },
];

export const AdvertiseSection: React.FC = () => {
  return (
    <section className="w-full bg-slate-50/70 py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50/90 via-white to-amber-50/30 rounded-3xl p-6 sm:p-10 border border-blue-200/80 shadow-sm space-y-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-md">
                <Megaphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  Advertise with LiveCalicut
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
                  Reach thousands of customers across Calicut daily. Boost footfall, inquiries and revenue with targeted advertising packages.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={siteWhatsAppHref('Hi LiveCalicut, I want to know about advertising packages for my business')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="/business/create"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Business Free</span>
              </Link>
            </div>
          </div>

          {/* 6 Promo Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.title}
                  className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 leading-snug">
                    {pkg.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
                    {pkg.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Sub-tagline */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Malabar merchant advertising &amp; verified lead network</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/merchant" className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
                <span>View Merchant Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

