'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import { useAllLocations } from '@/hooks/use-locations';

export const Footer: React.FC = () => {
  // Shared locations cache — refreshes when admin adds/removes an area
  const { data } = useAllLocations();
  const areas = (data?.rows || []).slice(0, 12);

  return (
    <footer className="w-full border-t border-[#E5E7EB] bg-white pb-24 pt-16 text-[#6B7280] lg:pb-12">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 gap-10 border-b border-[#E5E7EB] pb-12 md:grid-cols-4">
          <div className="space-y-4">
            <LiveCalicutLogo />
            <p className="text-[13px] font-normal leading-relaxed text-[#6B7280]">
              Kozhikode’s digital operating system connecting local shops, Cyberpark tech job
              seekers, local news, and marketplace classifieds across the Malabar region.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-[13px] font-medium">
              <li>
                <Link href="/business" className="transition-colors hover:text-[#2563EB]">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="transition-colors hover:text-[#2563EB]">
                  Cyberpark & Local Jobs
                </Link>
              </li>
              <li>
                <Link href="/news" className="transition-colors hover:text-[#2563EB]">
                  Local News Editorial
                </Link>
              </li>
              <li>
                <Link href="/locations" className="transition-colors hover:text-[#2563EB]">
                  City Locations
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h4 className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#111827]">
              <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
              Kozhikode City Hubs
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {areas.length === 0 ? (
                <Link
                  href="/locations"
                  className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1 text-[12px] font-medium text-[#6B7280] transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
                >
                  View locations
                </Link>
              ) : (
                areas.map((loc) => (
                  <Link
                    key={loc.id}
                    href="/locations"
                    className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1 text-[12px] font-medium text-[#6B7280] transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
                  >
                    {loc.name}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[13px] text-[#6B7280] sm:flex-row">
          <p>© {new Date().getFullYear()} LiveCalicut Digital Ecosystem. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium text-[#6B7280]">
            <span>Crafted with</span>
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            <span>in Kozhikode, Kerala</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
