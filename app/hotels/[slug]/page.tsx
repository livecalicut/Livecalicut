import { PageHeader } from '@/components/shared/page-header';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Phone, Globe, Sparkles } from 'lucide-react';

export default async function HotelDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const hotel = {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'THE GATEWAY HOTEL BEACH ROAD (TAJ)',
    location: 'PT Usha Road, Kozhikode Wards',
    starRating: 5,
    startingPrice: '₹6,500 / night',
    phone: '+91 495 661 3000',
    website: 'https://tajhotels.com',
    amenities: ['Ayurvedic Spa & Wellness', 'Swimming Pool', 'Seafood Specialty Dining', 'Ocean View Balconies', 'Conference Center'],
    description: `
      Experience Taj hospitality at The Gateway Hotel Beach Road, Kozhikode.
      Nestled near historic sea pier waterfront, offering Ayurvedic wellness treatments, outdoor pool, and authentic Malabar seafood dining.
    `,
  };

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title={hotel.name}
        description={hotel.location}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Hotels', href: '/hotels' },
          { label: hotel.name },
        ]}
        action={
          <a href={`tel:${hotel.phone}`}>
            <Button className="gap-2">
              <Phone className="w-4 h-4" /> Call Reservation Desk ({hotel.phone})
            </Button>
          </a>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GalleryComponent />

          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400" /> {hotel.starRating} Star Luxury Hotel
              </span>
              <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">{hotel.startingPrice}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Resort Overview</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {hotel.description}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Resort Amenities & Spa</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-purple-500" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <MapComponent locationName={hotel.location} />
        </div>
      </div>
    </div>
  );
}
