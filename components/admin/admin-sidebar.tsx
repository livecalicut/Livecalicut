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
    <aside className="w-64 shrink-0 bg-white border-r border-[#E5E7EB] min-h-screen p-4 space-y-6 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        {/* Admin Brand Logo Header */}
        <div className="px-2 py-2 border-b border-[#E5E7EB] pb-4">
          <div className="flex items-center gap-2">
            <LiveCalicutLogo showSubtitle={false} />
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-extrabold text-[#2563EB] tracking-wide uppercase font-sans">
            <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
            <span>Admin OS • {roleName}</span>
          </div>
        </div>

        {/* Grouped Sidebar Navigation */}
        <div className="space-y-6">
          {navGroups.map((group) => {
            if (!hasRole(group.allowedRoles)) return null;

            return (
              <div key={group.group} className="space-y-1.5">
                <h5 className="px-3 text-[10px] font-extrabold text-[#9CA3AF] tracking-widest uppercase font-sans">
                  {group.group}
                </h5>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    if (!hasRole(item.allowedRoles)) return null;

                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                            : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
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
      <div className="pt-4 border-t border-[#E5E7EB]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-[#6B7280] hover:text-[#111827] font-bold hover:bg-[#F8FAFC] rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#2563EB]" />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
};
