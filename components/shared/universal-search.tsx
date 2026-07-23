'use client';

import React, { useState } from 'react';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/Select';
import { CALICUT_LOCATIONS } from '@/config/constants';

interface UniversalSearchProps {
  onSearch?: (query: string, location: string) => void;
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({
  onSearch,
  placeholder = 'Search businesses, Cyberpark jobs, news, marketplace items in Kozhikode...',
  defaultValue = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState(defaultValue);
  const [location, setLocation] = useState('All Locations');
  const [locationsList, setLocationsList] = useState<string[]>(['All Locations']);

  React.useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) {
          setLocationsList(['All Locations', ...json.data.map((a: any) => a.name)]);
        } else {
          setLocationsList([...CALICUT_LOCATIONS]);
        }
      })
      .catch(() => setLocationsList([...CALICUT_LOCATIONS]));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, location);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto h-[60px] p-2 rounded-2xl bg-white border border-[#E5E7EB] shadow-md flex items-center gap-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#2563EB]/30 focus-within:border-[#2563EB] hover:border-[#2563EB]/50"
    >
      {/* Location Selector */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-[13px] text-[#111827] shrink-0 h-[44px]">
        <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
        <Select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-none bg-transparent h-full py-0 px-0 text-[13px] font-bold shadow-none focus:ring-0 focus:outline-none"
        >
          {locationsList.map((loc) => (
            <option key={loc} value={loc} className="bg-white text-[#111827]">
              {loc}
            </option>
          ))}
        </Select>
      </div>

      {/* Input Query */}
      <div className="relative flex-1 h-full flex items-center">
        <Search className="w-4 h-4 absolute left-3 text-[#6B7280] pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="border-none bg-transparent pl-9 pr-3 h-full text-[15px] font-medium focus-visible:ring-0 focus-visible:border-none shadow-none text-[#111827] placeholder:text-[#6B7280]"
        />
      </div>

      {/* Action Submit Button */}
      <Button type="submit" className="h-[44px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl gap-1.5 shrink-0">
        <Sparkles className="w-4 h-4" />
        Search
      </Button>
    </form>
  );
};
