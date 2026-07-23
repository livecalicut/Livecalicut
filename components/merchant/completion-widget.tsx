import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface CompletionWidgetProps {
  percent?: number;
}

export const CompletionWidget: React.FC<CompletionWidgetProps> = ({ percent = 85 }) => {
  return (
    <Card className="p-4 border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 text-slate-100 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Business Listing Strength
        </div>
        <p className="text-xs text-slate-400">
          Add gallery photos & working hours to reach 100% profile optimization.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="text-2xl font-black text-white">{percent}%</span>
          <p className="text-[10px] text-emerald-400 font-semibold">Verified Merchant</p>
        </div>
        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
      </div>
    </Card>
  );
};
