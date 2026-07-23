import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ShareButtons } from '@/components/shared/share-buttons';
import { PropertyPriceBadge } from '@/components/property/property-price-badge';
import { AgentCard } from '@/components/property/agent-card';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize, Car, Sparkles, Bookmark, Building } from 'lucide-react';

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const property = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'LUXURY 3 BHK VILLA IN KOZHIKODE BYPASS',
    price: 12500000,
    listingType: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2400,
    parkingSpaces: 2,
    furnishedStatus: 'Fully Furnished',
    location: 'Thondayad Bypass, Kozhikode Wards',
    description: `
      Spacious 3 BHK luxury independent villa for sale near Thondayad Bypass Junction, Kozhikode.
      Features private garden, modular Kitchen, covered 2-car parking, 24/7 security gate, solar water heater, and instant connectivity to Hilite Cyberpark & Aster MIMS Hospital.
    `,
    amenities: ['24/7 Security', 'Modular Kitchen', 'Solar Water Heater', 'Car Parking', 'Private Garden', 'Power Backup'],
    agentName: 'Muhammed Shamir',
    agentPhone: '+91 98471 22334',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* RealEstateListing Schema.org Structured Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={property.title}
        description={property.location}
        icon={<Building className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Real Estate', href: '/properties' },
          { label: property.title },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 h-[40px] rounded-xl font-bold">
              <Bookmark className="w-4 h-4 text-[#2563EB]" /> Save Favorite
            </Button>
            <ShareButtons title={property.title} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Gallery, Specs, Description, Amenities) */}
        <div className="lg:col-span-2 space-y-6">
          <GalleryComponent />

          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
            <div className="pb-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <PropertyPriceBadge price={property.price} listingType={property.listingType} />
              <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {property.furnishedStatus}
              </span>
            </div>

            {/* Core Property Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-2.5">
                <Bed className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Bedrooms</p>
                  <p className="font-extrabold text-[#111827]">{property.bedrooms} Beds</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-2.5">
                <Bath className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Bathrooms</p>
                  <p className="font-extrabold text-[#111827]">{property.bathrooms} Baths</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-2.5">
                <Maximize className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Built-up Area</p>
                  <p className="font-extrabold text-[#111827]">{property.areaSqft} sqft</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center gap-2.5">
                <Car className="w-4.5 h-4.5 text-[#2563EB] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#6B7280]">Parking</p>
                  <p className="font-extrabold text-[#111827]">{property.parkingSpaces} Slots</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#111827] font-sans">Property Highlights & Description</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#111827] font-sans">Amenities & Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item) => (
                  <span
                    key={item}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-bold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar (Agent Desk & Spatial Map) */}
        <div className="space-y-6">
          <AgentCard name={property.agentName} phone={property.agentPhone} />
          <MapComponent locationName={property.location} />
        </div>
      </div>
    </div>
  );
}
