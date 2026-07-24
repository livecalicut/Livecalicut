'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
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
      className="mx-auto flex h-[56px] w-full max-w-3xl items-center gap-1.5 rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] transition-all duration-200 focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/20"
    >
      <div className="hidden h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 text-[13px] text-[#111827] sm:flex">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
        <Select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-full border-none bg-transparent px-0 py-0 text-[13px] font-semibold shadow-none focus:outline-none focus:ring-0"
        >
          {locationsList.map((loc) => (
            <option key={loc} value={loc} className="bg-white text-[#111827]">
              {loc}
            </option>
          ))}
        </Select>
      </div>

      <div className="relative flex h-full flex-1 items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[#9CA3AF]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-full border-none bg-transparent pl-9 pr-3 text-[14px] font-medium text-[#111827] shadow-none placeholder:text-[#9CA3AF] focus-visible:border-none focus-visible:ring-0 sm:text-[15px]"
        />
      </div>

      <Button
        type="submit"
        className="h-[42px] shrink-0 gap-1.5 rounded-xl bg-[#2563EB] px-4 font-semibold text-white hover:bg-[#1D4ED8] sm:px-5"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};
