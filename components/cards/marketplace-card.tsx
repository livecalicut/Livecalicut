import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface MarketplaceCardProps {
  title: string;
  price: string;
  condition: string;
  location: string;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  title,
  price,
  condition,
  location,
}) => {
  return (
    <Link href="/marketplace" className="block group h-full">
      <Card className="h-full flex flex-col justify-between p-4 space-y-4 surface-card transition-all duration-200">
        {/* Photo Container - Fixed 180px */}
        <div className="w-full h-[180px] rounded-xl bg-[#F8FAFC] overflow-hidden relative shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-[#2563EB]/10 to-slate-200/50 flex items-center justify-center text-xs text-[#6B7280] font-medium group-hover:scale-105 transition-transform duration-300">
            <span>Classified Item</span>
          </div>
          <Badge variant="secondary" className="absolute top-2.5 right-2.5 bg-slate-900/80 text-white border-none text-[10px] font-bold shadow-sm">
            {condition || 'Like New'}
          </Badge>
        </div>

        {/* Flexible Content */}
        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-[18px] font-black text-[#2563EB] block">
              {price}
            </span>

            <h4 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
              {title}
            </h4>
          </div>
        </div>

        {/* Pinned Footer */}
        <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="truncate">{location}</span>
          </span>
          <span className="font-bold text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
            Details →
          </span>
        </div>
      </Card>
    </Link>
  );
};
