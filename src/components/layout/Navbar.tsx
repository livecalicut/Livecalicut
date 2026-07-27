'use client';

import React from 'react';
import Link from 'next/link';
import { User, ShieldCheck, Menu, Building, Briefcase, Tag } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import { LocationSelect } from '@/components/shared/location-select';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuthStore();
  const { selectedLocation, setSelectedLocation, toggleMobileMenu } = useUIStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-10 lg:px-20">
        <div className="flex items-center gap-6">
          <LiveCalicutLogo />

          <LocationSelect
            compact
            value={selectedLocation}
            onChange={setSelectedLocation}
            className="hidden lg:block"
          />
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/business"
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            >
              <Building className="h-4 w-4 text-[#2563EB]" aria-hidden />
              Directory
            </Link>
            <Link
              href="/jobs"
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            >
              <Briefcase className="h-4 w-4 text-[#2563EB]" aria-hidden />
              Jobs
            </Link>
            <Link
              href="/marketplace"
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            >
              <Tag className="h-4 w-4 text-[#2563EB]" aria-hidden />
              Marketplace
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            >
              Contact
            </Link>
            <Link
              href="/team"
              className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] transition-colors hover:bg-[#F8FAFC] hover:text-[#2563EB]"
            >
              Our Team
            </Link>

            {isAdmin() && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Admin Engine
              </Link>
            )}
          </nav>

          {user ? (
            <Link href="/profile">
              <Button variant="outline" size="sm" className="h-[40px] rounded-2xl font-bold">
                <User className="mr-1.5 h-4 w-4 text-[#2563EB]" aria-hidden />
                {profile?.full_name?.split(' ')[0] || 'Profile'}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                variant="default"
                size="sm"
                className="h-[40px] rounded-2xl bg-[#2563EB] px-5 font-bold text-white hover:bg-[#1D4ED8]"
              >
                Login
              </Button>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-2 text-[#111827] hover:text-[#2563EB] lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
