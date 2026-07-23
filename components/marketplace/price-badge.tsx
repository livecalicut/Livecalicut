import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Tag } from 'lucide-react';

interface PriceBadgeProps {
  amount: number | string;
  isNegotiable?: boolean;
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({ amount, isNegotiable }) => {
  const formattedPrice = typeof amount === 'number' ? `₹${amount.toLocaleString('en-IN')}` : amount;

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-base sm:text-lg font-black text-cyan-600 dark:text-cyan-400">
        {formattedPrice}
      </span>
      {isNegotiable && (
        <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">
          Negotiable
        </Badge>
      )}
    </div>
  );
};

interface ConditionBadgeProps {
  condition: 'brand_new' | 'like_new' | 'used_good' | 'used_fair' | string;
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition }) => {
  const labels: Record<string, { label: string; variant: 'success' | 'info' | 'secondary' | 'outline' }> = {
    brand_new: { label: 'Brand New', variant: 'success' },
    like_new: { label: 'Like New', variant: 'info' },
    used_good: { label: 'Used - Good', variant: 'secondary' },
    used_fair: { label: 'Used - Fair', variant: 'outline' },
  };

  const item = labels[condition] || { label: condition, variant: 'secondary' as const };

  return <Badge variant={item.variant}>{item.label}</Badge>;
};
