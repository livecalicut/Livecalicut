'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
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
  icon: any;
  allowedRoles: UserRole[];
}

interface NavGroup {
  group: string;
  allowedRoles: UserRole[];
  items: NavItem[];
}

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { hasRole, roleName } = useAuthStore();
  const ref = useRef<HTMLElement>(null);

  // Staggered entrance for the nav items, once per mount. Because the sidebar
  // now lives in the layout this plays on first load only, not on navigation.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('[data-nav-item]', {
        opacity: 0,
        x: -12,
        duration: 0.35,
        stagger: 0.02,
        ease: 'liveEase',
      });
    },
    { scope: ref }
  );

  const navGroups: NavGroup[] = [
    {
      group: 'OVERVIEW',
      allowedRoles: ['Super Admin', 'City Admin', 'Moderator'],
      items: [
        { label: 'Control Center', href: '/admin', icon: LayoutDashboard, allowedRoles: ['Super Admin', 'City Admin', 'Moderator'] },
        { label: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3, allowedRoles: ['Super Admin', 'City Admin'] },
        { label: 'Audit Trail Logs', href: '/admin/audit-logs', icon: ShieldCheck, allowedRoles: ['Super Admin'] },
      ],
    },
    {
      group: 'ECOSYSTEM MANAGEMENT',
      allowedRoles: ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator', 'Merchant'],
      items: [
        { label: 'Users & Roles', href: '/admin/users', icon: Users, allowedRoles: ['Super Admin', 'City Admin'] },
        { label: 'Commercial Outlets', href: '/admin/businesses', icon: Store, allowedRoles: ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator'] },
        { label: 'Cyberpark Jobs', href: '/admin/jobs', icon: Briefcase, allowedRoles: ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator', 'Merchant'] },
        { label: 'Classifieds Market', href: '/admin/marketplace', icon: ShoppingBag, allowedRoles: ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator', 'Merchant'] },
        { label: 'Real Estate Listings', href: '/admin/properties', icon: Building, allowedRoles: ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator', 'Merchant'] },
      ],
    },
    {
      group: 'CITY CONTENT & MEDIA',
      allowedRoles: ['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive'],
      items: [
        { label: 'Landing Page CMS', href: '/admin/cms', icon: LayoutTemplate, allowedRoles: ['Super Admin', 'City Admin'] },
        { label: 'News & Editorial', href: '/admin/news', icon: Newspaper, allowedRoles: ['Super Admin', 'City Admin', 'Moderator'] },
        { label: 'Cultural Events', href: '/admin/events', icon: Calendar, allowedRoles: ['Super Admin', 'City Admin', 'Moderator'] },
        { label: 'Tourism & Places', href: '/admin/tourism', icon: Compass, allowedRoles: ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator'] },
        { label: 'Categories Taxonomy', href: '/admin/categories', icon: FolderTree, allowedRoles: ['Super Admin', 'City Admin'] },
        { label: 'Cities & Wards', href: '/admin/cities', icon: MapPin, allowedRoles: ['Super Admin', 'City Admin'] },
        { label: 'Local Areas', href: '/admin/locations', icon: MapPin, allowedRoles: ['Super Admin', 'City Admin'] },
      ],
    },
    {
      group: 'GOVERNANCE & FINANCE',
      allowedRoles: ['Super Admin', 'City Admin'],
      items: [
        { label: 'Moderation Flags', href: '/admin/reports', icon: Flag, allowedRoles: ['Super Admin', 'City Admin', 'Moderator'] },
        { label: 'Billing & Payments', href: '/admin/billing', icon: CreditCard, allowedRoles: ['Super Admin'] },
        { label: 'System Settings', href: '/admin/settings', icon: Settings, allowedRoles: ['Super Admin'] },
      ],
    },
  ];

  return (
    <aside
      ref={ref}
      aria-label="Admin navigation"
      className="flex min-h-screen w-64 shrink-0 flex-col justify-between space-y-6 border-r border-[#E5E7EB] bg-white p-4 shadow-xs"
    >
      <div className="space-y-6">
        {/* Admin Brand Logo Header */}
        <div className="border-b border-[#E5E7EB] px-2 py-2 pb-4">
          <div className="flex items-center gap-2">
            <LiveCalicutLogo showSubtitle={false} />
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-sans text-[10px] font-extrabold tracking-wide text-[#2563EB] uppercase">
            <ShieldCheck className="h-3 w-3 text-[#2563EB]" />
            <span>Admin OS • {roleName}</span>
          </div>
        </div>

        {/* Grouped Sidebar Navigation */}
        <div className="space-y-6">
          {navGroups.map((group) => {
            if (!hasRole(group.allowedRoles)) return null;

            const visibleItems = group.items.filter((item) => hasRole(item.allowedRoles));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group} className="space-y-1.5">
                <h5
                  id={`nav-group-${group.group.replace(/\s+/g, '-').toLowerCase()}`}
                  className="px-3 font-sans text-[10px] font-extrabold tracking-widest text-[#9CA3AF] uppercase"
                >
                  {group.group}
                </h5>
                <nav
                  aria-labelledby={`nav-group-${group.group.replace(/\s+/g, '-').toLowerCase()}`}
                  className="space-y-0.5"
                >
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        data-nav-item
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-1 focus-visible:outline-none ${
                          isActive
                            ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                            : 'text-[#4B5563] hover:bg-[#F8FAFC] hover:text-[#111827]'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exit Control Center Shortcut */}
      <div className="border-t border-[#E5E7EB] pt-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#6B7280] transition-all hover:bg-[#F8FAFC] hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
};
