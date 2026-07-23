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
  Sparkles,
  Tag,
  Hotel,
  Utensils,
  HeartPulse,
  Shirt,
  Car,
  GraduationCap,
  Wrench,
  Loader2,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Module definitions: each category slug → which sidebar items appear
// ─────────────────────────────────────────────────────────────────────────────
type NavItem = { label: string; href: string; icon: React.ElementType };

const ALWAYS_VISIBLE: NavItem[] = [
  { label: 'Dashboard', href: '/merchant', icon: LayoutDashboard },
  { label: 'Business Profile', href: '/merchant/profile', icon: Store },
  { label: 'Store Analytics', href: '/merchant/analytics', icon: BarChart3 },
  { label: 'Customer Leads', href: '/merchant/leads', icon: Users },
];

const ALWAYS_BOTTOM: NavItem[] = [
  { label: 'Customer Reviews', href: '/merchant/reviews', icon: MessageSquare },
  { label: 'Subscription Plan', href: '/merchant/subscription', icon: CreditCard },
  { label: 'Merchant Settings', href: '/merchant/settings', icon: Settings },
];

/**
 * Map from keyword patterns (matched against business category name) → extra modules
 * A business owner gets a module if their category name includes any of the keywords.
 */
const CATEGORY_MODULE_MAP: { keywords: string[]; items: NavItem[]; groupLabel: string }[] = [
  {
    keywords: ['job', 'hiring', 'hr', 'recruit', 'manpower', 'staffing', 'placement', 'employment'],
    groupLabel: 'HIRING & JOBS',
    items: [
      { label: 'Post Job Vacancies', href: '/merchant/jobs', icon: Briefcase },
    ],
  },
  {
    keywords: ['hotel', 'hostel', 'stay', 'lodge', 'resort', 'accommodation', 'room', 'service apartment'],
    groupLabel: 'HOSPITALITY',
    items: [
      { label: 'Accommodation Listings', href: '/merchant/properties', icon: Hotel },
      { label: 'Events & Packages', href: '/merchant/events', icon: Calendar },
    ],
  },
  {
    keywords: ['restaurant', 'food', 'cafe', 'catering', 'bakery', 'canteen', 'hotel', 'dining', 'kitchen'],
    groupLabel: 'FOOD & DINING',
    items: [
      { label: 'Daily Offers & Deals', href: '/merchant/offers', icon: Tag },
      { label: 'Events & Promotions', href: '/merchant/events', icon: Calendar },
    ],
  },
  {
    keywords: ['real estate', 'property', 'land', 'flat', 'apartment', 'villa', 'plot', 'rent', 'lease'],
    groupLabel: 'REAL ESTATE',
    items: [
      { label: 'Property Listings', href: '/merchant/properties', icon: Building },
    ],
  },
  {
    keywords: ['shop', 'retail', 'store', 'mart', 'supermarket', 'grocery', 'textile', 'fashion', 'clothing', 'garment'],
    groupLabel: 'RETAIL',
    items: [
      { label: 'Classified Items & Sales', href: '/merchant/marketplace', icon: ShoppingBag },
      { label: 'Special Offers', href: '/merchant/offers', icon: Tag },
    ],
  },
  {
    keywords: ['health', 'hospital', 'clinic', 'doctor', 'medical', 'pharmacy', 'dental', 'ayurveda', 'lab', 'diagnostic'],
    groupLabel: 'HEALTHCARE',
    items: [
      { label: 'Events & Health Camps', href: '/merchant/events', icon: Calendar },
    ],
  },
  {
    keywords: ['education', 'school', 'college', 'coaching', 'academy', 'institute', 'training', 'tuition'],
    groupLabel: 'EDUCATION',
    items: [
      { label: 'Events & Open Days', href: '/merchant/events', icon: Calendar },
      { label: 'Post Faculty Jobs', href: '/merchant/jobs', icon: Briefcase },
    ],
  },
  {
    keywords: ['auto', 'car', 'vehicle', 'bike', 'service', 'mechanic', 'garage', 'spare'],
    groupLabel: 'AUTOMOTIVE',
    items: [
      { label: 'Classified Listings', href: '/merchant/marketplace', icon: ShoppingBag },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────
export const MerchantSidebar: React.FC = () => {
  const pathname = usePathname();
  const [businessCategories, setBusinessCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    fetchOwnerBusinesses();
  }, []);

  const fetchOwnerBusinesses = async () => {
    try {
      const res = await fetch('/api/merchant/me');
      const json = await res.json();
      if (json.businesses && json.businesses.length > 0) {
        // Collect all category names from all registered businesses
        const cats: string[] = [];
        json.businesses.forEach((b: any) => {
          if (b.business_categories?.name) cats.push(b.business_categories.name.toLowerCase());
          if (b.category_name) cats.push(b.category_name.toLowerCase());
        });
        setBusinessCategories(cats);
        setBusinessName(json.businesses[0]?.name || '');
      }
    } catch (err) {
      // Fall back to showing all modules if API fails
      console.error('Failed to load merchant businesses', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute which extra module groups are relevant
  const getRelevantModuleGroups = (): { groupLabel: string; items: NavItem[] }[] => {
    if (businessCategories.length === 0) {
      // No businesses registered — show all modules (admin/staff added someone)
      return CATEGORY_MODULE_MAP.map((m) => ({ groupLabel: m.groupLabel, items: m.items }));
    }

    const groups: { groupLabel: string; items: NavItem[] }[] = [];
    const addedHrefs = new Set<string>();

    CATEGORY_MODULE_MAP.forEach((mapping) => {
      const matched = mapping.keywords.some((kw) =>
        businessCategories.some((cat) => cat.includes(kw))
      );
      if (matched) {
        const uniqueItems = mapping.items.filter((item) => {
          if (addedHrefs.has(item.href)) return false;
          addedHrefs.add(item.href);
          return true;
        });
        if (uniqueItems.length > 0) {
          groups.push({ groupLabel: mapping.groupLabel, items: uniqueItems });
        }
      }
    });

    return groups;
  };

  const relevantGroups = getRelevantModuleGroups();

  const renderLink = (item: NavItem) => {
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
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-[#E5E7EB] min-h-screen p-4 space-y-6 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-2 py-2 border-b border-[#E5E7EB] pb-4">
          <LiveCalicutLogo showSubtitle={false} />
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-extrabold text-emerald-700 tracking-wide uppercase font-sans">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Verified Merchant OS</span>
          </div>
          {businessName && (
            <p className="mt-2 text-[11px] font-bold text-[#6B7280] truncate">{businessName}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 px-3 py-3 text-[#9CA3AF] text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading workspace...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Always visible workspace section */}
            <div className="space-y-1.5">
              <h5 className="px-3 text-[10px] font-extrabold text-[#9CA3AF] tracking-widest uppercase font-sans">
                WORKSPACE
              </h5>
              <nav className="space-y-0.5">
                {ALWAYS_VISIBLE.map(renderLink)}
              </nav>
            </div>

            {/* Dynamic business-type modules */}
            {relevantGroups.length > 0 ? (
              relevantGroups.map((group) => (
                <div key={group.groupLabel} className="space-y-1.5">
                  <h5 className="px-3 text-[10px] font-extrabold text-[#9CA3AF] tracking-widest uppercase font-sans">
                    {group.groupLabel}
                  </h5>
                  <nav className="space-y-0.5">
                    {group.items.map(renderLink)}
                  </nav>
                </div>
              ))
            ) : (
              <div className="px-3 py-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-semibold space-y-1">
                <p className="font-bold">No business registered yet</p>
                <p className="text-[11px] font-normal leading-relaxed">
                  Your modules will appear here once admin approves your business listing.
                </p>
                <Link href="/merchant/profile" className="text-[#2563EB] font-bold text-[11px] hover:underline">
                  Complete Profile →
                </Link>
              </div>
            )}

            {/* Engagement & Billing — always visible */}
            <div className="space-y-1.5">
              <h5 className="px-3 text-[10px] font-extrabold text-[#9CA3AF] tracking-widest uppercase font-sans">
                ENGAGEMENT & BILLING
              </h5>
              <nav className="space-y-0.5">
                {ALWAYS_BOTTOM.map(renderLink)}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Exit to Public Portal */}
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
