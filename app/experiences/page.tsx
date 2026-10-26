'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Compass, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export default function ExperiencesCatalogPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/explore')
      .then((r) => r.json())
      .then((json) => setExperiences(json?.data?.experiences || []))
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="py-6 sm:py-10 space-y-8">
      <PageHeader
        title="Food Trails & Experiential Activities"
        description="Guided SM Street Halwa tasting walks, Chaliyar river backwater cruises & heritage sunset tours in Calicut."
        icon={<Compass className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Experiences' },
        ]}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-[#6B7280]">
          <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
          <span className="text-sm font-medium">Loading experiences...</span>
        </div>
      ) : experiences.length === 0 ? (
        <EmptyState
          icon={<Compass className="w-8 h-8 text-[#2563EB]" />}
          title="No experiences listed yet"
          description="There are currently no guided tours or experiential activities scheduled. Check out places to visit in Calicut."
          actionLabel="Explore Places"
          actionHref="/explore"
        />
      ) : (
        <ResponsiveGrid cols={3}>
          {experiences.map((exp) => (
            <Link key={exp.slug || exp.id} href={`/experiences/${exp.slug || exp.id}`} className="block group">
              <Card className="p-5 border border-slate-200 bg-white hover:shadow-lg rounded-2xl transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="purple">{exp.type || exp.category || 'Experience'}</Badge>
                  {exp.duration && (
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> {exp.duration}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                  {exp.title}
                </h4>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {exp.location || 'Calicut'}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-extrabold text-[#2563EB]">{exp.cost || 'Free Entry'}</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1 group-hover:underline">
                    Tour Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </ResponsiveGrid>
      )}
    </Container>
  );
}
