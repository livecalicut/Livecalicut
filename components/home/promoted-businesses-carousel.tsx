'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Tag,
} from 'lucide-react';

import {
  type PromotedCardItem,
  PROMOTED_BUSINESSES_SET_1,
  PROMOTED_BUSINESSES_SET_2,
} from '@/lib/constants/promoted-sliders';

export type { PromotedCardItem };
export { PROMOTED_BUSINESSES_SET_1, PROMOTED_BUSINESSES_SET_2 };

interface PromotedBusinessesCarouselProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: PromotedCardItem[];
  variant?: 'festive' | 'modern';
  sectionId?: string;
}

export const PromotedBusinessesCarousel: React.FC<PromotedBusinessesCarouselProps> = ({
  title = 'Sponsored Brand Spotlights & Mega Offers',
  subtitle = 'Discover verified promotional campaigns, festive discounts & premier enterprises in Calicut',
  badge = 'PROMOTED SPOTLIGHTS',
  items = PROMOTED_BUSINESSES_SET_1,
  sectionId,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Layout: Exactly 4 cards per page, structured as 2 Rows x 2 Columns
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Restart auto carousel timer helper
  const restartAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }
    if (totalPages > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }, 3500);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % Math.max(1, totalPages));
    restartAutoPlay();
  }, [totalPages, restartAutoPlay]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % Math.max(1, totalPages));
    restartAutoPlay();
  }, [totalPages, restartAutoPlay]);

  const goToPage = useCallback(
    (index: number) => {
      setCurrentPage(index);
      restartAutoPlay();
    },
    [restartAutoPlay]
  );

  // Automatic Continuous Carousel effect (auto-slides every 3.5 seconds)
  useEffect(() => {
    restartAutoPlay();
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [restartAutoPlay]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextPage();
    } else if (diff < -50) {
      prevPage();
    }
    touchStartX.current = null;
  };

  // Divide items into pages of 4 items each (2 rows x 2 columns)
  const pages: PromotedCardItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }

  return (
    <section
      id={sectionId}
      className="w-full bg-white py-12 sm:py-16 border-b border-slate-100 relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Section Header: Premium Clean Hierarchy */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 font-extrabold text-[11px] tracking-wider uppercase shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                {badge}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls: Arrows + "Promote Your Business" CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/merchant"
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <span>Promote Your Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Slider Next/Prev Arrows */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={prevPage}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-600 px-2 select-none">
                  {currentPage + 1}/{totalPages}
                </span>
                <button
                  onClick={nextPage}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Slide Container */}
        <div className="relative overflow-hidden w-full">
          <div
            className="flex transition-transform duration-700 ease-in-out will-change-transform"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((slideItems, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full shrink-0 flex-none"
                style={{ width: '100%' }}
              >
                {/* 2 ROWS x 2 COLUMNS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {slideItems.map((item) => (
                    <PromotedCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots at Bottom Center */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentPage;
              return (
                <button
                  key={idx}
                  onClick={() => goToPage(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-8 h-2 rounded-full bg-[#2563EB] shadow-xs'
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

// Sub-component: Individual Promoted Banner Card (High-End White Aesthetic)
function PromotedCard({ item }: { item: PromotedCardItem }) {
  // Badge color themes
  const badgeStyles: Record<string, string> = {
    amber: 'bg-amber-500 text-slate-950 font-black',
    rose: 'bg-rose-500 text-white font-black',
    emerald: 'bg-emerald-600 text-white font-black',
    blue: 'bg-blue-600 text-white font-black',
    purple: 'bg-purple-600 text-white font-black',
  };
  const activeBadgeStyle = item.badgeColor ? badgeStyles[item.badgeColor] || badgeStyles.amber : badgeStyles.amber;

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-[#2563EB]/40 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col justify-between">
      {/* Top subtle luxury accent line */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-[#2563EB] group-hover:h-1.5 transition-all" />

      {/* Card Content Row: Text on Left, Visual on Right */}
      <div className="p-4 sm:p-5 flex items-stretch justify-between gap-3 sm:gap-4 flex-1">
        {/* Left Column: Brand, Headline, Offer, Subtext */}
        <div className="flex-1 flex flex-col justify-between space-y-2.5 min-w-0 z-10">
          <div>
            {/* Brand Name & Tag */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 tracking-wider uppercase font-sans flex items-center gap-1">
                {item.brandName}
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              </span>
              {item.brandTag && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-tight border border-slate-200/60">
                  {item.brandTag}
                </span>
              )}
            </div>

            {/* Big Headline */}
            <Link href={item.href}>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                {item.headline}
              </h3>
            </Link>

            {/* Deal Highlight Tag: Punchy Pill Box */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 font-extrabold text-xs sm:text-[13px] tracking-tight shadow-2xs">
              <Tag className="w-3 h-3 text-amber-600" />
              <span>{item.dealHighlight}</span>
            </div>

            {/* Subtext description */}
            <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-2 font-normal leading-relaxed">
              {item.subtext}
            </p>
          </div>
        </div>

        {/* Right Column: Visual Image with Floating Pill */}
        <div className="relative w-32 sm:w-44 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center aspect-[4/3] sm:aspect-square">
          <img
            src={item.image}
            alt={item.headline}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
            loading="lazy"
          />

          {/* Subtle gradient overlay on bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

          {/* Floating Pill Badge over image (e.g. "BIG BANG SALE", "FESTIVE") */}
          {item.badgeText && (
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider shadow-sm ${activeBadgeStyle}`}>
                {item.badgeText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Bank / Offer Discount Strip + AD Badge */}
      <div className="bg-slate-50/90 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2 group-hover:bg-blue-50/40 transition-colors">
        {/* Deal / Bank Strip */}
        <div className="flex items-center gap-2 min-w-0">
          {item.bankIconText && (
            <span className="px-2 py-0.5 rounded-md bg-white text-slate-800 font-extrabold text-[9px] uppercase tracking-wide shrink-0 border border-slate-200 shadow-2xs">
              {item.bankIconText}
            </span>
          )}
          <span className="text-[11px] sm:text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors truncate">
            {item.bottomStrip}
          </span>
        </div>

        {/* Right side: AD Badge + Link Indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          {item.isAd && (
            <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-500 font-extrabold text-[9px] tracking-wider uppercase border border-slate-300/60">
              AD
            </span>
          )}
          <Link
            href={item.href}
            className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#2563EB] group-hover:border-[#2563EB]/40 group-hover:translate-x-0.5 transition-all shadow-2xs"
            aria-label="View offer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
