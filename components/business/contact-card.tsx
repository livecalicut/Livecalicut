import React from 'react';
import { Card } from '@/components/ui/card';
import { Phone, MessageSquare, Mail, Globe, Clock } from 'lucide-react';

interface ContactCardProps {
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  phone,
  whatsapp,
  email,
  website,
}) => {
  return (
    <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
        Store Contacts & Desk
      </h4>

      <div className="space-y-3 text-xs">
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 text-slate-800 dark:text-slate-200 transition-colors"
        >
          <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div>
            <p className="text-[10px] text-slate-400">Direct Phone Desk</p>
            <p className="font-bold">{phone}</p>
          </div>
        </a>

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] opacity-80">WhatsApp Enquiries</p>
              <p className="font-bold">{whatsapp}</p>
            </div>
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400">Official Email</p>
              <p className="font-bold truncate">{email}</p>
            </div>
          </a>
        )}

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <div className="truncate">
              <p className="text-[10px] text-slate-400">Official Website</p>
              <p className="font-bold truncate">{website}</p>
            </div>
          </a>
        )}
      </div>
    </Card>
  );
};
