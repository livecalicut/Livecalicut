'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import { useAllLocations } from '@/hooks/use-locations';

export const Footer: React.FC = () => {
  // Shared locations cache — refreshes when admin adds/removes an area
  const { data } = useAllLocations();
  const areas = (data?.rows || []).map((a) => a.name).filter(Boolean);

  return (
    <footer className="w-full bg-white border-t border-[#E5E7EB] pt-16 pb-24 lg:pb-12 text-[#6B7280] font-sans">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5E7EB]">
          <div className="md:col-span-1 space-y-4">
            <LiveCalicutLogo />
            <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">
              Kozhikode’s digital operating system connecting local shops, Cyberpark job seekers, and vibrant marketplace sellers across the Malabar region.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Modules</h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <li>
                <Link href="/business" className="hover:text-[#2563EB] transition-colors">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-[#2563EB] transition-colors">
                  Cyberpark & Calicut Jobs
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-[#2563EB] transition-colors">
                  Local Marketplace Classifieds
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              Covered Calicut Hubs
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {areas.length === 0 ? (
                <Link
                  href="/locations"
                  className="px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-[12px] text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB] transition-all font-medium"
                >
                  View all locations
                </Link>
              ) : (
                areas.slice(0, 12).map((loc) => (
                  <Link
                    key={loc}
                    href="/locations"
                    className="px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-[12px] text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB] transition-all font-medium"
                  >
                    {loc}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-[12px]">
          <p>© {new Date().getFullYear()} LiveCalicut. Built for Kozhikode.</p>
          <p className="inline-flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500" /> in Malabar
          </p>
        </div>
      </div>
    </footer>
  );
};
