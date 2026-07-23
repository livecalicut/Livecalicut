import React from 'react';
import Link from 'next/link';
import { CALICUT_LOCATIONS } from '@/config/constants';
import { Heart, MapPin } from 'lucide-react';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-[#E5E7EB] pt-16 pb-24 lg:pb-12 text-[#6B7280] font-sans">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E5E7EB]">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <LiveCalicutLogo />
            <p className="text-[13px] text-[#6B7280] leading-relaxed font-normal">
              Kozhikode’s digital operating system connecting local shops, Cyberpark job seekers, and vibrant marketplace sellers across the Malabar region.
            </p>
          </div>

          {/* Quick Links */}
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

          {/* Hyperlocal Wards */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              Covered Calicut Hubs
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {CALICUT_LOCATIONS.slice(1).map((loc) => (
                <span
                  key={loc}
                  className="px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-[12px] text-[#6B7280] hover:text-[#2563EB] hover:border-[#2563EB] transition-all cursor-pointer font-medium"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#6B7280]">
          <p>© {new Date().getFullYear()} LiveCalicut Hyperlocal Ecosystem. Built for Kozhikode.</p>
          <div className="flex items-center gap-1.5 text-[#6B7280] font-medium">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>in Kozhikode, Kerala</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
