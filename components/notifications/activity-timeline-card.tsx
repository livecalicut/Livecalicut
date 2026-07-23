import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock } from 'lucide-react';

interface ActivityTimelineCardProps {
  actorName: string;
  actionType: string;
  description: string;
  timestamp: string;
}

export const ActivityTimelineCard: React.FC<ActivityTimelineCardProps> = ({
  actorName,
  actionType,
  description,
  timestamp,
}) => {
  return (
    <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="uppercase text-[10px] font-bold">
            {actionType}
          </Badge>
          <span className="text-xs font-bold text-slate-900 dark:text-white">{actorName}</span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-cyan-600" /> {timestamp}
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>
    </Card>
  );
};
