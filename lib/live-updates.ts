// lib/live-updates.ts
// "Calicut live updates" ticker items shown above the public site header.
// Stored in settings (key 'live_updates') and managed at /admin/live-updates.
import { SITE_WHATSAPP_DISPLAY, siteWhatsAppHref } from '@/config/constants';

export type LiveUpdate = {
  id: string;
  title: string;
  detail: string;
  /** Site path ("/events") or full https URL */
  href: string;
  cta: string;
  active: boolean;
};

export const LIVE_UPDATES_KEY = 'live_updates';
export const MAX_LIVE_UPDATES = 20;

/** Shown until an admin saves their own list */
export const DEFAULT_LIVE_UPDATES: LiveUpdate[] = [
  { id: 'default-1', title: 'Malabar Literature Festival', detail: 'Passes are live', href: '/events', cta: 'View events', active: true },
  { id: 'default-2', title: 'Cyberpark job fair', detail: 'Registration is open', href: '/jobs', cta: 'See jobs', active: true },
  { id: 'default-3', title: 'List your business', detail: 'Free storefront in Calicut', href: '/merchant', cta: 'Get started', active: true },
  {
    id: 'default-4',
    title: 'City desk',
    detail: `WhatsApp ${SITE_WHATSAPP_DISPLAY}`,
    href: siteWhatsAppHref('Hi LiveCalicut, I saw the city desk notice'),
    cta: 'Message',
    active: true,
  },
];

export function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '');

/** Validates one item; returns an error message or the cleaned item. */
export function sanitizeLiveUpdate(raw: Record<string, unknown>): LiveUpdate | string {
  const title = clean(raw.title, 80);
  const detail = clean(raw.detail, 120);
  const href = clean(raw.href, 500);
  const cta = clean(raw.cta, 30) || 'Learn more';
  if (!title) return 'Title is required';
  if (!href) return 'Link is required';
  // Same-site paths or http(s) only: no javascript:, protocol-relative or other schemes
  if (!(href.startsWith('/') && !href.startsWith('//')) && !isExternalHref(href)) {
    return 'Link must start with / (a page on this site) or https://';
  }
  const id = clean(raw.id, 60) || `lu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  return { id, title, detail, href, cta, active: raw.active !== false };
}

/** Reads the stored settings value; null when nothing was ever saved. */
export function parseStoredLiveUpdates(value: unknown): LiveUpdate[] | null {
  const items = (value as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) return null;
  return items
    .map((i) => sanitizeLiveUpdate((i ?? {}) as Record<string, unknown>))
    .filter((i): i is LiveUpdate => typeof i !== 'string');
}
