'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export const NotificationIcon: React.FC = () => {
  const [unreadCount] = useState(0); // Real notifications coming soon

  return (
    <button
      className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-600 hover:border-cyan-500/30 transition-all cursor-pointer"
      aria-label="View notifications"
    >
      <Bell className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
      )}
    </button>
  );
};
