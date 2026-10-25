'use client';

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

export const NotificationIcon: React.FC<{ tone?: 'default' | 'light' }> = ({ tone = 'default' }) => {
  return (
    <Link
      href="/notifications"
      className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition ${
        tone === 'light' ? 'text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100 hover:text-[#2563EB]'
      }`}
      aria-label="View notifications"
    >
      <Bell className="h-4 w-4" />
    </Link>
  );
};
