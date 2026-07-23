import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap } from 'lucide-react';

interface PlanPricingCardProps {
  name: string;
  slug: string;
  monthlyPrice: number;
  features: string[];
  isPopular?: boolean;
}

export const PlanPricingCard: React.FC<PlanPricingCardProps> = ({
  name,
  slug,
  monthlyPrice,
  features,
  isPopular = false,
}) => {
  return (
    <Card
      className={`p-6 space-y-6 surface-card border transition-all ${
        isPopular
          ? 'border-cyan-500 bg-gradient-to-b from-slate-900 via-cyan-950/20 to-slate-900 shadow-xl shadow-cyan-500/10'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
      }`}
    >
      <div className="space-y-2">
        {isPopular && <Badge variant="purple">MOST POPULAR IN KOZHIKODE</Badge>}
        <h3 className="text-xl font-black text-slate-900 dark:text-white">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">
            {monthlyPrice === 0 ? 'Free' : `₹${monthlyPrice.toLocaleString('en-IN')}`}
          </span>
          {monthlyPrice > 0 && <span className="text-xs text-slate-400">/ month</span>}
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Link href={`/billing/checkout/${slug}`}>
          <Button variant={isPopular ? 'default' : 'outline'} className="w-full gap-2">
            <Zap className="w-4 h-4" /> Select {name} Plan
          </Button>
        </Link>
      </div>
    </Card>
  );
};
