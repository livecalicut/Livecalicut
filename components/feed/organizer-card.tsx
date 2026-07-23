import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Globe, Phone } from 'lucide-react';

interface OrganizerCardProps {
  name: string;
  avatar?: string;
  description?: string;
  phone?: string;
  email?: string;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  name,
  avatar,
  description = 'Official Kozhikode Cultural Event Host & Promotion Desk',
  phone = '+91 495 270 0000',
}) => {
  return (
    <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold text-cyan-600">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <UserCheck className="w-5 h-5" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
          <p className="text-[11px] text-slate-400">Verified Event Host</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          {phone}
        </span>
        <Button variant="ghost" size="sm" className="text-xs font-semibold text-cyan-600">
          Organizer Profile →
        </Button>
      </div>
    </Card>
  );
};
