import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Hotel, Star, MapPin, ArrowRight } from 'lucide-react';

export default function HotelsDirectoryPage() {
  const sampleHotels = [
    {
      name: 'The Gateway Hotel Beach Road Calicut (Taj)',
      slug: 'gateway-hotel-taj-calicut',
      starRating: 5,
      pricePerNight: '₹6,500',
      location: 'PT Usha Road, Kozhikode Wards',
    },
    {
      name: 'Kappad Beach Resort & Spa',
      slug: 'kappad-beach-resort',
      starRating: 4,
      pricePerNight: '₹4,200',
      location: 'Kappad Historic Beach, Kozhikode',
    },
    {
      name: 'Raviz Kadavu Resort & Ayurvedic Spa',
      slug: 'raviz-kadavu-resort',
      starRating: 5,
      pricePerNight: '₹7,800',
      location: 'Chaliyar River Bank, Calicut',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Hotels, Stays & Beach Resorts"
        description="Luxury 5-star Taj stays, waterfront river resorts on Chaliyar & heritage homestays in Kozhikode."
        icon={<Hotel className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Hotels & Resorts' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        {sampleHotels.map((h) => (
          <Link key={h.slug} href={`/hotels/${h.slug}`} className="block group">
            <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {h.starRating} Star Luxury
                </span>
                <span className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400">{h.pricePerNight} / night</span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                {h.name}
              </h4>
              <p className="text-xs text-slate-500 truncate">{h.location}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
                <span className="text-xs font-bold text-cyan-600 inline-flex items-center gap-1 group-hover:underline">
                  View Resort Rooms <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
