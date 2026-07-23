import React from 'react';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, Zap, Star } from 'lucide-react';

interface SalaryBadgeProps {
  amount: string;
}

export const SalaryBadge: React.FC<SalaryBadgeProps> = ({ amount }) => {
  return (
    <Badge variant="success" className="gap-1 shadow-sm font-bold">
      <IndianRupee className="w-3 h-3" /> {amount}
    </Badge>
  );
};

export const UrgentBadge: React.FC = () => {
  return (
    <Badge variant="destructive" className="gap-1 animate-pulse font-extrabold uppercase text-[10px]">
      <Zap className="w-3 h-3 fill-white" /> Hiring Immediately
    </Badge>
  );
};

export const FeaturedBadge: React.FC = () => {
  return (
    <Badge variant="purple" className="gap-1 font-bold">
      <Star className="w-3 h-3 fill-purple-400" /> Featured Position
    </Badge>
  );
};
