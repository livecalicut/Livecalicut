'use client';

import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

export const AnnouncementBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#2563EB] text-white py-2.5 px-4 text-xs font-semibold flex items-center justify-between shadow-xs w-full">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-20 flex items-center gap-2 truncate w-full">
        <Megaphone className="w-4 h-4 fill-white animate-bounce shrink-0" />
        <span className="truncate text-[13px] font-sans">
          <strong>Kozhikode Official Announcement:</strong> Malabar Literature Festival passes are now live! Check out City Events.
        </span>
      </div>

      <button onClick={() => setVisible(false)} aria-label="Dismiss banner" className="text-white/80 hover:text-white shrink-0 ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
