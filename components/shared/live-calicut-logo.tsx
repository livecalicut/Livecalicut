import React from 'react';
import Link from 'next/link';

interface LiveCalicutLogoProps {
  className?: string;
  showSubtitle?: boolean;
  tone?: 'default' | 'light';
}

export const LiveCalicutLogo: React.FC<LiveCalicutLogoProps> = ({
  className = '',
  showSubtitle = true,
  tone = 'default',
}) => {
  const light = tone === 'light';

  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-sm font-extrabold text-white shadow-sm">
        L
      </span>
      <span className="flex flex-col justify-center leading-none">
        <span className={`text-[15px] font-extrabold tracking-tight sm:text-base ${light ? 'text-white' : 'text-[#111827]'}`}>
          LiveCalicut
        </span>
        {showSubtitle && (
          <span className={`mt-1 hidden text-[10px] font-medium sm:block ${light ? 'text-sky-200' : 'max-w-[15.5rem] truncate text-slate-500'}`}>
            {light ? 'Everything Kozhikode' : 'Everything Kozhikode. Connected in One Place.'}
          </span>
        )}
      </span>
    </Link>
  );
};
