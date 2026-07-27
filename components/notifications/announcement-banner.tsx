'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

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
      className="w-full border-b border-[#E5E7EB]/80 bg-white/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-5 py-2 sm:px-10 lg:px-20">
        <p className="min-w-0 truncate font-sans text-[12px] text-[#6B7280] sm:text-[13px]">
          <span className="font-semibold text-[#111827]">Malabar Literature Festival</span>
          <span className="mx-2 text-[#D1D5DB]" aria-hidden>
            ·
          </span>
          <span>Passes are live</span>
          <Link
            href="/events"
            className="ml-2 inline-flex items-center gap-0.5 font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
          >
            View events
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded-lg p-1.5 text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
