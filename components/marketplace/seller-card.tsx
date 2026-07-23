import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/business/verified-badge';
import { User, Phone, MessageSquare } from 'lucide-react';

interface SellerCardProps {
  fullName: string;
  avatar?: string;
  phone: string;
  whatsapp?: string;
  isVerified?: boolean;
}

export const SellerCard: React.FC<SellerCardProps> = ({
  fullName,
  avatar,
  phone,
  whatsapp,
  isVerified = true,
}) => {
  return (
    <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold text-cyan-600">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={fullName} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{fullName}</h4>
          {isVerified && <VerifiedBadge />}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <a href={`tel:${phone}`} className="block">
          <Button variant="default" size="sm" className="w-full gap-2">
            <Phone className="w-4 h-4" /> Call Seller Desk ({phone})
          </Button>
        </a>

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" size="sm" className="w-full gap-2 text-emerald-600 border-emerald-300">
              <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp Direct Chat
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
};
