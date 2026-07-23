'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Building2, Newspaper, Calendar, Briefcase, Tag, Home, Menu, Search, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/button';
import { ProfileMenu } from './profile-menu';
import { NotificationIcon } from './notification-icon';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import { CALICUT_LOCATIONS } from '@/config/constants'; // Fallback if API fails

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [selectedLocation, setSelectedLocation] = React.useState('All Locations');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [locations, setLocations] = React.useState<string[]>(['All Locations']);

  React.useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          setLocations(['All Locations', ...json.data.map((a: any) => a.name)]);
        } else {
          setLocations([...CALICUT_LOCATIONS]);
        }
      })
      .catch(() => setLocations([...CALICUT_LOCATIONS]));
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/business', label: 'Businesses', icon: Building2 },
    { href: '/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/marketplace', label: 'Marketplace', icon: Tag },
    { href: '/news', label: 'News', icon: Newspaper },
    { href: '/events', label: 'Events', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all bg-white/95 backdrop-blur-xl border-b border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Location Picker */}
        <div className="flex items-center gap-6">
          <LiveCalicutLogo />

          {/* Spatial Location Selector */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#111827]">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <Select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border-none bg-transparent h-7 py-0 px-0 text-xs font-semibold shadow-none focus:ring-0 focus:outline-none"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc} className="bg-white text-[#111827]">
                  {loc}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-2xl text-[13px] font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-bold border border-blue-200 shadow-xs'
                    : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#2563EB]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Launcher */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#6B7280] hover:border-[#2563EB] hover:text-[#111827] transition-all cursor-pointer shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="font-medium">Search Kozhikode...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-[#6B7280] bg-white border border-[#E5E7EB] rounded-lg">⌘K</kbd>
          </Link>

          <NotificationIcon />

          <ProfileMenu />

          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="lg:hidden w-10 h-10 p-0 rounded-2xl"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#2563EB]" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white p-4 space-y-2 animate-fade-in-up">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-[#2563EB] font-bold'
                    : 'text-[#111827] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#2563EB]" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
