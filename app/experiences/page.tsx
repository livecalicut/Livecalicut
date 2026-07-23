import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function ExperiencesCatalogPage() {
  const experiences = [
    {
      title: 'SM Street Malabar Halwa & Culinary Heritage Walk',
      slug: 'sm-street-halwa-culinary-walk',
      type: 'Food Trail',
      duration: '2.5 Hours',
      cost: '₹750 per person',
      location: 'Palayam & SM Street, Kozhikode',
    },
    {
      title: 'Chaliyar River Backwater Sunset Boat Cruise',
      slug: 'chaliyar-river-backwater-cruise',
      type: 'Boat Ride',
      duration: '1.5 Hours',
      cost: '₹450 per person',
      location: 'Feroke & Chaliyar River, Calicut',
    },
    {
      title: 'Kozhikode Beach Heritage Pier & Sunset Walking Tour',
      slug: 'kozhikode-beach-pier-sunset-walk',
      type: 'Walking Tour',
      duration: '2.0 Hours',
      cost: 'Free Entry Walk',
      location: 'Beach Road, Kozhikode Wards',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Food Trails & Experiential Activities"
        description="Guided SM Street Halwa tasting walks, Chaliyar river backwater cruises & heritage sunset tours."
        icon={<Sparkles className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Experiences' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        {experiences.map((exp) => (
          <Link key={exp.slug} href={`/experiences/${exp.slug}`} className="block group">
            <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple">{exp.type}</Badge>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" /> {exp.duration}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                {exp.title}
              </h4>
              <p className="text-xs text-slate-500 truncate">{exp.location}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{exp.cost}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 group-hover:underline">
                  Tour Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
