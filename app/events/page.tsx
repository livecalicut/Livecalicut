'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EventCard } from '@/components/cards/event-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { CategoryPills } from '@/components/feed/category-pills';
import { Container } from '@/components/layout/container';
import { Calendar, Search, Filter, Sparkles, MapPin, Ticket } from 'lucide-react';

export default function EventsListingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('All');

  const eventCategories = [
    { id: 'all', name: 'All Events', slug: '' },
    { id: 'festival', name: 'Festivals & Fests', slug: 'festival' },
    { id: 'workshop', name: 'Workshops & Training', slug: 'workshop' },
    { id: 'meetup', name: 'Tech & Meetups', slug: 'meetup' },
    { id: 'conference', name: 'Conferences', slug: 'conference' },
    { id: 'exhibition', name: 'Exhibitions & Trade', slug: 'exhibition' },
    { id: 'concert', name: 'Concerts & Music', slug: 'concert' },
    { id: 'sports', name: 'Sports Events', slug: 'sports' },
  ];

  const sampleEvents = [
    {
      id: '1',
      title: 'Malabar Literature & Cultural Fest 2026',
      date: 'Sat, 18 Jul • 5:00 PM',
      venue: 'Calicut Beach Freedom Square',
      category: 'Festivals & Fests',
      isFree: true,
    },
    {
      id: '2',
      title: 'Cyberpark Tech Developers Summit 2026',
      date: 'Sun, 26 Jul • 10:00 AM',
      venue: 'Sahya Building Auditorium, Cyberpark',
      category: 'Tech & Meetups',
      isFree: false,
    },
    {
      id: '3',
      title: 'Beypore Water Fest & Boat Race 2026',
      date: 'Fri, 31 Jul • 09:00 AM',
      venue: 'Beypore Marina Harbour',
      category: 'Festivals & Fests',
      isFree: true,
    },
    {
      id: '4',
      title: 'Mananchira Evening Gazal & Poetry Session',
      date: 'Sat, 01 Aug • 6:30 PM',
      venue: 'Open Stage, Mananchira Square',
      category: 'Concerts & Music',
      isFree: true,
    },
  ];

  const filteredEvents = sampleEvents.filter((evt) => {
    const matchesCat = !selectedCategory || evt.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesCat;
  });

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode City Events Calendar"
        description="Discover upcoming cultural fests, literary gatherings, food expos & tech meetups across Calicut."
        icon={<Calendar className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[{ label: 'City Events' }]}
      />

      {/* Date Shortcuts & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryPills
          categories={eventCategories}
          selectedCategory={selectedCategory || undefined}
          onSelectCategory={(slug) => setSelectedCategory(slug || null)}
        />

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-[#6B7280]" />
          <span className="font-bold text-[#111827]">Filter Schedule:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-[38px] px-3.5 rounded-2xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] focus:outline-none"
          >
            <option value="All">All Upcoming</option>
            <option value="Today">Today's Events</option>
            <option value="Weekend">This Weekend</option>
            <option value="Free">Free Entrance Only</option>
          </select>
        </div>
      </div>

      {/* Event Cards Grid */}
      <ResponsiveGrid cols={3}>
        {filteredEvents.map((evt) => (
          <EventCard
            key={evt.id}
            title={evt.title}
            date={evt.date}
            venue={evt.venue}
            category={evt.category}
          />
        ))}
      </ResponsiveGrid>
    </Container>
  );
}
