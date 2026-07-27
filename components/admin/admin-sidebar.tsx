'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, UserRole } from '@/src/store/useAuthStore';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import {
  LayoutDashboard,
  Users,
  Store,
  Newspaper,
  Calendar,
  Briefcase,
  ShoppingBag,
  Building,
  Flag,
  FolderTree,
  MapPin,
  Settings,
  ShieldCheck,
  ArrowLeft,
  CreditCard,
  BarChart3,
  LayoutTemplate,
  Compass,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

interface NavGroup {
  label: string;
  roles: UserRole[];
  items: NavItem[];
}

const STAFF: UserRole[] = ['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive'];
const ADMINS: UserRole[] = ['Super Admin', 'City Admin'];
const SUPER: UserRole[] = ['Super Admin'];

const NAV: NavGroup[] = [
  {
    label: 'Overview',
    roles: STAFF,
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: STAFF },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ADMINS },
      { label: 'Audit logs', href: '/admin/audit-logs', icon: ShieldCheck, roles: SUPER },
    ],
  },
  {
    label: 'Listings',
    roles: STAFF,
    items: [
      { label: 'Users', href: '/admin/users', icon: Users, roles: ADMINS },
      { label: 'Businesses', href: '/admin/businesses', icon: Store, roles: STAFF },
      { label: 'Jobs', href: '/admin/jobs', icon: Briefcase, roles: STAFF },
      { label: 'Marketplace', href: '/admin/marketplace', icon: ShoppingBag, roles: STAFF },
      { label: 'Properties', href: '/admin/properties', icon: Building, roles: STAFF },
    ],
  },
  {
    label: 'Content',
    roles: STAFF,
    items: [
      { label: 'CMS', href: '/admin/cms', icon: LayoutTemplate, roles: ADMINS },
      { label: 'News', href: '/admin/news', icon: Newspaper, roles: ['Super Admin', 'City Admin', 'Moderator'] },
      { label: 'Events', href: '/admin/events', icon: Calendar, roles: ['Super Admin', 'City Admin', 'Moderator'] },
      { label: 'Tourism', href: '/admin/tourism', icon: Compass, roles: STAFF },
      { label: 'Categories', href: '/admin/categories', icon: FolderTree, roles: ADMINS },
      { label: 'Cities', href: '/admin/cities', icon: MapPin, roles: SUPER },
      { label: 'Areas', href: '/admin/locations', icon: MapPin, roles: SUPER },
    ],
  },
  {
    label: 'System',
    roles: ADMINS,
    items: [
      { label: 'Moderation', href: '/admin/reports', icon: Flag, roles: ['Super Admin', 'City Admin', 'Moderator'] },
      { label: 'Billing', href: '/admin/billing', icon: CreditCard, roles: SUPER },
      { label: 'Settings', href: '/admin/settings', icon: Settings, roles: SUPER },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { hasRole, roleName } = useAuthStore();

  return (
    <aside
      aria-label="Admin navigation"
      className="flex h-screen w-60 shrink-0 flex-col border-r border-[#E5E7EB] bg-white"
    >
      <div className="shrink-0 border-b border-[#E5E7EB] px-4 py-4">
        <LiveCalicutLogo showSubtitle={false} />
        <p className="mt-2 text-[10px] font-bold tracking-wide text-[#6B7280] uppercase">
          Admin · {roleName}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV.map((group) => {
          if (!hasRole(group.roles)) return null;
          const items = group.items.filter((item) => hasRole(item.roles));
          if (items.length === 0) return null;

          return (
            <div key={group.label} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold tracking-wider text-[#9CA3AF] uppercase">
                {group.label}
              </p>
              <nav className="space-y-0.5" aria-label={group.label}>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#2563EB] text-white'
                          : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-[#E5E7EB] p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
        >
          <ArrowLeft className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          Exit to site
        </Link>
      </div>
    </aside>
  );
};
