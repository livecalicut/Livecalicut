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
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl border-2 border-[#2563EB]/20" />
        <span className="absolute inset-0 animate-logo-spin rounded-2xl border-2 border-transparent border-t-[#2563EB]" />
        <img
          src="/images/logo.png"
          alt="LiveCalicut"
          className="relative z-10 h-6 w-auto animate-logo-pulse object-contain"
        />
      </div>
      <p className="text-xs font-semibold tracking-wide text-[#6B7280]">{label}</p>
    </div>
  );
}
