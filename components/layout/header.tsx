'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  LayoutGrid,
  ChevronDown,
  Sparkles,
  Tag,
  Building2,
  Briefcase,
  Compass,
  Newspaper,
  Utensils,
  Camera,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/auth/role-badge';
import { ProfileMenu } from './profile-menu';
import { NotificationIcon } from './notification-icon';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import { LocationSelect } from '@/components/shared/location-select';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';

interface MegaMenuLink {
  label: string;
  href: string;
}

interface MegaMenuGroup {
  title: string;
  links: MegaMenuLink[];
}

const MEGA_MENU_GROUPS: MegaMenuGroup[] = [
  {
    title: 'Discover & Experience',
    links: [
      { label: 'Restaurants & Cafés', href: '/restaurants' },
      { label: 'Tourism & Destinations', href: '/tourism' },
      { label: 'Lifestyle & Wellness', href: '/business?category=lifestyle-wellness' },
      { label: 'Shopping & Entertainment', href: '/business?category=shopping-entertainment' },
      { label: 'Arts & Culture', href: '/places?category=arts-culture' },
    ],
  },
  {
    title: 'Business & Marketplace',
    links: [
      { label: 'Business Directory', href: '/business' },
      { label: 'Local Services', href: '/business?category=local-services' },
      { label: 'Classifieds', href: '/marketplace' },
      { label: 'Properties', href: '/properties' },
      { label: 'Featured Businesses', href: '/business?featured=true' },
    ],
  },
  {
    title: 'Work & Community',
    links: [
      { label: 'Jobs & Careers', href: '/jobs' },
      { label: 'Internships', href: '/jobs?type=internship' },
      { label: 'Education & Courses', href: '/business?category=education-courses' },
      { label: 'Startups & Creators', href: '/business?category=startups-creators' },
      { label: 'Community Stories', href: '/news' },
    ],
  },
  {
    title: 'City & Community',
    links: [
      { label: 'Traffic & Transport', href: '/places?category=traffic-transport' },
      { label: 'Sports & Activities', href: '/events?category=sports-activities' },
      { label: 'Local Initiatives', href: '/about' },
      { label: 'Public Announcements', href: '/news?category=public-announcements' },
    ],
  },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerArea, setHeaderArea] = useState(ALL_LOCATIONS_LABEL);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, user_roles(roles(name))')
          .eq('id', session.user.id)
          .single();
        if (profileData) setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    }
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadSession();
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  const roleNames =
    profile?.user_roles?.map((ur: any) => ur?.roles?.name).filter(Boolean) || ['User'];
  const highestRole = roleNames.includes('Super Admin')
    ? 'Super Admin'
    : roleNames.includes('City Admin')
      ? 'City Admin'
      : roleNames.includes('Moderator')
        ? 'Moderator'
        : roleNames.includes('Marketing Executive')
          ? 'Marketing Executive'
          : roleNames.includes('Merchant')
            ? 'Merchant'
            : 'User';

  const isStaff = ['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive'].some((r) =>
    roleNames.includes(r)
  );
  const isMerchantOnly = roleNames.includes('Merchant') && !roleNames.includes('Super Admin');

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#0B1E4B] text-white ${scrolled ? 'shadow-lg' : ''}`}>
      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center gap-3 px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <LiveCalicutLogo tone="light" />
        </div>

        {/* Location Selector (Desktop) */}
        <div className="hidden shrink-0 2xl:block">
          <LocationSelect
            value={headerArea}
            onChange={(name) => {
              setHeaderArea(name);
              if (name && name !== ALL_LOCATIONS_LABEL) {
                router.push(`/search?area=${encodeURIComponent(name)}`);
              }
            }}
            tone="nav"
            allLabel="Calicut"
          />
        </div>

        {/* Main Navigation (Matching Attached Image 2) */}
        <nav className="mx-2 hidden min-w-0 flex-1 items-center gap-1 xl:gap-2 lg:flex">
          {/* Explore Mega Menu Dropdown */}
          <div className="relative" ref={megaMenuRef}>
            <button
              type="button"
              onClick={() => setIsMegaMenuOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-2 text-[13px] font-semibold rounded-lg transition-colors cursor-pointer ${
                isMegaMenuOpen
                  ? 'text-white bg-white/15'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
              aria-expanded={isMegaMenuOpen}
              aria-haspopup="true"
            >
              <span>Explore</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180 text-blue-300' : 'text-white/70'
                }`}
              />
            </button>

            {/* Mega Menu Dropdown Panel */}
            {isMegaMenuOpen && (
              <div className="absolute top-full left-0 mt-3 w-[880px] max-w-[90vw] rounded-2xl bg-[#091535] border border-white/15 p-6 shadow-2xl text-white z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">Explore Mega Menu</h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      Quick access to Calicut&apos;s digital directories, opportunities &amp; city updates
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label="Close explore menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-6">
                  {MEGA_MENU_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-3">
                      <h4 className="text-[13px] font-bold text-white tracking-wide border-b border-white/10 pb-1.5">
                        {group.title}
                      </h4>
                      <ul className="space-y-2">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setIsMegaMenuOpen(false)}
                              className="text-xs text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-150 inline-block font-medium"
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Updates */}
          <Link
            href="/live-updates"
            className={`px-2.5 py-1.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              pathname === '/live-updates' || pathname === '/feed'
                ? 'text-white bg-white/15 font-bold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            Live Updates
          </Link>

          {/* Events */}
          <Link
            href="/events"
            className={`px-2.5 py-1.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              pathname === '/events'
                ? 'text-white bg-white/15 font-bold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            Events
          </Link>

          {/* Advertise */}
          <Link
            href="/merchant"
            className={`px-2.5 py-1.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              pathname === '/merchant'
                ? 'text-white bg-white/15 font-bold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            Advertise
          </Link>

          {/* Offers (Red Badge Pill from Image 2) */}
          <Link
            href="/offers"
            className="inline-flex items-center justify-center px-3.5 py-1 text-xs font-bold bg-[#E11D48] hover:bg-rose-600 text-white rounded-full transition-all duration-150 shadow-xs active:scale-95 mx-1 whitespace-nowrap"
          >
            Offers
          </Link>

          {/* Contact Us */}
          <Link
            href="/contact"
            className={`px-2.5 py-1.5 text-[13px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              pathname === '/contact'
                ? 'text-white bg-white/15 font-bold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right Action Icons & Mobile Hamburger */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <div className="hidden sm:block">
            <NotificationIcon tone="light" />
          </div>
          <div className="hidden sm:block">
            <ProfileMenu />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="h-10 w-10 cursor-pointer rounded-full border-white/20 bg-white/10 p-0 text-white hover:bg-white/15 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-[#091535] flex flex-col animate-in fade-in duration-150 text-white">
          {/* Mobile Menu Top Header Bar */}
          <div className="h-[4.5rem] px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0B1E4B]">
            <LiveCalicutLogo tone="light" />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Menu Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
            {/* Quick Primary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/live-updates"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Live Updates
              </Link>
              <Link
                href="/events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Events
              </Link>
              <Link
                href="/offers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 bg-[#E11D48] hover:bg-rose-600 rounded-xl text-xs font-bold text-white transition-colors shadow-xs"
              >
                Offers
              </Link>
              <Link
                href="/merchant"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Advertise
              </Link>
            </div>

            {/* User Account Card / Sign In (Mobile) */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-xs">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                        {profile?.avatar_url || profile?.avatar ? (
                          <img
                            src={profile.avatar_url || profile.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {profile?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-white/60 truncate">{user.email}</p>
                      </div>
                    </div>
                    {highestRole !== 'User' && <RoleBadge roleName={highestRole} />}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold text-white"
                    >
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>My Profile</span>
                    </Link>
                    {isStaff ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMobileSignOut}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-rose-500/20 rounded-xl text-xs font-semibold text-rose-300"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-white">Welcome to LiveCalicut</p>
                    <p className="text-xs text-white/60">Sign in to list &amp; manage</p>
                  </div>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Explore Mega Menu Groups on Mobile */}
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-white tracking-tight px-1">Explore Mega Menu</h3>
              {MEGA_MENU_GROUPS.map((group) => (
                <div key={group.title} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2.5">
                  <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                    {group.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center py-1.5 text-xs font-medium text-slate-300 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
