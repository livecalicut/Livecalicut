import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { Utensils, Star, Phone, ArrowRight } from 'lucide-react';

export default function RestaurantsDirectoryPage() {
  const sampleRestaurants = [
    {
      name: 'Paragon Restaurant',
      slug: 'paragon-restaurant',
      cuisine: 'Malabar Traditional & Dum Biryani',
      avgCost: '₹600 for two',
      location: 'Mavoor Road Junction, Calicut',
      rating: 4.9,
    },
    {
      name: 'Rahmath Hotel',
      slug: 'rahmath-hotel',
      cuisine: 'Beef Biryani & Malabar Porotta',
      avgCost: '₹400 for two',
      location: 'Aravind Ghosh Road, Calicut',
      rating: 4.8,
    },
    {
      name: 'Zains Hotel',
      slug: 'zains-hotel',
      cuisine: 'Authentic Malabar Snacks & Unnakkaya',
      avgCost: '₹350 for two',
      location: 'Convent Road, Calicut',
      rating: 4.7,
    },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="Kozhikode Culinary & Restaurants"
        description="World-renowned Paragon biryani, Rahmath beef specialties, SM Street halwa shops & sea facing cafes."
        icon={<Utensils className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Restaurants' },
        ]}
      />

      <ResponsiveGrid cols={3}>
        {sampleRestaurants.map((r) => (
          <Link key={r.slug} href={`/restaurants/${r.slug}`} className="block group">
            <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{r.cuisine}</span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {r.rating} ★
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                {r.name}
              </h4>
              <p className="text-xs text-slate-500 truncate">{r.location}</p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-extrabold text-cyan-600">{r.avgCost}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 group-hover:underline">
                  Menu & Details <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </ResponsiveGrid>
    </div>
  );
}
