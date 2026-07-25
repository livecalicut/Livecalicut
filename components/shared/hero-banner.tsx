'use client';

import React from 'react';
import Link from 'next/link';
import { UniversalSearch } from './universal-search';
import { LiveCalicutLogo } from './live-calicut-logo';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  videoUrl?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = "Kozhikode's Digital Operating System",
  subtitle =
    'Discover verified local businesses, Cyberpark IT hiring, local news, beach tourism, and classifieds across Kozhikode.',
  videoUrl =
    'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-ocean-waves-reaching-the-beach-41481-large.mp4',
}) => {
  const popular = [
    { href: '/business', label: 'Shops & Dining' },
    { href: '/jobs', label: 'Cyberpark Jobs' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/hotels', label: 'Beach Stays' },
  ];

  return (
    <div className="relative flex w-full min-h-[480px] flex-col items-center justify-center overflow-hidden sm:min-h-[540px] lg:min-h-[600px]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
          className="h-full w-full scale-105 object-cover opacity-45"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/78 to-white" />
        <div className="absolute inset-0 bg-hero-grid opacity-[0.35]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-14 text-center sm:px-8 sm:py-16 lg:px-10">
        <div
          className="mb-7 flex flex-col items-center gap-3 opacity-0 animate-fade-in-up"
          style={{ animationFillMode: 'forwards' }}
        >
          <LiveCalicutLogo showSubtitle className="scale-[1.15] sm:scale-125" />
        </div>

        <h1
          className="text-[1.75rem] font-bold tracking-tight text-[#111827] opacity-0 animate-fade-in-up sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
          style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}
        >
          {title}
        </h1>

        <p
          className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-[#6B7280] opacity-0 animate-fade-in-up sm:text-[15px]"
          style={{ animationDelay: '140ms', animationFillMode: 'forwards' }}
        >
          {subtitle}
        </p>

        <div
          className="mt-8 w-full max-w-2xl opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <UniversalSearch />
        </div>

        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[12px] text-[#6B7280] opacity-0 animate-fade-in-up"
          style={{ animationDelay: '260ms', animationFillMode: 'forwards' }}
        >
          <span className="mr-1 font-medium text-[#9CA3AF]">Popular:</span>
          {popular.map((item, i) => (
            <React.Fragment key={item.href}>
              {i > 0 && (
                <span className="mx-1 text-[#D1D5DB]" aria-hidden>
                  ·
                </span>
              )}
              <Link
                href={item.href}
                className="font-semibold text-[#374151] transition hover:text-[#2563EB]"
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
