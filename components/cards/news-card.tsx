'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowUpRight, Newspaper } from 'lucide-react';
import { CoverImage } from '@/components/shared/cover-image';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  timeAgo: string;
  image?: string | null;
  href?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  category,
  timeAgo,
  image,
  href = '/news',
}) => {
  // Contextual scenic Calicut photography if no image provided
  const titleLower = (title || '').toLowerCase();
  const contextualFallback = titleLower.includes('beach') || titleLower.includes('coast') || titleLower.includes('water')
    ? '/heroes/lighthouse-coast.jpg'
    : titleLower.includes('mittai') || titleLower.includes('market') || titleLower.includes('street')
      ? '/heroes/city-market.jpg'
      : titleLower.includes('tech') || titleLower.includes('cyberpark') || titleLower.includes('software')
        ? '/heroes/workplace.jpg'
        : titleLower.includes('food') || titleLower.includes('culinary') || titleLower.includes('feast')
          ? '/heroes/malabar-food.jpg'
          : '/heroes/calicut-hero.jpg';

  const finalImage = image || contextualFallback;

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* News Photo Header */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-900">
          <CoverImage src={finalImage} alt={title} fallbackSrc={contextualFallback} />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

          {/* Category Badge on image */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
              {category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-[#2563EB]" />
              <span>{timeAgo}</span>
            </div>

            <h4 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2563EB]">
              {title}
            </h4>

            <p className="line-clamp-2 text-xs text-slate-600 leading-relaxed font-normal">
              {excerpt}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Calicut Verified
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
              Read Story <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
