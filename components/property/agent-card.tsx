import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/business/verified-badge';
import { UserCheck, Phone, Mail } from 'lucide-react';

interface AgentCardProps {
  name: string;
  photo?: string;
  phone: string;
  email?: string;
  agencyName?: string;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  photo,
  phone,
  email,
  agencyName = 'Calicut Prime Real Estate Agency',
}) => {
  return (
    <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold text-cyan-600">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt={name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <UserCheck className="w-6 h-6" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{name}</h4>
          <p className="text-[11px] text-slate-400">{agencyName}</p>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <a href={`tel:${phone}`} className="block">
          <Button variant="default" size="sm" className="w-full gap-2">
            <Phone className="w-4 h-4" /> Call Agent ({phone})
          </Button>
        </a>
      </div>
    </Card>
  );
};
