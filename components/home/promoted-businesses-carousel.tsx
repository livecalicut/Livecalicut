'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  title = 'Sponsored Brand Spotlights & Mega Offers',
  subtitle = 'Discover exclusive festive promotions, mega offers & premier enterprises across Calicut',
  badge = 'PROMOTED SPOTLIGHTS',
  items = [],
  sectionId,
  showCreativeBanner = true,
  creativeCopy,
  autoPlayInterval = 2000, // 2-second automatic slide transition
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = useRef<number | null>(null);

  // Responsive column detection: 3 columns on desktop (>=1024px), 2 on tablet (>=640px), 1 on mobile (<640px)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) {
          setVisibleCount(3);
        } else if (window.innerWidth >= 640) {
          setVisibleCount(2);
        } else {
          setVisibleCount(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Base items normalization: ensure at least 6 items for smooth 3-column looping
  const baseItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    let list = [...items];
    while (list.length < 6) {
      list = [...list, ...items];
    }
    return list;
  }, [items]);

  const M = baseItems.length;

  // Triplicate the array: [Set 0 (left buffer), Set 1 (active set), Set 2 (right buffer)]
  const displayItems = useMemo(() => {
    if (baseItems.length === 0) return [];
    return [...baseItems, ...baseItems, ...baseItems];
  }, [baseItems]);

  // Start in the middle set (index M)
  const [currentIndex, setCurrentIndex] = useState(M || 0);

  // Sync index when baseItems length changes
  useEffect(() => {
    if (M > 0) {
      setIsTransitioning(false);
      setCurrentIndex(M);
    }
  }, [M]);

  // Re-enable CSS transition after instantaneous reset
  useEffect(() => {
    if (!isTransitioning) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [isTransitioning]);

  // Next slide (advances forward by 1 card from right to left)
  const nextSlide = useCallback(() => {
    if (M === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [M]);

  // Previous slide (moves backward by 1 card)
  const prevSlide = useCallback(() => {
    if (M === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [M]);

  // Seamless Infinite Loop Reset on Transition End:
  // When sliding into Set 2 (right buffer), instantaneously teleport to Set 1 without any rewind!
  const handleTransitionEnd = () => {
    if (M === 0) return;

    if (currentIndex >= 2 * M) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - M);
    } else if (currentIndex < M) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + M);
    }
  };

  // Jump to specific slide (relative to active middle set)
  const goToSlide = (idx: number) => {
    setIsTransitioning(true);
    setCurrentIndex(M + (idx % M));
  };

  // Auto-play interval: moves forward continuously every 2 seconds without ANY rewind!
  useEffect(() => {
    if (M === 0 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [M, isPaused, autoPlayInterval, nextSlide]);

  // Mobile touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide(); // swipe left -> advance next
    } else if (diff < -40) {
      prevSlide(); // swipe right -> go prev
    }
    touchStartX.current = null;
  };

  // Relative active index (for pagination dots and indicators)
  const activeDotIndex = M > 0 ? ((currentIndex % M) + M) % M : 0;

  // Empty state: When no banners are added in backend
  if (!items || items.length === 0) {
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

          {/* Creative Spotlight Banner */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E1B18] via-[#141210] to-[#0D0B0A] border border-amber-500/30 shadow-lg text-white aspect-[16/8] sm:aspect-[21/8] md:aspect-[24/8] min-h-[200px] flex items-center">
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

            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full p-5 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 sm:space-y-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    LIVECALICUT PARTNER
                  </span>
                  <span className="text-[11px] text-amber-300/90 font-bold">
                    Prime Spotlight
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight">
                  {headline}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-2 max-w-lg">
                  {subtext}
                </p>

                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-bold text-amber-200">
                    <Tag className="w-3 h-3 text-amber-400" />
                    <span>From ₹499/mo · Instant WhatsApp Leads</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-bold text-slate-200">
                    <span>⚡ 50,000+ Monthly Visitors</span>
                  </div>
                </div>

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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                <Flame className="w-3 h-3 fill-slate-950" />
                {badge}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide hidden sm:inline">
                Exclusive Calicut Showcase
              </span>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium hidden md:block">
                {subtitle}
              </p>
            )}
          </div>

          {/* Header Action: Promote link & Manual Navigation Arrows */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/merchant"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
            >
              <span>Promote Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Header Arrow Controls */}
            {M > 1 && (
              <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    prevSlide();
                  }}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    nextSlide();
                  }}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3-COLUMN CONTINUOUS INFINITE LOOP CAROUSEL TRACK */}
        <div className="relative w-full overflow-hidden group">
          {/* Track Container */}
          <div
            className="flex will-change-transform"
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
              transition: isTransitioning
                ? 'transform 650ms cubic-bezier(0.25, 1, 0.5, 1)'
                : 'none',
            }}
          >
            {displayItems.map((banner, index) => {
              const isFullGraphic = !banner.headline && !banner.dealHighlight;

              return (
                <div
                  key={`${banner.id || 'slide'}-${index}`}
                  className="w-full sm:w-1/2 lg:w-1/3 shrink-0 flex-none px-2 sm:px-2.5"
                >
                  <Link
                    href={banner.href || '/business'}
                    className="group/card relative block w-full h-[280px] sm:h-[300px] lg:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 hover:border-amber-400/80 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    {/* Background Banner Image with Subtle Zoom on Hover */}
                    <img
                      src={banner.image}
                      alt={banner.headline || banner.brandName || 'Promoted banner'}
                      className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-700 ease-out select-none"
                      loading={index < 6 ? 'eager' : 'lazy'}
                    />

                    {/* Dark Multi-layer Gradient for Crisp Typography */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15 pointer-events-none" />

                    {/* Top Festive Lights Garland / Ambient Glow */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400/40 via-amber-300/70 to-amber-400/40 pointer-events-none" />

                    {/* Top Row: Brand Pill & Floating Badge */}
                    <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] tracking-wider uppercase truncate shadow-xs">
                          {banner.brandName}
                        </span>
                        {banner.brandTag && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-amber-200 text-[8px] font-bold border border-amber-300/20 truncate">
                            {banner.brandTag}
                          </span>
                        )}
                      </div>

                      {banner.badgeText && (
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider shadow-sm shrink-0">
                          {banner.badgeText}
                        </span>
                      )}
                    </div>

                    {/* Bottom Content Area */}
                    <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 lg:p-5 flex flex-col justify-end gap-1.5 z-10 text-white">
                      {/* Headline */}
                      <h3 className="text-sm sm:text-base lg:text-lg font-black text-white leading-snug line-clamp-2 drop-shadow-sm group-hover/card:text-amber-200 transition-colors">
                        {banner.headline}
                      </h3>

                      {/* Deal Highlight Badge */}
                      {banner.dealHighlight && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[11px] sm:text-xs shadow-xs w-fit">
                          <Tag className="w-3 h-3 shrink-0" />
                          <span className="truncate">{banner.dealHighlight}</span>
                        </div>
                      )}

                      {/* Subtext */}
                      {banner.subtext && (
                        <p className="text-[11px] sm:text-xs text-slate-300 font-medium line-clamp-1">
                          {banner.subtext}
                        </p>
                      )}

                      {/* Bottom Strip: Bank offer & AD badge */}
                      <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-white/15 mt-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {banner.bankIconText && (
                            <span className="px-1.5 py-0.2 rounded bg-white text-slate-950 font-black text-[8px] uppercase shrink-0">
                              {banner.bankIconText}
                            </span>
                          )}
                          <span className="text-[10px] sm:text-[11px] font-medium text-slate-300 truncate">
                            {banner.bottomStrip || 'Limited Time Special Deal'}
                          </span>
                        </div>

                        <span className="px-1.5 py-0.2 bg-black/70 backdrop-blur-xs text-amber-400 text-[8px] font-black rounded border border-white/20 shrink-0">
                          AD
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Floating Left Arrow Button */}
          {M > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                prevSlide();
              }}
              aria-label="Previous banner"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Floating Right Arrow Button */}
          {M > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                nextSlide();
              }}
              aria-label="Next banner"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer z-20 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Bottom Pagination Dots / Indicators */}
        {M > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {Array.from({ length: Math.min(M, 8) }).map((_, idx) => {
              const isActive = idx === (activeDotIndex % Math.min(M, 8));
              return (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-7 sm:w-8 h-2 rounded-full bg-amber-500 shadow-xs'
                      : 'w-2 h-2 rounded-full bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
