'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { SITE_WHATSAPP_DISPLAY, siteWhatsAppHref } from '@/config/constants';

const DISMISS_KEY = 'lc-announcement-dismissed';

const NOTICES = [
  {
    title: 'Malabar Literature Festival',
    detail: 'Passes are live',
    href: '/events',
    cta: 'View events',
  },
  {
    title: 'Cyberpark job fair',
    detail: 'Registration is open',
    href: '/jobs',
    cta: 'See jobs',
  },
  {
    title: 'List your business',
    detail: 'Free storefront in Kozhikode',
    href: '/merchant',
    cta: 'Get started',
  },
  {
    title: 'City desk',
    detail: `WhatsApp ${SITE_WHATSAPP_DISPLAY}`,
    href: siteWhatsAppHref('Hi LiveCalicut, I saw the city desk notice'),
    cta: 'Message',
    external: true,
  },
] as const;

function NoticeLink({
  item,
  tabIndex,
}: {
  item: (typeof NOTICES)[number];
  tabIndex?: number;
}) {
  const className =
    'inline-flex items-center gap-1 font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]';
  const label = (
    <>
      {item.cta}
      <ArrowRight className="h-3 w-3" aria-hidden />
    </>
  );

  if ('external' in item && item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" tabIndex={tabIndex} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link href={item.href} tabIndex={tabIndex} className={className}>
      {label}
    </Link>
  );
}

function NoticeTrack({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex items-center" aria-hidden={hidden || undefined}>
      {NOTICES.map((item) => (
        <p key={item.title} className="flex shrink-0 items-center gap-2 px-7 text-[13px] whitespace-nowrap text-[#6B7280]">
          <span className="font-semibold text-[#111827]">{item.title}</span>
          <span className="text-[#D1D5DB]" aria-hidden>
            ·
          </span>
          <span>{item.detail}</span>
          <NoticeLink item={item} tabIndex={hidden ? -1 : undefined} />
        </p>
      ))}
    </div>
  );
}

export const AnnouncementBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') setVisible(false);
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--lc-announce', visible ? '2.5rem' : '0px');
    return () => root.style.removeProperty('--lc-announce');
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="City announcements"
      className="relative z-30 flex h-10 w-full items-center border-b border-[#E5E7EB] bg-white"
    >
      <div className="hidden h-full shrink-0 items-center gap-2 border-r border-[#E5E7EB] pr-3 pl-4 sm:flex sm:pl-6">
        <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" aria-hidden />
        <span className="text-[11px] font-bold tracking-[0.14em] text-[#111827] uppercase">Kozhikode</span>
      </div>

      <div className="lc-marquee-wrap relative h-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_16px,#000_calc(100%-20px),transparent)]">
        <div className="lc-marquee flex h-full w-max items-center">
          <NoticeTrack />
          <NoticeTrack hidden />
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="flex h-full w-10 shrink-0 items-center justify-center border-l border-[#E5E7EB] text-[#9CA3AF] transition hover:bg-[#F9FAFB] hover:text-[#111827]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
