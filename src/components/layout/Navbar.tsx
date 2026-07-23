'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Search, User, ShieldCheck, Menu, Building, Briefcase, Tag } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Button } from '@/components/ui/button';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import { CALICUT_LOCATIONS } from '@/config/constants';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuthStore();
  const { selectedLocation, setSelectedLocation, searchQuery, setSearchQuery, toggleMobileMenu } = useUIStore();
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/business?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl transition-all">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <LiveCalicutLogo />

          {/* Calicut Location Dropdown Selector */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-transparent text-[#111827] text-xs focus:outline-none cursor-pointer font-semibold pr-1"
            >
              {CALICUT_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-white text-[#111827]">
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Hyperlocal Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <InputSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores, cyberpark jobs, classifieds in Kozhikode..."
          />
        </form>

        {/* Navigation & Action Links */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/business"
              className="px-3.5 py-2 rounded-2xl text-[13px] font-semibold text-[#6B7280] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5"
            >
              <Building className="w-4 h-4 text-[#2563EB]" />
              Directory
            </Link>
            <Link
              href="/jobs"
              className="px-3.5 py-2 rounded-2xl text-[13px] font-semibold text-[#6B7280] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4 text-[#2563EB]" />
              Jobs
            </Link>
            <Link
              href="/marketplace"
              className="px-3.5 py-2 rounded-2xl text-[13px] font-semibold text-[#6B7280] hover:text-[#2563EB] hover:bg-[#F8FAFC] transition-colors flex items-center gap-1.5"
            >
              <Tag className="w-4 h-4 text-[#2563EB]" />
              Marketplace
            </Link>

            {isAdmin() && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5 border border-rose-200"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Engine
              </Link>
            )}
          </nav>

          {/* Account Profile / Auth Action */}
          {user ? (
            <Link href="/profile">
              <Button variant="outline" size="sm" className="h-[40px] rounded-2xl font-bold">
                <User className="w-4 h-4 mr-1.5 text-[#2563EB]" />
                {profile?.full_name?.split(' ')[0] || 'Profile'}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="h-[40px] px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Navigation Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-2xl text-[#111827] hover:text-[#2563EB] bg-[#F8FAFC] border border-[#E5E7EB]"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

const InputSearch: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="w-full relative flex items-center">
      <Search className="w-4 h-4 absolute left-3.5 text-[#6B7280] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2 text-[13px] text-[#111827] placeholder-[#6B7280] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all font-medium"
      />
    </div>
  );
};
