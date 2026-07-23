import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Crown } from 'lucide-react';

export const VerifiedBadge: React.FC = () => {
  return (
    <Badge variant="success" className="gap-1 shadow-sm font-semibold">
      <CheckCircle2 className="w-3 h-3" /> Verified Business
    </Badge>
  );
};

export const PremiumBadge: React.FC = () => {
  return (
    <Badge variant="warning" className="gap-1 shadow-sm font-semibold">
      <Crown className="w-3 h-3 text-amber-500 fill-amber-500" /> Premium Partner
    </Badge>
  );
};
