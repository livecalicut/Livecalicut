import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, Compass } from 'lucide-react';

interface PlaceCardProps {
  title: string;
  slug: string;
  category: string;
  location: string;
  rating: number;
  entryFee?: string;
  openingHours?: string;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  title,
  slug,
  category,
  location,
  rating,
  entryFee = 'Free Entry',
  openingHours = '09:00 AM - 07:00 PM',
}) => {
  return (
    <Link href={`/places/${slug}`} className="block group">
      <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
        <div className="w-full h-40 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-shimmer flex items-center justify-center text-xs text-slate-400 font-medium">
          Place Photo
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Badge variant="purple" className="text-[10px] uppercase font-bold">{category}</Badge>
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating} ★
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors line-clamp-1">
            {title}
          </h4>
          <p className="text-xs text-slate-500 truncate">{location}</p>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {openingHours}</span>
          <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{entryFee}</span>
        </div>
      </Card>
    </Link>
  );
};
