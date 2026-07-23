import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { VerifiedBadge, PremiumBadge } from '@/components/business/verified-badge';
import { RatingComponent, ReviewCard } from '@/components/business/rating-component';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { ContactCard } from '@/components/business/contact-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Share2, Bookmark } from 'lucide-react';

export default async function BusinessDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Sample detailed business entity
  const business = {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'PARAGON RESTAURANT',
    category: 'Dining & Malabar Cuisine',
    location: 'Mavoor Road Junction, Near Calicut Railway Station, Kozhikode',
    rating: 4.9,
    reviewCount: 1240,
    phone: '+91 495 276 8920',
    whatsapp: '+91 98470 12345',
    email: 'contact@paragonrestaurant.in',
    website: 'https://paragonrestaurant.in',
    googleMapsLink: 'https://maps.google.com',
    description:
      'Established in 1939 in Kozhikode, Paragon Restaurant is internationally renowned for its authentic Malabar Biryani, coastal seafood delicacies, and historic heritage ambiance.',
    shortDescription: 'World-famous authentic Malabar Biryani and coastal seafood dining in Calicut.',
    isVerified: true,
    isPremium: true,
  };

  const reviews = [
    {
      id: '1',
      userName: 'Muhammed Fayiz',
      rating: 5,
      date: 'July 10, 2026',
      comment: 'Best Malabar Biryani in Kerala! Service was fast despite the weekend rush. A must-visit culinary spot in Kozhikode.',
    },
    {
      id: '2',
      userName: 'Anjali Nair',
      rating: 5,
      date: 'July 04, 2026',
      comment: 'Fish Mango Curry and Appam were outstanding. Exceptional authentic Kozhikode flavors.',
    },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Header & Breadcrumb */}
      <PageHeader
        title={business.name}
        description={business.shortDescription}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: business.name },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Bookmark className="w-4 h-4" /> Save
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        }
      />

      {/* Hero Header Details Block */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <VerifiedBadge />
            <PremiumBadge />
          </div>
          <RatingComponent rating={business.rating} count={business.reviewCount} size="lg" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            {business.category}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{business.location}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
          {business.description}
        </p>
      </Card>

      {/* Main Grid: Gallery & Details vs Contacts & Map Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Photos, Reviews) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery Component */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Photo Gallery</h3>
            <GalleryComponent />
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Customer Reviews ({business.reviewCount})
              </h3>
              <Button size="sm" className="gap-1">
                Write a Review
              </Button>
            </div>
            <div className="space-y-3">
              {reviews.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  userName={rev.userName}
                  rating={rev.rating}
                  date={rev.date}
                  comment={rev.comment}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Contacts, Hours, Map) */}
        <div className="space-y-6">
          <ContactCard
            phone={business.phone}
            whatsapp={business.whatsapp}
            email={business.email}
            website={business.website}
          />
          <MapComponent locationName={business.name} googleMapsLink={business.googleMapsLink} />
        </div>
      </div>
    </div>
  );
}
