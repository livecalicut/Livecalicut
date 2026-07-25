'use client';

import { usePathname } from 'next/navigation';

export type Crumb = { label: string; href?: string };

/**
 * Segments whose auto-generated title would read poorly or differ from the
 * label used in the sidebar.
 */
const LABEL_OVERRIDES: Record<string, string> = {
  admin: 'Admin',
  merchant: 'Merchant',
  cms: 'Landing Page CMS',
  'audit-logs': 'Audit Trail Logs',
  businesses: 'Commercial Outlets',
  jobs: 'Jobs',
  marketplace: 'Classifieds Market',
  properties: 'Real Estate',
  news: 'News & Editorial',
  events: 'Events',
  tourism: 'Tourism & Places',
  categories: 'Categories',
  cities: 'Cities & Wards',
  locations: 'Local Areas',
  users: 'Users & Roles',
  reports: 'Moderation Flags',
  settings: 'Settings',
  leads: 'Customer Leads',
  reviews: 'Customer Reviews',
  subscription: 'Subscription Plan',
  offers: 'Offers & Deals',
  profile: 'Business Profile',
  analytics: 'Analytics',
  billing: 'Billing & Payments',
  create: 'Create',
};

function toTitleCase(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Derives dashboard breadcrumbs from the current URL so individual pages no
 * longer have to hand-maintain their own trail.
 */
export function useBreadcrumbs(rootLabel: string): Crumb[] {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) {
    return [{ label: rootLabel }];
  }

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = LABEL_OVERRIDES[segment] ?? toTitleCase(decodeURIComponent(segment));

    return isLast ? { label } : { label, href };
  });
}
