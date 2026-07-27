import { PageHeader } from '@/components/shared/page-header';
import { PriceBadge, ConditionBadge } from '@/components/marketplace/price-badge';
import { SellerCard } from '@/components/marketplace/seller-card';
import { GalleryComponent } from '@/components/business/gallery-component';
import { MapComponent } from '@/components/business/map-component';
import { Card } from '@/components/ui/card';
import { MapPin, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { DetailSaveActions } from '@/components/auth/detail-save-actions';

export default async function MarketplaceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const item = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'MACBOOK PRO M2 16GB / 512GB SSD',
    price: 88000,
    priceType: 'fixed',
    isNegotiable: true,
    condition: 'like_new',
    brand: 'Apple',
    location: 'Hilite City, Thondayad Bypass, Kozhikode',
    category: 'Electronics & Gadgets',
    description: `
      Apple MacBook Pro 14-inch M2 Chip, 16GB Unified Memory, 512GB SSD Storage.
      Purchased 8 months ago, immaculate condition with zero scratches. Includes original Apple bill, Magsafe charger, and box packing.
    `,
    sellerName: 'Arjun K. Varma',
    sellerPhone: '+91 98460 77889',
    sellerWhatsapp: '+91 98460 77889',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.title,
    description: item.description,
    brand: {
      '@type': 'Brand',
      name: item.brand,
    },
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: item.sellerName,
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Product Schema.org Structured Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={item.title}
        description={item.location}
        icon={<ShoppingBag className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: item.title },
        ]}
        action={
          <DetailSaveActions
            kind="marketplace"
            entityId={slug}
            slug={slug}
            title={item.title}
            label="Save Favorite"
          />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Gallery & Specs) */}
        <div className="lg:col-span-2 space-y-6">
          <GalleryComponent />

          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E7EB]">
              <PriceBadge amount={item.price} isNegotiable={item.isNegotiable} />
              <ConditionBadge condition={item.condition} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#111827] font-sans">Item Specifications & Seller Note</h3>
              <p className="text-sm text-[#4B5563] leading-relaxed whitespace-pre-line font-normal">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex items-center gap-4 text-xs font-semibold text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#2563EB]" /> Category: <strong className="text-[#111827]">{item.category}</strong>
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Seller Verification: <strong className="text-emerald-600">Physical Check Verified</strong>
              </span>
            </div>
          </Card>
        </div>

        {/* Right Sidebar (Seller Contact & Location Map) */}
        <div className="space-y-6">
          <SellerCard
            fullName={item.sellerName}
            phone={item.sellerPhone}
            whatsapp={item.sellerWhatsapp}
            isVerified={true}
          />
          <MapComponent locationName={item.location} />
        </div>
      </div>
    </div>
  );
}
