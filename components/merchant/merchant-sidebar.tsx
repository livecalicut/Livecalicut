'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';
import {
  LayoutDashboard,
  Store,
  Briefcase,
  ShoppingBag,
  Building,
  Calendar,
  MessageSquare,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ArrowLeft,
  Tag,
  Newspaper,
} from 'lucide-react';

type NavItem = { label: string; href: string; icon: React.ElementType };
type NavGroup = { label: string; items: NavItem[] };

const OVERVIEW: NavGroup = {
  label: 'Overview',
  items: [
    { label: 'Dashboard', href: '/merchant', icon: LayoutDashboard },
    { label: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
    { label: 'Customer leads', href: '/merchant/leads', icon: Users },
    { label: 'Reviews', href: '/merchant/reviews', icon: MessageSquare },
  ],
};

const BUSINESS: NavGroup = {
  label: 'Business',
  items: [{ label: 'Business profile', href: '/merchant/profile', icon: Store }],
};

const ACCOUNT: NavGroup = {
  label: 'Account',
  items: [
    { label: 'Subscription', href: '/merchant/subscription', icon: CreditCard },
    { label: 'Settings', href: '/merchant/settings', icon: Settings },
  ],
};

const LISTING_MODULES = {
  jobs: { label: 'Job vacancies', href: '/merchant/jobs', icon: Briefcase },
  offers: { label: 'Offers & deals', href: '/merchant/offers', icon: Tag },
  events: { label: 'Events', href: '/merchant/events', icon: Calendar },
  properties: { label: 'Properties', href: '/merchant/properties', icon: Building },
  marketplace: { label: 'Marketplace', href: '/merchant/marketplace', icon: ShoppingBag },
  news: { label: 'News & updates', href: '/merchant/news', icon: Newspaper },
} satisfies Record<string, NavItem>;

type ModuleKey = keyof typeof LISTING_MODULES;

/** Business category keywords → listing modules relevant to that trade */
const CATEGORY_MODULES: { keywords: string[]; modules: ModuleKey[] }[] = [
  { keywords: ['job', 'hiring', 'hr', 'recruit', 'manpower', 'staffing', 'placement', 'employment'], modules: ['jobs'] },
  { keywords: ['hotel', 'hostel', 'stay', 'lodge', 'resort', 'accommodation', 'room', 'service apartment'], modules: ['properties', 'events'] },
  { keywords: ['restaurant', 'food', 'cafe', 'catering', 'bakery', 'canteen', 'dining', 'kitchen'], modules: ['offers', 'events'] },
  { keywords: ['real estate', 'property', 'land', 'flat', 'apartment', 'villa', 'plot', 'rent', 'lease'], modules: ['properties'] },
  { keywords: ['shop', 'retail', 'store', 'mart', 'supermarket', 'grocery', 'textile', 'fashion', 'clothing', 'garment'], modules: ['marketplace', 'offers'] },
  { keywords: ['health', 'hospital', 'clinic', 'doctor', 'medical', 'pharmacy', 'dental', 'ayurveda', 'lab', 'diagnostic'], modules: ['events'] },
  { keywords: ['education', 'school', 'college', 'coaching', 'academy', 'institute', 'training', 'tuition'], modules: ['events', 'jobs'] },
  { keywords: ['auto', 'car', 'vehicle', 'bike', 'mechanic', 'garage', 'spare'], modules: ['marketplace'] },
];

/** Every merchant can post jobs and offers; trade-specific modules are added on top */
const DEFAULT_MODULES: ModuleKey[] = ['jobs', 'offers'];

function listingModulesFor(categories: string[]): NavItem[] {
  // No outlet yet (or staff viewing): show every module so nothing is hidden
  if (categories.length === 0) return Object.values(LISTING_MODULES);

  const keys = new Set<ModuleKey>(DEFAULT_MODULES);
  for (const { keywords, modules } of CATEGORY_MODULES) {
    if (keywords.some((kw) => categories.some((cat) => cat.includes(kw)))) {
      modules.forEach((m) => keys.add(m));
    }
  }
  return (Object.keys(LISTING_MODULES) as ModuleKey[]).filter((k) => keys.has(k)).map((k) => LISTING_MODULES[k]);
}

export const MerchantSidebar: React.FC = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<string[]>([]);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/merchant/me')
      .then((res) => (res.ok ? res.json() : { businesses: [] }))
      .then((json) => {
        if (cancelled) return;
        const businesses: any[] = json.businesses ?? [];
        setCategories(
          businesses
            .flatMap((b) => [b.business_categories?.name, b.category_name])
            .filter(Boolean)
            .map((name: string) => name.toLowerCase())
        );
        setBusinessName(businesses[0]?.name ?? '');
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const groups: NavGroup[] = [
    OVERVIEW,
    BUSINESS,
    { label: 'Listings', items: listingModulesFor(categories) },
    ACCOUNT,
  ];

  return (
    <aside
      aria-label="Merchant navigation"
      className="flex h-screen w-60 shrink-0 flex-col border-r border-[#E5E7EB] bg-white"
    >
      <div className="shrink-0 border-b border-[#E5E7EB] px-4 py-4">
        <LiveCalicutLogo showSubtitle={false} size="sm" />
        <p className="mt-2 truncate text-[10px] font-bold tracking-wide text-[#6B7280] uppercase">
          Merchant{businessName ? ` · ${businessName}` : ''}
        </p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {groups.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-2.5 text-[10px] font-bold tracking-wider text-[#9CA3AF] uppercase">{group.label}</p>
            <nav className="space-y-0.5" aria-label={group.label}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/merchant'
                    ? pathname === '/merchant'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors ${
                      isActive ? 'bg-[#2563EB] text-white' : 'text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
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
