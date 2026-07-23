import { PageHeader } from '@/components/shared/page-header';
import { GalleryComponent } from '@/components/business/gallery-component';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, MapPin, Bookmark } from 'lucide-react';

export default async function ExperienceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const experience = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'SM STREET MALABAR HALWA & CULINARY HERITAGE WALK',
    type: 'Food Trail',
    duration: '2.5 Hours',
    cost: '₹750 per person',
    location: 'Palayam & SM Street, Kozhikode Wards',
    description: `
      Immerse in Kozhikode&apos;s culinary heritage with a 2.5-hour guided food walking trail through Sweetmeat Street (SM Street).
      Sample legendary black & coconut halwas, freshly fried banana chips in coconut oil, unnakkayya snacks, and local Sulaimani tea.
    `,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title={experience.title}
        description={experience.location}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Experiences', href: '/experiences' },
          { label: experience.title },
        ]}
        action={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Bookmark className="w-4 h-4" /> Bookmark Tour
          </Button>
        }
      />

      <GalleryComponent />

      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <Badge variant="purple" className="text-xs">{experience.type}</Badge>
          <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{experience.cost}</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Trail Highlights</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {experience.description}
          </p>
        </div>
      </Card>
    </div>
  );
}
