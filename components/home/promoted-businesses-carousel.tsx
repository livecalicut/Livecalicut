'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Tag,
  Flame,
} from 'lucide-react';

import {
  type PromotedCardItem,
  PROMOTED_BUSINESSES_SET_1,
  PROMOTED_BUSINESSES_SET_2,
} from '@/lib/constants/promoted-sliders';

export type { PromotedCardItem };

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

  // Layout: Exactly 4 cards per page, structured as 2 Rows x 2 Columns!
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

  // Touch swipe support for mobile
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
      className="w-full bg-white text-slate-900 py-12 sm:py-16 relative overflow-hidden border-b border-slate-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle luxury ambient highlight at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-sm shadow-amber-500/20">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                {badge}
              </span>
              <span className="text-[11px] font-bold text-amber-800">
                Special Merchant Showcase
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-sans">
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-sm shadow-amber-500/20 hover:shadow-md transition-all active:scale-95"
            >
              <span>Promote Your Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Slider Next/Prev Arrows */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/80">
                <button
                  onClick={prevPage}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-lg bg-white hover:bg-amber-500 hover:text-white text-slate-700 border border-slate-200/60 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-600 px-1.5 select-none">
                  {currentPage + 1}/{totalPages}
                </span>
                <button
                  onClick={nextPage}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-lg bg-white hover:bg-amber-500 hover:text-white text-slate-700 border border-slate-200/60 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
                      ? 'w-8 h-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-sm shadow-amber-500/30'
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

// Sub-component: Individual Promoted Banner Card (Luxury White Aesthetic)
function PromotedCard({ item }: { item: PromotedCardItem }) {
  return (
    <div className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400/80 transition-all duration-300 shadow-[0_2px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(245,158,11,0.12)] hover:-translate-y-0.5 overflow-hidden flex flex-col justify-between">
      {/* Top subtle luxury golden accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Card Content Row: Text on Left (60%), Visual on Right (40%) */}
      <div className="p-4 sm:p-5 flex items-stretch justify-between gap-3 sm:gap-4 flex-1">
        {/* Left Column: Brand, Headline, Offer, Subtext */}
        <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0 z-10">
          <div>
            {/* Brand Header & Pill Tag */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-black text-[11px] sm:text-xs text-amber-700 tracking-wider uppercase font-sans">
                {item.brandName}
              </span>
              {item.brandTag && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 text-[9px] font-bold tracking-tight">
                  {item.brandTag}
                </span>
              )}
            </div>

            {/* Big Headline */}
            <Link href={item.href}>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                {item.headline}
              </h3>
            </Link>

            {/* Deal Highlight Tag */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200/70 text-xs sm:text-[13px] font-black text-amber-800 tracking-tight shadow-2xs">
              <Tag className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{item.dealHighlight}</span>
            </div>

            {/* Subtext description */}
            <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-1.5 font-normal leading-relaxed">
              {item.subtext}
            </p>
          </div>
        </div>

        {/* Right Column: Visual Image with Floating Badge */}
        <div className="relative w-32 sm:w-44 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300 aspect-[4/3] sm:aspect-square">
          <img
            src={item.image}
            alt={item.headline}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Subtle gradient overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

          {/* Badge over image (e.g. "BIG BANG", "FESTIVE") */}
          {item.badgeText && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[9px] uppercase tracking-wider shadow-sm">
                {item.badgeText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Bank / Offer Discount Strip + AD Badge */}
      <div className="bg-slate-50/90 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2 group-hover:bg-amber-50/30 transition-colors">
        {/* Deal / Bank Strip */}
        <div className="flex items-center gap-2 min-w-0">
          {item.bankIconText && (
            <span className="px-1.5 py-0.5 rounded bg-white text-slate-900 font-black text-[9px] uppercase tracking-tight shrink-0 shadow-2xs border border-slate-200">
              {item.bankIconText}
            </span>
          )}
          <span className="text-[11px] sm:text-xs font-semibold text-slate-700 truncate">
            {item.bottomStrip}
          </span>
        </div>

        {/* Explicit "AD" Badge in Bottom Right Corner */}
        {item.isAd && (
          <span className="px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-500 font-extrabold text-[9px] tracking-wider uppercase shrink-0 border border-slate-300/60">
            AD
          </span>
        )}
      </div>
    </div>
  );
}
