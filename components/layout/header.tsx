'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
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
import { LocationSelect } from '@/components/shared/location-select';
import { ALL_LOCATIONS_LABEL } from '@/config/constants';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <header className={`sticky top-0 z-40 w-full bg-[#0B1E4B] text-white ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-3 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-3">
            <LiveCalicutLogo tone="light" />
          </div>

          <div className="hidden shrink-0 xl:block">
            <LocationSelect
              value={headerArea}
              onChange={(name) => {
                setHeaderArea(name);
                if (name && name !== ALL_LOCATIONS_LABEL) {
                  router.push(`/search?area=${encodeURIComponent(name)}`);
                }
              }}
              tone="nav"
              allLabel="Kozhikode"
            />
          </div>

          <nav className="mx-1 hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navLinks.map((item) => {
              const path = item.href.split('?')[0];
              const isActive = pathname === path && !item.href.includes('?');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 px-1.5 py-1.5 text-[12px] whitespace-nowrap transition-colors xl:px-2 xl:text-[13px] ${
                    isActive ? 'font-semibold text-white' : 'font-medium text-white/75 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

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

