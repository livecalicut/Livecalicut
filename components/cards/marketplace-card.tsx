'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Heart, ShieldCheck, Clock } from 'lucide-react';
import { CoverImage } from '@/components/shared/cover-image';

interface MarketplaceCardProps {
  id?: string;
  title: string;
  price: string;
  condition?: string;
  location: string;
  timeAgo?: string;
  image?: string | null;
  href?: string;
  isVerifiedSeller?: boolean;
  isFeatured?: boolean;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  id: _id,
  title,
  price,
  condition = 'Like New',
  location,
  timeAgo,
  image,
  href = '/marketplace',
  isVerifiedSeller = false,
  isFeatured = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formattedPrice = price
    ? price.startsWith('₹')
      ? price
      : `₹${Number(price).toLocaleString('en-IN')}`
    : 'Contact for price';

  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        {/* Image Container with Badges */}
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <CoverImage src={image} alt={title} />

          {/* Condition / Category Badge */}
          {condition && (
            <Badge className="absolute left-2.5 top-2.5 border-none bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white shadow-xs">
              {condition}
            </Badge>
          )}

          {/* Featured Badge */}
          {isFeatured && (
            <span className="absolute left-2.5 bottom-2.5 px-2 py-0.5 rounded-md bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase shadow-xs">
              Featured
            </span>
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={toggleFav}
            className="absolute right-2.5 top-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Details & Info */}
        <div className="flex flex-1 flex-col justify-between pt-3 space-y-2">
          <div className="space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                {formattedPrice}
              </span>
              {isVerifiedSeller && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <h4 className="line-clamp-2 text-sm font-bold text-slate-800 transition-colors group-hover:text-[#2563EB]">
              {title}
            </h4>
          </div>
        </div>

        {/* Location & Time Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1 font-medium truncate max-w-[140px]">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{location || 'Calicut'}</span>
          </span>

          {timeAgo ? (
            <span className="flex items-center gap-1 text-slate-400 shrink-0">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </span>
          ) : (
            <span className="font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
              Details &rarr;
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
};

