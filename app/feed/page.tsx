import { PageHeader } from '@/components/shared/page-header';
import { BreakingNewsBanner } from '@/components/feed/breaking-news-banner';
import { NewsCard } from '@/components/cards/news-card';
import { EventCard } from '@/components/cards/event-card';
import { SectionTitle } from '@/components/shared/section-title';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Activity, Newspaper, Calendar, Megaphone, Flame } from 'lucide-react';

export default function CityFeedPage() {
  const newsList = [
    {
      id: '1',
      title: 'Kozhikode Beach Promenade Renovation Completed',
      excerpt: 'New eco-friendly seating, decorative lighting, and street food stalls opened for tourists.',
      category: 'Infrastructure',
      timeAgo: '2 hours ago',
    },
    {
      id: '2',
      title: 'Mittai Theruvu Pedestrian Night Corridor Expansion Approved',
      excerpt: 'Traffic diversions announced for SM Street to promote heritage walking tourism.',
      category: 'City Updates',
      timeAgo: '4 hours ago',
    },
  ];

  const eventsList = [
    {
      id: '1',
      title: 'Malabar Food & Culinary Expo 2026',
      date: 'Sat, 18 Jul • 5:00 PM',
      venue: 'Calicut Trade Centre, Swapnagari',
      category: 'Food & Culture',
    },
    {
      id: '2',
      title: 'Cyberpark Tech Developers Summit 2026',
      date: 'Sun, 26 Jul • 10:00 AM',
      venue: 'Sahya Building Auditorium, Cyberpark',
      category: 'Tech Meetups',
    },
  ];

  return (
    <div className="space-y-10 py-4">
      <PageHeader
        title="Kozhikode Live City Feed"
        description="Your personalized stream of breaking local news, cultural fests, traffic notices & community highlights."
        icon={<Activity className="w-6 h-6" />}
        breadcrumbs={[{ label: 'City Feed' }]}
      />

      {/* Breaking Priority Alerts Banner */}
      <BreakingNewsBanner />

      {/* Main Section: News & Events Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Breaking & Editorial News */}
          <div className="space-y-4">
            <SectionTitle
              title="Editorial News Stream"
              subtitle="Verified news breaking across Kozhikode Wards"
              viewAllHref="/news"
            />
            <ResponsiveGrid cols={2}>
              {newsList.map((item) => (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  excerpt={item.excerpt}
                  category={item.category}
                  timeAgo={item.timeAgo}
                />
              ))}
            </ResponsiveGrid>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-4">
            <SectionTitle
              title="Upcoming City Events"
              subtitle="Cultural gatherings, fests & tech meetups"
              viewAllHref="/events"
            />
            <ResponsiveGrid cols={2}>
              {eventsList.map((evt) => (
                <EventCard
                  key={evt.id}
                  title={evt.title}
                  date={evt.date}
                  venue={evt.venue}
                  category={evt.category}
                />
              ))}
            </ResponsiveGrid>
          </div>
        </div>

        {/* Right Column: Government Notices & Community Feed */}
        <div className="space-y-6">
          <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Megaphone className="w-4 h-4 text-amber-500" />
              Government & Traffic Notices
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Water Supply Maintenance</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Pipeline repair in Palayam & Kallai Wards on Wednesday 9 AM - 4 PM.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">KSRTC Bus Terminal Route Update</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  New express buses added to Cyberpark Bypass route during peak hours.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
