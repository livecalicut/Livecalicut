import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowUpRight } from 'lucide-react';
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
  return (
    <Link href={href} className="group block h-full">
      <Card className="surface-card flex h-full flex-col justify-between space-y-4 p-4 transition-all duration-200">
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-xl">
          <CoverImage src={image} alt={title} />
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="border border-blue-200 bg-blue-50 text-[10px] font-bold uppercase text-[#2563EB]"
              >
                {category}
              </Badge>
              <span className="flex items-center gap-1 text-[13px] font-medium text-[#6B7280]">
                <Clock className="h-3.5 w-3.5 text-[#2563EB]" /> {timeAgo}
              </span>
            </div>

            <h4 className="line-clamp-2 text-[18px] font-bold leading-snug text-[#111827] transition-colors group-hover:text-[#2563EB]">
              {title}
            </h4>

            <p className="line-clamp-3 text-[15px] leading-relaxed text-[#6B7280]">{excerpt}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-end border-t border-[#E5E7EB] pt-3">
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#2563EB]">
            Read <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
