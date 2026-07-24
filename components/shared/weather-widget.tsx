import React from 'react';
import { CloudSun } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#374151] backdrop-blur-sm">
      <CloudSun className="h-3.5 w-3.5 text-amber-500" />
      <span>Kozhikode 29°C</span>
      <span className="font-medium text-[#6B7280]">Sunny · 78% humidity</span>
    </div>
  );
};
