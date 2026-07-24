import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { CoverImage } from '@/components/shared/cover-image';

interface MarketplaceCardProps {
  title: string;
  price: string;
  condition: string;
  location: string;
  image?: string | null;
  href?: string;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  title,
  price,
  condition,
  location,
  image,
  href = '/marketplace',
}) => {
  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between space-y-4 p-4 transition-all duration-200">
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-xl">
          <CoverImage src={image} alt={title} />
          <Badge className="absolute right-2.5 top-2.5 border-none bg-slate-900/80 text-[10px] font-bold text-white shadow-sm">
            {condition || 'Like New'}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="block text-[18px] font-black text-[#2563EB]">{price}</span>
            <h4 className="line-clamp-2 text-[18px] font-bold leading-snug text-[#111827] transition-colors group-hover:text-[#2563EB]">
              {title}
            </h4>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-[13px] text-[#6B7280]">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
            <span className="truncate">{location}</span>
          </span>
          <span className="font-bold text-[#2563EB] transition-transform group-hover:translate-x-0.5">
            Details →
          </span>
        </div>
      </Card>
    </Link>
  );
};
