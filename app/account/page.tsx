'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuthStore } from '@/src/store/useAuthStore';
import {
  User,
  Briefcase,
  Bell,
  Heart,
  ShoppingBag,
  Building2,
  CreditCard,
  Settings,
  Package,
  ChevronRight,
  ShieldCheck,
  Store,
} from 'lucide-react';

const LINKS = [
  {
    href: '/profile',
    label: 'My profile',
    description: 'Name, phone, avatar, and city details',
    icon: User,
  },
  {
    href: '/applications',
    label: 'Job applications',
    description: 'Track resumes you sent to employers',
    icon: Briefcase,
  },
  {
    href: '/notifications',
    label: 'Notifications',
    description: 'Alerts, updates, and announcements',
    icon: Bell,
  },
  {
    href: '/marketplace/saved',
    label: 'Saved marketplace',
    description: 'Items you bookmarked to buy later',
    icon: Heart,
  },
  {
    href: '/properties/saved',
    label: 'Saved properties',
    description: 'Homes and rentals you shortlisted',
    icon: Building2,
  },
  {
    href: '/explore/saved',
    label: 'Saved explore',
    description: 'Places and experiences you liked',
    icon: Package,
  },
  {
    href: '/marketplace/my-listings',
    label: 'My marketplace listings',
    description: 'Items you listed for sale',
    icon: ShoppingBag,
  },
  {
    href: '/properties/my-properties',
    label: 'My properties',
    description: 'Property ads you published',
    icon: Building2,
  },
  {
    href: '/subscriptions',
    label: 'Plans & payments',
    description: 'Subscription status and billing history',
    icon: CreditCard,
  },
  {
    href: '/settings',
    label: 'Account settings',
    description: 'Password, preferences, and privacy',
    icon: Settings,
  },
];

function AccountHubInner() {
  const { profile, roleName, hasRole } = useAuthStore();
  const isStaff = hasRole(['Super Admin', 'City Admin', 'Moderator', 'Marketing Executive']);
  const isMerchant = hasRole('Merchant') || hasRole(['City Admin', 'Super Admin']);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">My account</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">
          {profile?.full_name || 'Your account'}
        </h1>
        <p className="text-sm text-[#6B7280]">
          Orders, applications, saved items, and notifications — your personal LiveCalicut section.
        </p>
        <p className="text-xs font-semibold text-[#9CA3AF]">Signed in as {roleName}</p>
      </header>

      {(isStaff || isMerchant) && (
        <div className="flex flex-wrap gap-2">
          {isStaff && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-700"
            >
              <ShieldCheck className="h-4 w-4" /> Admin console
            </Link>
          )}
          {isMerchant && (
            <Link
              href="/merchant"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800"
            >
              <Store className="h-4 w-4" /> Merchant dashboard
            </Link>
          )}
        </div>
      )}

      <nav className="divide-y divide-[#E5E7EB] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white" aria-label="Account sections">
        {LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[#F8FAFC]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-[#111827]">{item.label}</span>
                <span className="block text-xs text-[#6B7280]">{item.description}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountHubInner />
    </ProtectedRoute>
  );
}
