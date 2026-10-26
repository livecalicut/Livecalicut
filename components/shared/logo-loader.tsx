'use client';

import React from 'react';

interface LogoLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export function LogoLoader({
  label = 'Loading LiveCalicut…',
  fullScreen = false,
}: LogoLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-white'
          : 'flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 bg-white py-16'
      }
      role="status"
      aria-live="polite"
    >
      <img
        src="/images/logo.png"
        alt="LiveCalicut.com"
        width={1024}
        height={153}
        className="h-10 w-auto max-w-[16rem] animate-logo-pulse object-contain"
      />
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-[#2C3691]/20" />
        <span className="absolute inset-0 animate-logo-spin rounded-full border-2 border-transparent border-t-[#EC2028]" />
      </span>
      <p className="text-xs font-semibold tracking-wide text-[#6B7280]">{label}</p>
    </div>
  );
}
