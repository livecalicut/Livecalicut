import React from 'react';
import Link from 'next/link';

interface LiveCalicutLogoProps {
  className?: string;
  showSubtitle?: boolean;
  tone?: 'default' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const HEIGHT: Record<NonNullable<LiveCalicutLogoProps['size']>, string> = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-12',
};

export const LiveCalicutLogo: React.FC<LiveCalicutLogoProps> = ({
  className = '',
  showSubtitle = true,
  tone = 'default',
  size = 'md',
}) => {
  const light = tone === 'light';

  return (
    <Link
      href="/"
      className={`group inline-flex max-w-full flex-col items-center leading-none ${className}`}
      aria-label="LiveCalicut.com home"
    >
      <img
        src={light ? '/images/logo-light.png' : '/images/logo.png'}
        alt="LiveCalicut.com"
        width={1024}
        height={153}
        className={`${HEIGHT[size]} w-auto max-w-[11.5rem] object-contain sm:max-w-[14rem] ${size === 'lg' ? 'sm:max-w-[18rem]' : ''}`}
      />
      {showSubtitle ? (
        <span
          className={`mt-1 text-center text-[9px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap sm:text-[10px] ${
            light ? 'text-white/80' : 'text-slate-500'
          }`}
        >
          Calicut Digital Ecosystem
        </span>
      ) : null}
    </Link>
  );
};
