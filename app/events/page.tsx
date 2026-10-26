'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { EventCard } from '@/components/cards/event-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { CategoryPills } from '@/components/feed/category-pills';
import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/shared/empty-state';
import { Calendar, Filter, Loader2, Search } from 'lucide-react';

export default function EventsListingPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('All');
  const [search, setSearch] = useState('');

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

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((json) => setEvents(json?.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter((evt) => {
    const catName = evt.event_categories?.name || evt.category || '';
    const matchesCat = !selectedCategory || catName.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !search ||
      evt.title?.toLowerCase().includes(search.toLowerCase()) ||
      evt.venue?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Calicut City Events Calendar"
        description="Discover upcoming cultural fests, literary gatherings, food expos & meetups across Calicut."
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

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading upcoming events...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8 text-[#2563EB]" />}
          title="No upcoming events found"
          description="There are currently no events matching your selected filter. Be the first to list an event in Calicut."
          actionLabel="Explore All Categories"
          actionHref="/explore"
        />
      ) : (
        <ResponsiveGrid cols={3}>
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              title={evt.title}
              date={evt.start_date ? new Date(evt.start_date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Upcoming'}
              venue={evt.venue || 'Calicut'}
              category={evt.event_categories?.name || evt.category || 'Event'}
            />
          ))}
        </ResponsiveGrid>
      )}
    </Container>
  );
}
