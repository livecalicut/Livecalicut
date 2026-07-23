import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'info' | 'purple' | 'warning';
  href: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  icon,
  badge,
  badgeVariant = 'info',
  href,
}) => {
  return (
    <Link href={href} className="block group h-full">
      <Card className="h-full flex flex-col justify-between p-5 surface-card transition-all duration-200">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] group-hover:scale-110 transition-transform shadow-sm">
              {icon}
            </div>
            {badge && (
              <Badge variant={badgeVariant} className="text-[10px] font-bold uppercase">
                {badge}
              </Badge>
            )}
          </div>

          <h3 className="text-[18px] font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors leading-snug">
            {title}
          </h3>

          <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[13px] font-bold text-[#2563EB]">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
