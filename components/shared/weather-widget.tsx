import React from 'react';
import { Sun, CloudSun, Compass } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 backdrop-blur-md">
      <CloudSun className="w-4 h-4 text-amber-500 animate-pulse" />
      <span>Kozhikode 29°C • Sunny Coastal</span>
      <span className="text-[10px] opacity-70">Humid 76%</span>
    </div>
  );
};
