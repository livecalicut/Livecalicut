import React from 'react';
import Link from 'next/link';

interface LiveCalicutLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export const LiveCalicutLogo: React.FC<LiveCalicutLogoProps> = ({
  className = '',
  showSubtitle = true,
}) => {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative flex flex-col justify-center space-y-1.5">
        {/* Official LiveCalicut SVG/Image Logo */}
        <img
          src="/images/logo.png"
          alt="LiveCalicut.com"
          className="h-6 sm:h-7 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
        />
        {showSubtitle && (
          <span className="text-[8.5px] uppercase tracking-[0.2em] font-extrabold text-[#2563EB] font-sans leading-none">
            Digital Operating System
          </span>
        )}
      </div>
    </Link>
  );
};
