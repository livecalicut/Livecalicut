import React from 'react';
import Link from 'next/link';
import { NewsCard } from '@/components/cards/news-card';
import { EventCard } from '@/components/cards/event-card';
import { SectionTitle } from '@/components/shared/section-title';
import { Card } from '@/components/ui/card';
import {
  Radio,
  Newspaper,
  Calendar,
  Megaphone,
  ArrowRight,
  ExternalLink,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { createPublicClient } from '@/lib/supabase/server';
import { SettingsService } from '@/lib/services/settings.service';
import {
  LIVE_UPDATES_KEY,
  parseStoredLiveUpdates,
  isExternalHref,
  type LiveUpdate,
} from '@/lib/live-updates';

export const revalidate = 60;

const HELPLINE_CONTACTS = [
  { name: 'Kozhikode Municipal Corporation', phone: '0495 2321151', label: 'Civic Desk' },
  { name: 'Calicut District Collectorate', phone: '0495 2371400', label: 'Admin Office' },
  { name: 'KSRTC Kozhikode Bus Terminal', phone: '0495 2723795', label: 'Transit Desk' },
  { name: 'Emergency Response Support System', phone: '112', label: 'Police & Emergency' },
];

export default async function CityFeedPage() {
  let dbNews: any[] = [];
  let dbEvents: any[] = [];
  let dbAnnouncements: any[] = [];
  let liveUpdates: LiveUpdate[] = [];

  // 1. Fetch live updates managed by Super Admin
  try {
    const rawStored = await SettingsService.getSetting(LIVE_UPDATES_KEY);
    const parsed = parseStoredLiveUpdates(rawStored);
    if (parsed && Array.isArray(parsed)) {
      liveUpdates = parsed.filter((i) => i.active);
    }
  } catch {
    // Graceful fallback
  }

  // 2. Fetch real news, events, and announcements from Supabase
  try {
    const supabase = createPublicClient();
    const [newsRes, eventsRes, announcementsRes] = await Promise.all([
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
      supabase
        .from('announcements')
        .select('id, title, content, created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if (newsRes.data && newsRes.data.length > 0) {
      dbNews = newsRes.data;
    }
    if (eventsRes.data && eventsRes.data.length > 0) {
      dbEvents = eventsRes.data;
    }
    if (announcementsRes.data && announcementsRes.data.length > 0) {
      dbAnnouncements = announcementsRes.data;
    }
  } catch {
    // Supabase optional fallback
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Header with Real-time Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-black text-[11px] tracking-wider uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600" /> Live Feed • Calicut Municipal Wards
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calicut Live City Updates
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time municipal bulletins, community notices, verified local news &amp; cultural events.
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

      {/* Real-time Live Updates Stream (Managed via Super Admin at /admin/live-updates) */}
      {liveUpdates.length > 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 border border-blue-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-blue-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2563EB]" />
              </span>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Active City Bulletins &amp; Live Updates
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              Verified by LiveCalicut Admin Desk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {liveUpdates.map((item) => {
              const isExternal = isExternalHref(item.href);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    </div>
                    {item.detail && (
                      <p className="text-xs text-slate-600 leading-relaxed pl-3">
                        {item.detail}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                    {isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        <span>{item.cta || 'Learn more'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        <span>{item.cta || 'Learn more'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Section: Editorial News & Civic Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): News & Events */}
        <div className="lg:col-span-2 space-y-8">
          {/* Editorial News Grid */}
          <div className="space-y-4">
            <SectionTitle
              title="Editorial News Stream"
              subtitle="Verified municipal reports and ward journalism"
              viewAllHref="/news"
            />

            {dbNews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-2">
                <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No Editorial Articles Published Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Municipal notices, verified ward updates, and community journalism will appear here as they are published.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <span>Submit a news tip or story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {dbNews.map((item) => (
                  <NewsCard
                    key={item.id}
                    title={item.title}
                    excerpt={item.summary || item.content?.slice(0, 120) || 'Verified local report from Calicut.'}
                    category={item.news_categories?.name || item.category || 'City Updates'}
                    timeAgo={new Date(item.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                    image={item.cover_image || item.image_url || '/heroes/city-market.jpg'}
                    href={`/news/${item.slug || item.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming City Events */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <SectionTitle
              title="Upcoming City Events"
              subtitle="Cultural gatherings, fests &amp; tech meetups across Calicut"
              viewAllHref="/events"
            />

            {dbEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No Upcoming Events Scheduled</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Local tech meetups, culinary festivals, and cultural events will be listed as organizers announce dates.
                </p>
                <div className="pt-2">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                  >
                    <span>Browse event calendar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dbEvents.map((evt) => (
                  <EventCard
                    key={evt.id}
                    title={evt.title}
                    date={
                      evt.start_date
                        ? new Date(evt.start_date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })
                        : 'Upcoming'
                    }
                    venue={evt.venue || 'Calicut'}
                    category={evt.category || 'Event'}
                    image={evt.cover_image || '/heroes/kerala-coast.jpg'}
                    href={`/events/${evt.slug || evt.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Civic Notices & Helplines */}
        <div className="space-y-6">
          {/* Government & Civic Notices */}
          <Card className="p-5 border border-slate-200/90 bg-white rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Government &amp; Civic Notices
                </h3>
                <p className="text-[11px] text-slate-400">Official district communications</p>
              </div>
            </div>

            {dbAnnouncements.length > 0 ? (
              <div className="space-y-3">
                {dbAnnouncements.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                        Notice
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {new Date(notice.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs">{notice.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      {notice.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Active Civic Advisories</p>
                <p className="text-[11px] text-slate-400">All public services operating on regular schedules.</p>
              </div>
            )}
          </Card>

          {/* Official Calicut City Helplines */}
          <Card className="p-5 border border-slate-200/90 bg-white rounded-3xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Phone className="w-4 h-4 text-[#2563EB]" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Calicut Helplines
              </h4>
            </div>

            <div className="space-y-2">
              {HELPLINE_CONTACTS.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px]">{c.name}</p>
                    <p className="text-[10px] text-slate-400">{c.label}</p>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/[^0-9]/g, '')}`}
                    className="font-bold text-[#2563EB] hover:underline"
                  >
                    {c.phone}
                  </a>
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
