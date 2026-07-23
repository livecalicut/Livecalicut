import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ShareButtons } from '@/components/shared/share-buttons';
import { MapComponent } from '@/components/business/map-component';
import { OrganizerCard } from '@/components/feed/organizer-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Ticket, ExternalLink, Sparkles } from 'lucide-react';

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const eventData = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'MALABAR LITERATURE & CULTURAL FEST 2026',
    category: 'Festivals & Culture',
    startDate: 'Saturday, July 18, 2026 • 5:00 PM IST',
    endDate: 'Sunday, July 19, 2026 • 10:00 PM IST',
    venue: 'Calicut Beach Freedom Square, Beach Road, Kozhikode',
    googleMapsLink: 'https://maps.google.com',
    registrationLink: 'https://example.com/tickets',
    isTicketRequired: false,
    organizerName: 'Kozhikode Cultural Society & Tourism Development',
    description: `
      Experience the vibrant literary and culinary heritage of Malabar! The 2026 Malabar Literature & Cultural Fest brings together over 80 poets, authors, culinary experts, and artists under one roof at Calicut Beach Freedom Square.
      
      Entry is completely FREE for all citizens. Includes access to live poetry recitals, book launches, traditional Kozhikode Halwa tasting counters, and evening musical fests.
    `,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: eventData.title,
    startDate: '2026-07-18T17:00:00+05:30',
    endDate: '2026-07-19T22:00:00+05:30',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: eventData.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kozhikode',
        addressRegion: 'Kerala',
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: eventData.organizerName,
    },
    description: eventData.description,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Event Schema.org Structured Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={eventData.title}
        description={eventData.venue}
        icon={<Calendar className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'City Events', href: '/events' },
          { label: 'Event Schedule' },
        ]}
        action={<ShareButtons title={eventData.title} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Banner & Description) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full h-64 sm:h-80 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 relative overflow-hidden flex items-center justify-center">
            <span className="text-xs text-[#2563EB] font-bold">Official Event Banner Photography</span>
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-sm">
              {eventData.category}
            </span>
          </div>

          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-[#111827] font-sans">About Kozhikode City Event</h3>
            <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line font-normal">
              {eventData.description}
            </p>

            {eventData.registrationLink && (
              <div className="pt-4 border-t border-[#E5E7EB]">
                <a href={eventData.registrationLink} target="_blank" rel="noopener noreferrer">
                  <Button className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs gap-2 shadow-md">
                    <Ticket className="w-4 h-4" /> Reserve Free Pass / Register Online
                  </Button>
                </a>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar (Schedule, Venue Map, Organizer) */}
        <div className="space-y-6">
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] pb-2 border-b border-[#E5E7EB] font-sans">
              Date & Venue Schedule
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#2563EB] font-bold">
                <Calendar className="w-4.5 h-4.5 shrink-0 text-[#2563EB]" />
                <span>{eventData.startDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#4B5563] font-medium">
                <MapPin className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                <span>{eventData.venue}</span>
              </div>
            </div>
          </Card>

          <OrganizerCard name={eventData.organizerName} />

          <MapComponent locationName={eventData.venue} googleMapsLink={eventData.googleMapsLink} />
        </div>
      </div>
    </div>
  );
}
