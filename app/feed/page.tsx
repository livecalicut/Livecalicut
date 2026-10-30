import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { NewsCard } from '@/components/cards/news-card';
import { EventCard } from '@/components/cards/event-card';
import { SectionTitle } from '@/components/shared/section-title';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import {
  Activity,
  Newspaper,
  Calendar,
  Megaphone,
  Radio,
  Clock,
  ArrowRight,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';

export const revalidate = 60;

const CURATED_NEWS = [
  {
    id: '1',
    title: 'Mittai Theruvu (SM Street) Night Heritage Corridor Expansion Approved',
    excerpt: 'Municipal Corporation approves vehicular restriction after 7 PM to promote heritage pedestrian tourism and local sweet shops.',
    category: 'City Updates',
    timeAgo: '2 hours ago',
    image: '/heroes/city-market.jpg',
    href: '/news/sm-street-night-corridor',
  },
  {
    id: '2',
    title: 'Cyberpark Kerala Developers Summit: 1,200+ IT Vacancies Announced',
    excerpt: 'Top software and fintech startups in Calicut Cyberpark announce massive hiring drive for developers and product designers.',
    category: 'Technology & Jobs',
    timeAgo: '4 hours ago',
    image: '/heroes/workplace.jpg',
    href: '/news/cyberpark-hiring-drive',
  },
  {
    id: '3',
    title: 'Malabar Traditional Culinary & Food Heritage Expo at Swapnagari',
    excerpt: 'Three-day gastronomic celebration featuring over 80 authentic Malabar dishes, live cooking demos, and local masterchefs.',
    category: 'Food & Culture',
    timeAgo: '6 hours ago',
    image: '/heroes/malabar-food.jpg',
    href: '/news/malabar-food-festival',
  },
  {
    id: '4',
    title: 'Kozhikode Coastal High Tide Notice & Marine Fishermen Advisory',
    excerpt: 'District disaster management authority issues precautionary advisory for coastal stretches from Beypore to Kappad.',
    category: 'Weather & Safety',
    timeAgo: 'Yesterday',
    image: '/heroes/coastal-life.jpg',
    href: '/news/coastal-weather-advisory',
  },
];

const CURATED_EVENTS = [
  {
    id: '1',
    title: 'Malabar Food & Culinary Expo 2026',
    date: 'Sat, 18 Jul • 5:00 PM',
    venue: 'Calicut Trade Centre, Swapnagari',
    category: 'Food & Culture',
    image: '/heroes/malabar-food.jpg',
    href: '/events',
  },
  {
    id: '2',
    title: 'Cyberpark Tech Developers Summit 2026',
    date: 'Sun, 26 Jul • 10:00 AM',
    venue: 'Sahya Building Auditorium, Cyberpark',
    category: 'Tech Meetups',
    image: '/heroes/workplace.jpg',
    href: '/events',
  },
  {
    id: '3',
    title: 'Calicut Beach Sunset Music & Arts Carnival',
    date: 'Fri, 31 Jul • 6:00 PM',
    venue: 'Open Air Theatre, Calicut Beach',
    category: 'Arts & Music',
    image: '/heroes/lighthouse-coast.jpg',
    href: '/events',
  },
];

const CIVIC_NOTICES = [
  {
    id: '1',
    title: 'Water Supply Maintenance Schedule',
    desc: 'Pipeline repair works in Palayam & Kallai Wards on Wednesday 9:00 AM – 4:00 PM. Residents advised to store water.',
    tag: 'Water Authority',
    time: 'Valid Today',
  },
  {
    id: '2',
    title: 'KSRTC Cyberpark Express Buses Added',
    desc: 'New fast express buses introduced connecting Kozhikode Railway Station to Cyberpark Bypass during peak hours.',
    tag: 'Public Transport',
    time: 'Immediate',
  },
  {
    id: '3',
    title: 'Kozhikode Corporation Digital Tax Rebate',
    desc: '5% rebate announced for commercial property owners clearing annual municipal dues via the online portal.',
    tag: 'Municipal Corp',
    time: 'Till 15 Nov',
  },
];

export default async function CityFeedPage() {
  let dbNews: any[] = [];
  let dbEvents: any[] = [];

  try {
    const supabase = createPublicClient();
    const [newsRes, eventsRes] = await Promise.all([
      supabase
        .from('news')
        .select('id, title, slug, summary, content, category, cover_image, image_url, created_at, news_categories(name)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('events')
        .select('id, title, slug, venue, start_date, category, cover_image')
        .is('deleted_at', null)
        .order('start_date', { ascending: true })
        .limit(4),
    ]);

    if (newsRes.data && newsRes.data.length > 0) {
      dbNews = newsRes.data;
    }
    if (eventsRes.data && eventsRes.data.length > 0) {
      dbEvents = eventsRes.data;
    }
  } catch {
    // Supabase optional fallback
  }

  const newsFeed = dbNews.length > 0
    ? dbNews.map((n: any, idx: number) => ({
        id: n.id,
        title: n.title,
        excerpt: n.summary || n.content?.slice(0, 120) || 'Verified local report from Calicut municipal wards.',
        category: n.news_categories?.name || n.category || 'City Updates',
        timeAgo: 'Recently',
        image: n.cover_image || n.image_url || CURATED_NEWS[idx % CURATED_NEWS.length].image,
        href: `/news/${n.slug || n.id}`,
      }))
    : CURATED_NEWS;

  const eventsFeed = dbEvents.length > 0
    ? dbEvents.map((e: any, idx: number) => ({
        id: e.id,
        title: e.title,
        date: e.start_date ? new Date(e.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Upcoming',
        venue: e.venue || 'Calicut',
        category: e.category || 'Event',
        image: e.cover_image || CURATED_EVENTS[idx % CURATED_EVENTS.length].image,
        href: `/events/${e.slug || e.id}`,
      }))
    : CURATED_EVENTS;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Header with Live Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-black text-[11px] tracking-wider uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> Live Feed • 21 Spatial Wards
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calicut Live City Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time municipal advisories, breaking regional stories, cultural fests &amp; traffic alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <Newspaper className="w-3.5 h-3.5 text-slate-600" />
            <span>All News</span>
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>City Events</span>
          </Link>
        </div>
      </div>

      {/* Emergency Alert Ticker */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-md bg-white text-rose-700 font-black text-[10px] uppercase tracking-wider mr-2">
              Alert
            </span>
            <span className="text-xs sm:text-sm font-bold">
              Calicut District Admin Issues Coastal High Tide &amp; Rain Advisory for Next 24 Hours
            </span>
          </div>
        </div>
        <Link
          href="/news/coastal-weather-advisory"
          className="inline-flex items-center gap-1 text-xs font-bold text-white/95 hover:text-white underline shrink-0"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Spotlight Hero Article */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-950 group">
        <div className="relative w-full h-80 sm:h-96 overflow-hidden">
          <img
            src="/heroes/calicut-hero.jpg"
            alt="Calicut Beach Waterfront Renovation"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-3 text-white">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-[#2563EB] text-white font-black text-[10px] uppercase tracking-wider shadow-xs">
              Top Story
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white font-semibold text-xs">
              Infrastructure &amp; Tourism
            </span>
            <span className="text-xs text-white/80">• 2 hours ago</span>
          </div>

          <Link href="/news/calicut-beach-promenade-renovation">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white hover:text-blue-300 transition-colors">
              Calicut Beach Promenade Phase 2 Renovation Opens for Public
            </h2>
          </Link>

          <p className="text-xs sm:text-sm text-white/90 max-w-3xl line-clamp-2 leading-relaxed">
            The District Administration and Tourism Department inaugurated the newly paved pedestrian strip, eco-friendly benches, and organized Malabar culinary stalls along Beach Road.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/news/calicut-beach-promenade-renovation"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-md"
            >
              <span>Read Full Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Section: Editorial News & Civic Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Curated Stories & Upcoming Events */}
        <div className="lg:col-span-2 space-y-8">
          {/* Breaking & Editorial News Grid */}
          <div className="space-y-4">
            <SectionTitle
              title="Editorial News Stream"
              subtitle="Verified municipal reports and ward journalism"
              viewAllHref="/news"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {newsFeed.map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  category={item.category}
                  timeAgo={item.timeAgo}
                  image={item.image}
                  href={item.href}
                />
              ))}
            </div>
          </div>

          {/* Upcoming City Events */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <SectionTitle
              title="Upcoming City Events"
              subtitle="Cultural gatherings, fests &amp; tech meetups across Calicut"
              viewAllHref="/events"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {eventsFeed.map((evt) => (
                <EventCard
                  key={evt.id}
                  title={evt.title}
                  date={evt.date}
                  venue={evt.venue}
                  category={evt.category}
                  image={evt.image}
                  href={evt.href}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Civic Notices & Community Ticker */}
        <div className="space-y-6">
          {/* Civic & Government Notices */}
          <Card className="p-5 border border-slate-200/90 bg-white rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Government &amp; Civic Notices
                </h3>
                <p className="text-[11px] text-slate-400">Verified official updates</p>
              </div>
            </div>

            <div className="space-y-3">
              {CIVIC_NOTICES.map((notice) => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                      {notice.tag}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{notice.time}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{notice.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    {notice.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Submission CTA */}
          <Card className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 space-y-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-md">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">Got Local News or an Event?</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Publish local happenings, business launches, or community notices directly to LiveCalicut.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Submit Story / Announcement
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
