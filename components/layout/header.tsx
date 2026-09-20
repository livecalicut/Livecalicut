'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Search,
  Compass,
  Utensils,
  Camera,
  Palmtree,
  Newspaper,
  Menu,
  X,
  User,
  LogOut,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { RoleBadge } from '@/components/auth/role-badge';
import { ProfileMenu } from './profile-menu';
import { NotificationIcon } from './notification-icon';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };
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

  const navLinks = [
    { href: '/business', label: 'Businesses' },
    { href: '/marketplace', label: 'Classified' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/properties', label: 'Properties' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/tourism', label: 'Tourism' },
    { href: '/business?category=Services', label: 'Services' },
    { href: '/events', label: 'Events' },
    { href: '/merchant', label: 'Advertise' },
  ];

  const exploreSublinks = [
    { href: '/tourism', label: 'Tourist Places', icon: Camera, desc: 'Lighthouse, Kappad, Beypore' },
    { href: '/restaurants', label: 'Food & Dining', icon: Utensils, desc: 'Malabar biryani, sweets & cafes' },
    { href: '/places?type=beaches', label: 'Beaches & Parks', icon: Palmtree, desc: 'Calicut Beach, South Beach' },
    { href: '/news', label: 'Local Stories & Culture', icon: Newspaper, desc: 'Kozhikode heritage & news' },
  ];

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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs transition-all">
        {/* Top Header Bar */}
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <LiveCalicutLogo />
          </div>

          {/* Quick Search Bar (Desktop / Tablet) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <form
              action="/search"
              method="GET"
              className="relative w-full flex items-center"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses, jobs, properties, items..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#2563EB] rounded-xl outline-none transition-all placeholder:text-slate-400 font-sans"
              />
            </form>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop / Tablet Search, Notifications & Profile */}
            <div className="hidden sm:block">
              <NotificationIcon />
            </div>

            <div className="hidden sm:block">
              <ProfileMenu />
            </div>

            {/* Mobile Menu Toggle (Only element visible on mobile right side) */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="lg:hidden w-10 h-10 p-0 rounded-xl cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#2563EB]" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Secondary Category Navigation Ribbon (Desktop) */}
        <div className="border-t border-slate-100 bg-slate-50/70 hidden sm:block">
          <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-10 flex items-center gap-1 overflow-x-auto no-scrollbar font-sans text-xs">
            {/* Explore Kozhikode Dropdown */}
            <div className="relative shrink-0" ref={exploreRef}>
              <button
                type="button"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isExploreOpen || pathname.startsWith('/explore')
                    ? 'text-[#2563EB] bg-blue-100/60'
                    : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-200/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Explore Kozhikode</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExploreOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {exploreSublinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 group-hover:text-[#2563EB]">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

            {/* Core Modules Links */}
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#2563EB] bg-blue-100/60 font-bold'
                      : 'text-slate-700 hover:text-[#2563EB] hover:bg-slate-200/60'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Full-Screen Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col animate-in fade-in duration-150">
            {/* Mobile Menu Top Header Bar */}
            <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <LiveCalicutLogo />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95 transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-slate-800 stroke-[2.5]" />
              </button>
            </div>

            {/* Mobile Menu Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
              {/* User Account Card / Sign In (Mobile) */}
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl shadow-xs">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden shadow-xs">
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
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {profile?.full_name || user.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {highestRole !== 'User' && (
                        <RoleBadge roleName={highestRole} />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/80">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs"
                      >
                        <User className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span>My Profile</span>
                      </Link>
                      {isStaff ? (
                        <Link
                          href="/admin"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-800"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          <span>Admin Portal</span>
                        </Link>
                      ) : isMerchantOnly ? (
                        <Link
                          href="/merchant"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-[#2563EB]"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>Merchant Hub</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={handleMobileSignOut}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold text-rose-600 shadow-xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>

                    {isStaff && (
                      <button
                        type="button"
                        onClick={handleMobileSignOut}
                        className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-medium text-rose-600 hover:underline"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Welcome to LiveCalicut</p>
                      <p className="text-xs text-slate-500">Sign in to post and manage your listings</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-sm transition-all"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Explore Kozhikode Sublinks */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                  Explore Calicut
                </p>
                <div className="space-y-1">
                  {exploreSublinks.map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#2563EB] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{sub.label}</p>
                          <p className="text-[11px] text-slate-500">{sub.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Core Directory & Services Links */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                  Directories & Services
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-3.5 py-3 rounded-xl text-xs font-semibold transition-all border ${
                          isActive
                            ? 'bg-blue-50 border-blue-200 text-[#2563EB] font-bold'
                            : 'bg-slate-50/80 border-slate-200/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
    </header>
  );
};

