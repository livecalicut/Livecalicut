import { PageHeader } from '@/components/shared/page-header';
import { PlanPricingCard } from '@/components/payment/plan-pricing-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { CreditCard } from 'lucide-react';

export default function SubscriptionsPricingPage() {
  const plans = [
    {
      name: 'Free Starter Plan',
      slug: 'free-starter',
      monthlyPrice: 0,
      features: ['Basic Business Profile', '1 Photo Upload', 'Directory Search Indexing', 'Community Support'],
      isPopular: false,
    },
    {
      name: 'Professional Suite',
      slug: 'professional-suite',
      monthlyPrice: 999,
      features: [
        'Verified Merchant Blue Badge',
        '15 Gallery Photo Uploads',
        'Direct Customer Inquiry Leads',
        '2 Featured Promotion Credits / mo',
        'Official Review Reply Desk',
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise Business',
      slug: 'enterprise-business',
      monthlyPrice: 2499,
      features: [
        'Multi-Outlet Regional Access',
        '50 Gallery Photos & Video Tours',
        'Unlimited WhatsApp Lead Forwarding',
        '10 Featured Promotion Credits / mo',
        'Dedicated Kozhikode Account Executive',
      ],
      isPopular: false,
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="LiveCalicut Merchant Subscription Plans"
        description="Grow your Kozhikode business with verified badges, customer leads & featured search placements."
        icon={<CreditCard className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Subscriptions & Pricing' }]}
      />

      <ResponsiveGrid cols={3}>
        {plans.map((p) => (
          <PlanPricingCard
            key={p.slug}
            name={p.name}
            slug={p.slug}
            monthlyPrice={p.monthlyPrice}
            features={p.features}
            isPopular={p.isPopular}
          />
        ))}
      </ResponsiveGrid>
    </div>
  );
}
