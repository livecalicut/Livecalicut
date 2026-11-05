'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  Tag,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

import { type PromotedCardItem } from '@/lib/constants/promoted-sliders';

export type { PromotedCardItem };

export interface CreativeCopyProps {
  headline?: string;
  subtext?: string;
  badge?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface PromotedBusinessesCarouselProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: PromotedCardItem[];
  variant?: 'festive' | 'modern';
  sectionId?: string;
  showCreativeBanner?: boolean;
  creativeCopy?: CreativeCopyProps;
  autoPlayInterval?: number; // default: 2000ms (2 seconds) as requested!
}

export const PromotedBusinessesCarousel: React.FC<PromotedBusinessesCarouselProps> = ({
  title = 'Sponsored Brand Spotlights',
  subtitle = 'Discover exclusive festive promotions, mega offers & premier enterprises across Calicut',
  badge = 'PROMOTED SPOTLIGHTS',
  items = [],
  sectionId,
  showCreativeBanner = true,
  creativeCopy,
  autoPlayInterval = 2000, // 2-second automatic slide transition
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalBanners = items.length;

  // Next banner (slides from right to left)
  const nextSlide = useCallback(() => {
    if (totalBanners <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  // Previous banner
  const prevSlide = useCallback(() => {
    if (totalBanners <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  }, [totalBanners]);

  // Jump to slide
  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Continuous auto-carousel: moves right-to-left every 2 seconds
  useEffect(() => {
    if (totalBanners <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [totalBanners, isPaused, autoPlayInterval]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide(); // Swiped left -> move to next
    } else if (diff < -40) {
      prevSlide(); // Swiped right -> move to previous
    }
    touchStartX.current = null;
  };

  // Empty state: When no banners are added in backend
  if (totalBanners === 0) {
    if (!showCreativeBanner) {
      return null;
    }

    const headline = creativeCopy?.headline || 'Spotlight Your Brand Across Kozhikode';
    const subtext =
      creativeCopy?.subtext ||
      'Put your business directly in front of 50,000+ verified Kozhikode shoppers, diners & clients daily. Prime full-width banner visibility with direct WhatsApp leads.';
    const badgeText = creativeCopy?.badge || 'FEATURE YOUR BUSINESS';
    const ctaText = creativeCopy?.ctaText || 'Promote Your Business';
    const ctaUrl = creativeCopy?.ctaUrl || '/merchant';

    return (
      <section
        id={sectionId}
        className="w-full bg-white text-slate-900 py-6 sm:py-8 border-b border-slate-100"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                <Flame className="w-3 h-3 fill-slate-950" />
                {badgeText}
              </span>
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                Calicut Merchant Spotlight
              </span>
            </div>
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Flipkart / Amazon Style Full Creative Banner */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E1B18] via-[#141210] to-[#0D0B0A] border border-amber-500/30 shadow-lg text-white aspect-[16/8] sm:aspect-[21/8] md:aspect-[24/8] min-h-[200px] flex items-center">
            {/* Top Festive Lights Garland (Diwali / Festive Ambient Lights) */}
            <div className="absolute top-0 inset-x-0 h-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/80 via-amber-300/40 to-transparent pointer-events-none z-10" />
            <div className="absolute top-1 inset-x-0 flex justify-around pointer-events-none z-10 opacity-70">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b] animate-pulse"
                  style={{ animationDelay: `${(i % 5) * 300}ms` }}
                />
              ))}
            </div>

            {/* Subtle background ambient glow */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Banner Content Grid */}
            <div className="relative z-10 w-full p-5 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left Column: Headline, Deal & Value Badges */}
              <div className="space-y-2 sm:space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    LIVECALICUT PARTNER
                  </span>
                  <span className="text-[11px] text-amber-300/90 font-bold">
                    Prime Homepage Banner
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
                  {headline}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 max-w-lg">
                  {subtext}
                </p>

                {/* Bank / Deal strip (Flipkart Style) */}
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-bold text-amber-200">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>From ₹499/mo · Instant WhatsApp Leads</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-bold text-slate-200">
                    <span>⚡ 50,000+ Monthly Visitors</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-2 flex items-center gap-3 flex-wrap">
                  <Link
                    href={ctaUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://wa.me/919539980990?text=Hi%20LiveCalicut,%20I%20want%20to%20spotlight%20my%20business%20on%20LiveCalicut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-all active:scale-95"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Desk</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Festive Burst Graphic Badge (Flipkart Style) */}
              <div className="hidden sm:flex flex-col items-center justify-center shrink-0 pr-4">
                <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-400/30 text-center space-y-1 backdrop-blur-xs">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[11px] uppercase tracking-wider shadow-sm">
                    MEGA FESTIVE
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-amber-300 leading-tight">
                    GROW YOUR
                    <br />
                    BUSINESS
                  </h3>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    REACH ALL KOZHIKODE
                  </p>
                </div>
              </div>
            </div>

            {/* AD Badge on Bottom Right (Flipkart Style) */}
            <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-black uppercase tracking-wider border border-white/20 select-none">
              AD
            </span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      className="w-full bg-white text-slate-900 py-6 sm:py-8 border-b border-slate-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
              <Flame className="w-3 h-3 fill-slate-950" />
              {badge}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {title}
            </span>
          </div>
          <Link
            href="/merchant"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <span>Promote Your Business</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* FULL-IMAGE BANNER CAROUSEL (Slides Right-to-Left every 2 seconds) */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-md group aspect-[16/8] sm:aspect-[21/8] md:aspect-[24/8] min-h-[190px] max-h-[440px]">
          {/* Carousel Slide Track */}
          <div
            className="flex transition-transform duration-700 ease-in-out will-change-transform h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((banner, index) => {
              const isFullGraphic = !banner.headline && !banner.dealHighlight;

              return (
                <div
                  key={banner.id || index}
                  className="w-full h-full shrink-0 flex-none relative"
                >
                  <Link
                    href={banner.href || '/business'}
                    className="block w-full h-full relative group/slide"
                  >
                    {/* Full Banner Image */}
                    <img
                      src={banner.image}
                      alt={banner.headline || banner.brandName || 'Promoted banner'}
                      className="w-full h-full object-cover object-center select-none"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Top Festive Lights Ambient Garland */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/60 via-amber-300/20 to-transparent pointer-events-none" />

                    {/* Optional Sleek Overlay if Banner Has Text */}
                    {!isFullGraphic && (banner.headline || banner.brandName) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent flex items-center p-5 sm:p-8 lg:p-12">
                        <div className="space-y-2 sm:space-y-3 max-w-lg text-white">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-[11px] sm:text-xs text-amber-400 uppercase tracking-wider font-sans">
                              {banner.brandName}
                            </span>
                            {banner.brandTag && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-amber-200 border border-amber-300/30 text-[9px] font-bold">
                                {banner.brandTag}
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight">
                            {banner.headline}
                          </h3>

                          {banner.dealHighlight && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-sm">
                              <Tag className="w-3.5 h-3.5" />
                              <span>{banner.dealHighlight}</span>
                            </div>
                          )}

                          {banner.subtext && (
                            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">
                              {banner.subtext}
                            </p>
                          )}

                          {banner.bottomStrip && (
                            <div className="pt-1 flex items-center gap-2">
                              {banner.bankIconText && (
                                <span className="px-1.5 py-0.5 rounded bg-white text-slate-950 font-black text-[9px] uppercase">
                                  {banner.bankIconText}
                                </span>
                              )}
                              <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
                                {banner.bottomStrip}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Floating Badge (e.g. "BIG BANG", "FESTIVE") */}
                    {banner.badgeText && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-md">
                          {banner.badgeText}
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Left Arrow Button */}
          {totalBanners > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              aria-label="Previous banner"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all opacity-70 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 shadow-md"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Right Arrow Button */}
          {totalBanners > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              aria-label="Next banner"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all opacity-70 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 shadow-md"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Bottom Pagination Dots / Indicators */}
          {totalBanners > 1 && (
            <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
              {Array.from({ length: totalBanners }).map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to banner ${idx + 1}`}
                    className={`transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-7 sm:w-8 h-2 rounded-full bg-amber-400 shadow-md'
                        : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white backdrop-blur-xs'
                    }`}
                  />
                );
              })}
            </div>
          )}

          {/* Flipkart-Style "AD" Badge in Bottom Right Corner */}
          <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-black uppercase tracking-wider border border-white/20 select-none z-10 pointer-events-none shadow-sm">
            AD
          </span>
        </div>
      </div>
    </section>
  );
};
