import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MapComponentProps {
  locationName: string;
  latitude?: number;
  longitude?: number;
  googleMapsLink?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  locationName,
  googleMapsLink = 'https://maps.google.com',
}) => {
  return (
    <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
      <div className="w-full h-48 rounded-xl bg-slate-100 dark:bg-slate-800/80 animate-shimmer flex flex-col items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/80 text-center p-4">
        <MapPin className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-bounce" />
        <span className="text-xs font-bold text-slate-900 dark:text-white">{locationName}</span>
        <span className="text-[10px] text-slate-400">Google Maps Spatial Location Bounds</span>
      </div>

      <a
        href={googleMapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-colors"
      >
        <span>Open in Google Maps Navigation</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </Card>
  );
};
