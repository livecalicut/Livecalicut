'use client';

import React, { useState } from 'react';
import { MapPin, Sparkles, ShieldCheck, Zap, TrendingUp, Building2, Briefcase, Tag, Compass } from 'lucide-react';
import { UniversalSearch } from './universal-search';
import { WeatherWidget } from './weather-widget';
import Link from 'next/link';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  videoUrl?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title = 'Kozhikode’s Digital Operating System',
  subtitle = 'Discover verified local businesses, Cyberpark IT hiring, local news, beach tourism, and classifieds across Kozhikode.',
  badgeText = 'Hyperlocal Platform • 21 Kozhikode Wards Verified',
  videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-ocean-waves-reaching-the-beach-41481-large.mp4'
}) => {
  // Interactive Cursor Spotlight coordinates
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full min-h-[620px] lg:min-h-[700px] flex flex-col justify-center items-center py-16 sm:py-24 px-5 sm:px-10 lg:px-20 overflow-hidden"
    >
      {/* 1. Complete Edge-to-Edge Full-Bleed Video & Imagery Backdrop (100vw) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Looping Atmospheric Ocean & Coastal Technology Video Stream */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-35 filter contrast-125 brightness-105 scale-105 transition-transform duration-1000"
        >
          <source
            src={videoUrl}
            type="video/mp4"
          />
        </video>

        {/* Ambient Animated Radial Light Spheres */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#2563EB]/25 rounded-full blur-[130px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-400/25 rounded-full blur-[130px] animate-float pointer-events-none" />

        {/* VelvetByte Interactive Spotlight Mouse Glow */}
        {isHovering && (
          <div
            className="absolute z-10 w-[750px] h-[750px] rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              left: `${mousePos.x - 375}px`,
              top: `${mousePos.y - 375}px`,
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.06) 50%, transparent 80%)',
            }}
          />
        )}

        {/* Fine Grain Grid Pattern */}
        <div className="absolute inset-0 bg-hero-grid opacity-60" />

        {/* Top & Bottom Soft Mask Fades for Pure White Integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white" />
      </div>

      {/* 2. VelvetByte / WebAndCrafts Floating Glass Interactive Badges */}
      <div className="hidden xl:flex absolute top-12 left-10 z-10 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-lg backdrop-blur-xl animate-float">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <Zap className="w-4 h-4 text-[#2563EB]" />
        <span className="text-xs font-extrabold text-[#111827] font-sans">Sub-50ms City Engine</span>
      </div>

      <div
        className="hidden xl:flex absolute top-16 right-10 z-10 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-lg backdrop-blur-xl animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span className="text-xs font-extrabold text-[#111827] font-sans">100% Ward Physical Checks</span>
      </div>

      <div
        className="hidden xl:flex absolute bottom-12 left-12 z-10 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-[#E5E7EB] shadow-lg backdrop-blur-xl animate-float"
        style={{ animationDelay: '2.5s' }}
      >
        <TrendingUp className="w-4 h-4 text-[#2563EB]" />
        <span className="text-xs font-extrabold text-[#111827] font-sans">5,200+ Cyberpark Careers</span>
      </div>

      {/* 3. Hero Content Container */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up w-full">
        {/* Weather Widget */}
        <div className="flex justify-center mb-2">
          <WeatherWidget />
        </div>

        {/* City Badge Tagline */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/95 border border-blue-200 text-xs font-extrabold text-[#2563EB] shadow-sm backdrop-blur-md transition-all hover:scale-105 cursor-default">
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <span>{badgeText}</span>
          <Sparkles className="w-4 h-4 text-[#2563EB] animate-pulse" />
        </div>

        {/* Hero Headline: 64px Poppins Bold */}
        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight text-[#111827] leading-[1.1] font-sans">
          {title.includes('Kozhikode') ? (
            <>
              {title.split('Kozhikode')[0]}
              <span className="text-[#2563EB] relative inline-block">
                Kozhikode
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-200/70 -z-10 rounded-full" />
              </span>
              {title.split('Kozhikode')[1]}
            </>
          ) : (
            <span className="text-[#2563EB]">{title}</span>
          )}
        </h1>

        {/* Sub-headline */}
        <p className="text-[16px] sm:text-[18px] text-[#4B5563] max-w-2xl mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>

        {/* Integrated Universal Search Engine */}
        <div className="pt-2 max-w-3xl mx-auto space-y-4">
          <UniversalSearch />

          {/* Quick Module Shortcut Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-[#6B7280] font-semibold mr-1">Popular in Kozhikode:</span>
            <Link
              href="/business"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border border-[#E5E7EB] text-[#111827] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-[#2563EB]" /> Shops & Dining
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border border-[#E5E7EB] text-[#111827] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" /> Cyberpark Openings
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border border-[#E5E7EB] text-[#111827] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-xs"
            >
              <Tag className="w-3.5 h-3.5 text-[#2563EB]" /> Pre-Owned Items
            </Link>
            <Link
              href="/tourism"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/95 border border-[#E5E7EB] text-[#111827] font-semibold hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-[#2563EB]" /> Beach Stays
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
