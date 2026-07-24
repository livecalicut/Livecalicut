'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, X, ArrowRight } from 'lucide-react';

const DISMISS_KEY = 'lc-announcement-dismissed';

export const AnnouncementBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) !== '1') {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

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
      aria-label="City announcement"
      className="relative w-full border-b border-[#E5E7EB] bg-[#F8FAFC]"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#2563EB]"
        aria-hidden
      />
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-2.5 sm:px-10 lg:px-20">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] sm:inline-flex">
            <Megaphone className="h-3.5 w-3.5" />
          </span>
          <p className="truncate text-[12px] leading-snug text-[#374151] sm:text-[13px]">
            <span className="font-semibold text-[#111827]">City update</span>
            <span className="mx-1.5 text-[#D1D5DB]" aria-hidden>
              ·
            </span>
            <span className="font-medium">Malabar Literature Festival passes are live</span>
            <Link
              href="/events"
              className="ml-2 inline-flex items-center gap-0.5 font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
            >
              View events
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded-lg p-1.5 text-[#9CA3AF] transition hover:bg-[#E5E7EB]/70 hover:text-[#111827]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
