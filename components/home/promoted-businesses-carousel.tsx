'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Tag,
  Phone,
  ExternalLink,
  Flame,
  ShieldCheck,
  Zap,
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
  badge = 'PROMOTED BUSINESSES',
  items = PROMOTED_BUSINESSES_SET_1,
  variant = 'festive',
  sectionId,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Layout: Exactly 4 cards per page, structured as 2 Rows x 2 Columns!
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % Math.max(1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % Math.max(1, totalPages));
  }, [totalPages]);

  // Autoplay functionality: pauses when user is hovering
  useEffect(() => {
    if (isHovered || totalPages <= 1) return;
    const interval = setInterval(nextPage, 6000);
    return () => clearInterval(interval);
  }, [isHovered, totalPages, nextPage]);

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

  // Divide items into pages of 4 items each (2 rows x 2 cols)
  const pages: PromotedCardItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }

  return (
    <section
      id={sectionId}
      className="w-full bg-[#0A0F1D] text-white py-12 sm:py-16 relative overflow-hidden border-y border-amber-500/20 shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative Warm Festive Lighting Garlands at Top (inspired by Image 2) */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-400/20 via-amber-500/10 to-transparent pointer-events-none" />
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle festive light strings representation */}
      <div className="absolute top-0 inset-x-0 flex justify-around opacity-30 pointer-events-none overflow-hidden h-3">
        {Array.from({ length: 24 }).map((_, idx) => (
          <span
            key={idx}
            className={`w-1.5 h-1.5 rounded-full ${
              idx % 3 === 0
                ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                : idx % 3 === 1
                ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                : 'bg-yellow-300 shadow-[0_0_8px_#fde047]'
            }`}
          />
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md shadow-amber-500/20">
                <Flame className="w-3 h-3 fill-slate-950" />
                {badge}
              </span>
              <span className="text-[11px] font-semibold text-amber-300/90 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Special Merchant Showcase
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-sans">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-normal">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls: Arrows + "Advertise" CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/merchant"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <span>Promote Your Business</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Slider Next/Prev Arrows */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={prevPage}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-400 px-1">
                  {currentPage + 1}/{totalPages}
                </span>
                <button
                  onClick={nextPage}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
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
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((slideItems, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full shrink-0 flex-none"
                style={{ width: '100%' }}
              >
                {/* 2 ROWS x 2 COLUMNS GRID (Exactly requested: "2 row il 2 collom vech") */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {slideItems.map((item) => (
                    <PromotedCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots at Bottom Center (Image 2 style: elongated active pill + dots) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === currentPage;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-8 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-md shadow-amber-500/50'
                      : 'w-2.5 h-2.5 rounded-full bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Decorative Warm Festive Lighting Garlands at Bottom (inspired by Image 2) */}
      <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-amber-400/20 via-amber-500/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 flex justify-around opacity-30 pointer-events-none overflow-hidden h-3">
        {Array.from({ length: 24 }).map((_, idx) => (
          <span
            key={idx}
            className={`w-1.5 h-1.5 rounded-full ${
              idx % 3 === 0
                ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                : idx % 3 === 1
                ? 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                : 'bg-yellow-300 shadow-[0_0_8px_#fde047]'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Sub-component: Individual Promoted Banner Card
// Faithfully matches the visual hierarchy from Image 2:
// - Brand Header & Logo
// - Punchy bold title
// - Price / Highlight banner
// - Bottom Bank / Deal offer strip
// - Distinct "AD" badge in bottom right corner!
function PromotedCard({ item }: { item: PromotedCardItem }) {
  return (
    <div className="group relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#131B2E] via-[#0F1626] to-[#0A0F1D] border border-amber-500/25 hover:border-amber-400/60 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden flex flex-col justify-between">
      {/* Top subtle festive ambient glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Card Content Row: Text on Left (60%), Visual on Right (40%) */}
      <div className="p-4 sm:p-5 flex items-stretch justify-between gap-3 sm:gap-4 flex-1">
        {/* Left Column: Brand, Headline, Offer, Subtext */}
        <div className="flex-1 flex flex-col justify-between space-y-2 min-w-0 z-10">
          <div>
            {/* Brand Logo & Pill */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-extrabold text-[11px] sm:text-xs text-amber-400 tracking-wider uppercase font-sans">
                {item.brandName}
              </span>
              {item.brandTag && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-bold tracking-tight">
                  {item.brandTag}
                </span>
              )}
            </div>

            {/* Big Headline */}
            <Link href={item.href}>
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-tight">
                {item.headline}
              </h3>
            </Link>

            {/* Deal Highlight Tag */}
            <div className="mt-1.5 inline-flex items-center gap-1 text-xs sm:text-sm font-black text-amber-400 tracking-tight">
              <span>{item.dealHighlight}</span>
            </div>

            {/* Subtext description */}
            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1 mt-1 font-normal">
              {item.subtext}
            </p>
          </div>
        </div>

        {/* Right Column: Visual Image with Festive Lighting Effect (Image 2 style) */}
        <div className="relative w-32 sm:w-44 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
          <img
            src={item.image}
            alt={item.headline}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Dark gradient overlay for smooth text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

          {/* Badge over image (e.g. "BIG BANG", "FESTIVE") */}
          {item.badgeText && (
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-sm">
                {item.badgeText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Bank / Offer Discount Strip + AD Badge (Image 2 signature element!) */}
      <div className="bg-[#0B101D] px-4 py-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        {/* Deal / Bank Strip (like Image 2 SBI 10% instant discount strip) */}
        <div className="flex items-center gap-2 min-w-0">
          {item.bankIconText && (
            <span className="px-1.5 py-0.5 rounded bg-white text-slate-950 font-black text-[9px] uppercase tracking-tight shrink-0 shadow-xs">
              {item.bankIconText}
            </span>
          )}
          <span className="text-[11px] font-semibold text-slate-300 truncate">
            {item.bottomStrip}
          </span>
        </div>

        {/* Explicit "AD" Badge in Bottom Right Corner (Exact replica of Image 2!) */}
        {item.isAd && (
          <span className="px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 font-extrabold text-[9px] tracking-wider uppercase shrink-0 border border-slate-700">
            AD
          </span>
        )}
      </div>
    </div>
  );
}

