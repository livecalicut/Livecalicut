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

export interface PromotedCardItem {
  id: string;
  brandName: string;
  brandTag?: string;
  brandLogo?: string;
  headline: string;
  dealHighlight: string;
  subtext: string;
  bottomStrip: string;
  bankIconText?: string;
  image: string;
  href: string;
  phone?: string;
  badgeText?: string;
  badgeColor?: 'amber' | 'rose' | 'emerald' | 'blue' | 'purple';
  isAd?: boolean;
}

interface PromotedBusinessesCarouselProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: PromotedCardItem[];
  variant?: 'festive' | 'modern';
  sectionId?: string;
}

// Set 1: Premier Brand Spotlights & Mega Deals (Ideal after Featured Listings)
export const PROMOTED_BUSINESSES_SET_1: PromotedCardItem[] = [
  {
    id: 'pb-1',
    brandName: 'PARAGON RESTAURANT',
    brandTag: 'CALICUT ICON',
    headline: 'Classic Malabar Biriyani & Seafood Feast',
    dealHighlight: 'Flat 20% Off on Family Combos',
    subtext: 'Authentic Dum Biriyani & Fresh Karimeen Pollichathu delivered hot across Calicut',
    bottomStrip: '10% Instant Discount on UPI & Card Orders',
    bankIconText: 'SBI / HDFC',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    href: '/business/paragon-restaurant',
    phone: '+914952768888',
    badgeText: 'BIG BANG SALE',
    badgeColor: 'amber',
    isAd: true,
  },
  {
    id: 'pb-2',
    brandName: 'HILITE MALL CALICUT',
    brandTag: 'PREMIER SHOPPING',
    headline: 'Mega Diwali & Festive Fashion Carnival',
    dealHighlight: 'Min. 50% Off on Top 120+ Brands',
    subtext: 'Lifestyle, electronics, dining & entertainment hub on Thondayad Bypass',
    bottomStrip: '₹500 Instant Cashback on Min. ₹3,000 Shopping',
    bankIconText: 'ALL CARDS',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80',
    href: '/business/hilite-mall',
    phone: '+914954088000',
    badgeText: 'FESTIVE OFFER',
    badgeColor: 'rose',
    isAd: true,
  },
  {
    id: 'pb-3',
    brandName: 'DECOLINK LUXURY LIVING',
    brandTag: 'PREMIUM INTERIORS',
    headline: 'Modern Modular Kitchen & Home Decor',
    dealHighlight: 'Save up to ₹45,000 on Full Interior',
    subtext: 'German fittings, 10-year warranty & free 3D design walkthrough at Nadakkavu',
    bottomStrip: '0% EMI Available with Flexible 24 Months Tenure',
    bankIconText: 'NO-COST EMI',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
    href: '/business/decolink-interiors',
    phone: '+919846012345',
    badgeText: 'EXCLUSIVE DEAL',
    badgeColor: 'emerald',
    isAd: true,
  },
  {
    id: 'pb-4',
    brandName: 'ZIACARE HEALTHCARE',
    brandTag: 'VERIFIED CLINIC',
    headline: 'Executive Family Wellness Health Checkup',
    dealHighlight: 'Special ₹999 Complete Body Package',
    subtext: '65+ vital blood tests, ECG, doctor consultation & doorstep sample pickup',
    bottomStrip: 'Free Home Sample Collection in Calicut City',
    bankIconText: 'FREE PICKUP',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    href: '/business/ziacare-clinic',
    phone: '+914952461111',
    badgeText: 'HEALTH SPOTLIGHT',
    badgeColor: 'blue',
    isAd: true,
  },
  {
    id: 'pb-5',
    brandName: 'ASTER MIMS CALICUT',
    brandTag: 'MULTI-SPECIALITY',
    headline: 'Advanced Cardiac & Orthopaedic Care',
    dealHighlight: 'Free Senior Citizen Second Opinion Desk',
    subtext: '24x7 Emergency Trauma Unit & Leading Super Specialists at Govindapuram',
    bottomStrip: 'Direct Cashless Insurance with 40+ TPA Providers',
    bankIconText: 'INSURANCE',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
    href: '/business/aster-mims',
    phone: '+914952488000',
    badgeText: 'TRUSTED CARE',
    badgeColor: 'blue',
    isAd: true,
  },
  {
    id: 'pb-6',
    brandName: 'CLUB SULAIMANI',
    brandTag: 'BEACHSIDE CAFE',
    headline: 'Signature Calicut Sulaimani & Snacks',
    dealHighlight: 'Buy 2 Get 1 Free on Evening Combos',
    subtext: 'Watch Calicut Beach sunset with freshly brewed spiced black tea & hot samosas',
    bottomStrip: 'Special Beachside Seating & Free WiFi',
    bankIconText: 'POPULAR SPOT',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    href: '/business/club-sulaimani',
    phone: '+919847112233',
    badgeText: 'TRENDING CAFE',
    badgeColor: 'amber',
    isAd: true,
  },
  {
    id: 'pb-7',
    brandName: 'KALYAN JEWELLERS',
    brandTag: 'MEMBER BIS 916',
    headline: 'Festive Gold & Diamond Exchange Carnival',
    dealHighlight: 'Zero Making Charges on Selected Items',
    subtext: '100% BIS Hallmarked Pure Gold with lifetime maintenance & exchange guarantee',
    bottomStrip: 'Extra 5% Value on Old Gold Exchange',
    bankIconText: 'BEST RATE',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
    href: '/business/kalyan-jewellers',
    phone: '+914952720000',
    badgeText: 'GOLD FEST',
    badgeColor: 'amber',
    isAd: true,
  },
  {
    id: 'pb-8',
    brandName: 'CYBERPARK TECH HUB',
    brandTag: 'CO-WORKING & IT',
    headline: 'Plug & Play High-Speed Workspaces',
    dealHighlight: 'Starting from ₹3,500 / seat / month',
    subtext: 'High-speed gigabit fiber, soundproof meeting pods & ergonomic seating at Palazhi',
    bottomStrip: '1 Day Free Trial Pass for Tech Startups',
    bankIconText: 'INSTANT PASS',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    href: '/business/cyberpark-calicut',
    phone: '+914952432222',
    badgeText: 'STARTUP BOOST',
    badgeColor: 'purple',
    isAd: true,
  },
];

// Set 2: Exclusive Calicut Deals & City Partnerships (Ideal after Explore Calicut)
export const PROMOTED_BUSINESSES_SET_2: PromotedCardItem[] = [
  {
    id: 'pb-9',
    brandName: 'BOMBAY HOTEL & BAKERS',
    brandTag: 'SINCE 1949',
    headline: 'Authentic Calicut Halwa & Banana Chips',
    dealHighlight: 'Festive Gift Hampers from ₹149',
    subtext: 'Freshly prepared pure coconut oil snacks & world-famous Kozhikodan Halwa boxes',
    bottomStrip: 'Express Worldwide & Kerala Postal Shipping',
    bankIconText: 'AIR COURIER',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    href: '/business/bombay-hotel',
    phone: '+914952366111',
    badgeText: 'HERITAGE TASTE',
    badgeColor: 'amber',
    isAd: true,
  },
  {
    id: 'pb-10',
    brandName: 'MALABAR GOLD & DIAMONDS',
    brandTag: 'GLOBAL BRAND',
    headline: 'Special Calicut Wedding Purchase Scheme',
    dealHighlight: 'Advance Booking Gold Rate Protection',
    subtext: 'Book with only 10% advance and protect against gold price fluctuations',
    bottomStrip: 'Zero Deduction on 22KT Gold Exchange',
    bankIconText: '100% VALUE',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    href: '/business/malabar-gold',
    phone: '+914952721111',
    badgeText: 'WEDDING SPECIAL',
    badgeColor: 'amber',
    isAd: true,
  },
  {
    id: 'pb-11',
    brandName: 'FOCUS MALL RAJAJI ROAD',
    brandTag: 'TECH & GADGETS',
    headline: 'Calicut Mega Electronics & Laptop Fest',
    dealHighlight: 'Up to 40% Off on Laptops & Tablets',
    subtext: 'Instant trade-in exchange for old phones, genuine Apple & Android warranty stores',
    bottomStrip: '10% Instant Discount on Debit/Credit Cards',
    bankIconText: 'SBI / AXIS',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    href: '/business/focus-mall',
    phone: '+914954020000',
    badgeText: 'FLASH TECH SALE',
    badgeColor: 'blue',
    isAd: true,
  },
  {
    id: 'pb-12',
    brandName: 'KADAVU RIVERSIDE RESORT',
    brandTag: 'AYURVEDA & LUXURY',
    headline: 'Chaliyar River Weekend Luxury Staycation',
    dealHighlight: 'Flat 35% Off for Kerala Residents',
    subtext: 'Riverside cottages, infinity pool, traditional Ayurvedic massage & canoe dining',
    bottomStrip: 'Complimentary Malabar Breakfast & Boating',
    bankIconText: 'WEEKEND PASS',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    href: '/business/kadavu-resort',
    phone: '+914832830000',
    badgeText: 'GETAWAY DEAL',
    badgeColor: 'emerald',
    isAd: true,
  },
  {
    id: 'pb-13',
    brandName: 'CALICUT FOOTWEAR MART',
    brandTag: 'SM STREET HUB',
    headline: 'Handcrafted Pure Leather Shoes & Boots',
    dealHighlight: 'Buy 1 Pair, Get 2nd at 50% Off',
    subtext: 'Over 500+ festive designs, wedding mojris, genuine leather sandals & belts',
    bottomStrip: '1-Year Sole Replacement Warranty',
    bankIconText: 'SM STREET',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    href: '/business/calicut-footwear',
    phone: '+919846223344',
    badgeText: 'STYLE DEAL',
    badgeColor: 'rose',
    isAd: true,
  },
  {
    id: 'pb-14',
    brandName: 'SAGAR RESTAURANT',
    brandTag: 'SEAFOOD PARADISE',
    headline: 'Authentic Malabar Fish Curry & Ghee Rice',
    dealHighlight: 'Daily Fresh Catch Specials from ₹160',
    subtext: 'Crispy Neymeen fry, Chemmeen roast & hot pathiri right near Calicut Railway Station',
    bottomStrip: 'Free Lemon Tea on Orders above ₹300',
    bankIconText: 'TOP FOOD SPOT',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    href: '/business/sagar-restaurant',
    phone: '+914952701111',
    badgeText: 'FOOD CRITIC #1',
    badgeColor: 'amber',
    isAd: true,
  },
  {
    id: 'pb-15',
    brandName: 'CALICUT WHEELS AUTO STUDIO',
    brandTag: 'CERAMIC DETAILING',
    headline: '9H Ceramic Coating & Deep Interior Spa',
    dealHighlight: 'Save ₹3,000 on Full Car Detailing',
    subtext: 'Hydrophobic paint protection, leather deep polish & anti-scratch coating on Bypass',
    bottomStrip: 'Free Pick & Drop across Kozhikode Corporation',
    bankIconText: 'DOORSTEP PICK',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80',
    href: '/business/calicut-wheels',
    phone: '+919847990011',
    badgeText: 'AUTO CARE',
    badgeColor: 'purple',
    isAd: true,
  },
  {
    id: 'pb-16',
    brandName: 'EDUMART LEARNING & TECH',
    brandTag: 'PALAYAM BOOKS',
    headline: 'Smart Study Tablets & Competitive Exam Kits',
    dealHighlight: 'Extra 20% Off for Students with ID',
    subtext: 'Kerala PSC, UPSC, NEET guidebooks, graphic drawing tablets & stationery supplies',
    bottomStrip: 'Free Study Planner with every purchase',
    bankIconText: 'STUDENT PASS',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    href: '/business/edumart-calicut',
    phone: '+914952723333',
    badgeText: 'EDUCATION DEAL',
    badgeColor: 'blue',
    isAd: true,
  },
];

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

