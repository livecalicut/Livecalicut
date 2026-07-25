'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Shield,
  Store,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { RoleBadge } from '@/components/auth/role-badge';
import { useBreadcrumbs } from '@/components/dashboard/use-breadcrumbs';

type Notification = {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  is_read?: boolean;
  created_at?: string;
};

interface DashboardHeaderProps {
  variant: 'admin' | 'merchant';
  drawerOpen: boolean;
  onToggleDrawer: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  variant,
  drawerOpen,
  onToggleDrawer,
}) => {
  const isAdmin = variant === 'admin';
  const { profile, roleName, signOut } = useAuthStore();
  const breadcrumbs = useBreadcrumbs(isAdmin ? 'Admin' : 'Merchant');
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifError, setNotifError] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('request failed'))))
      .then((json) => {
        if (!cancelled) setNotifications(Array.isArray(json.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setNotifError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Dismiss the notification popover on outside click or Escape.
  useEffect(() => {
    if (!isNotifOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNotifOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isNotifOpen]);

  // Cmd/Ctrl+K focuses search, matching the placeholder's promise.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const BrandIcon = isAdmin ? Shield : Store;

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between gap-3 border-b border-[#E5E7EB] bg-white/95 px-4 py-3 shadow-xs backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={drawerOpen}
          aria-controls="dashboard-mobile-nav"
          className="rounded-xl border border-[#E5E7EB] p-2 text-[#111827] transition-colors hover:bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none lg:hidden"
        >
          {drawerOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 text-xs font-semibold text-[#6B7280]"
        >
          <BrandIcon className="hidden h-4 w-4 shrink-0 text-[#2563EB] sm:block" />
          <ol className="flex min-w-0 items-center gap-2">
            {breadcrumbs.map((crumb, idx) => (
              <li key={`${crumb.label}-${idx}`} className="flex min-w-0 items-center gap-2">
                {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="truncate transition-colors hover:text-[#2563EB]"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="truncate font-bold text-[#111827]">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <form onSubmit={handleSearch} role="search" className="relative hidden w-64 md:block xl:w-72">
          <label htmlFor="dashboard-search" className="sr-only">
            Search the platform
          </label>
          <Search className="pointer-events-none absolute top-2.5 left-3.5 h-4 w-4 text-[#6B7280]" />
          <input
            id="dashboard-search"
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isAdmin ? 'Search users, outlets, jobs (⌘K)' : 'Search leads, listings (⌘K)'
            }
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-1.5 pr-8 pl-9 text-xs text-[#111827] transition-all placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 focus-visible:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute top-2.5 right-2.5 text-[#6B7280] hover:text-[#111827]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>

        {!isAdmin && (
          <Link
            href="/business"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB] transition-colors hover:bg-blue-100 sm:inline-flex"
          >
            <span>Live Storefront</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((open) => !open)}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={isNotifOpen}
            className="relative rounded-xl border border-[#E5E7EB] p-2 text-[#111827] transition-colors hover:bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="animate-fade-in-up absolute right-0 z-50 mt-2 w-80 space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <h2 className="font-sans text-xs font-extrabold tracking-wider text-[#111827] uppercase">
                  {isAdmin ? 'System Alerts' : 'Leads & Inquiries'}
                </h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {unreadCount} Unread
                </span>
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto text-xs">
                {notifError ? (
                  <p className="p-4 text-center text-[#6B7280]">Could not load notifications.</p>
                ) : notifications.length === 0 ? (
                  <p className="p-4 text-center text-[#6B7280]">No new alerts.</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className="space-y-1 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-2.5"
                    >
                      <p className="font-bold text-[#111827]">{n.title ?? 'Notification'}</p>
                      {(n.message ?? n.body) && (
                        <p className="text-[11px] leading-snug text-[#6B7280]">
                          {n.message ?? n.body}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Link
                href="/notifications"
                className="block pt-1 text-center text-xs font-bold text-[#2563EB] hover:underline"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-[#E5E7EB] pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-xs">
            {profile?.full_name?.charAt(0)?.toUpperCase() || (isAdmin ? 'A' : 'M')}
          </div>
          <div className="hidden text-left lg:block">
            <p className="font-sans text-xs leading-none font-bold text-[#111827]">
              {profile?.full_name || (isAdmin ? 'Admin Console' : 'Merchant Console')}
            </p>
            <div className="mt-0.5">
              <RoleBadge roleName={roleName} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="ml-1 rounded-xl p-2 text-[#6B7280] transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
