import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Phone, Utensils, IndianRupee } from 'lucide-react';

export default async function RestaurantDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const restaurant = {
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'PARAGON RESTAURANT',
    cuisine: 'Malabar Traditional & Dum Biryani',
    location: 'Mavoor Road Junction, Calicut',
    phone: '+91 495 276 8888',
    avgCost: '₹600 for two',
    ratingAvg: 4.9,
    ratingCount: 1240,
    specialties: [
      { name: 'Paragon Mutton Dum Biryani', price: '₹340', isSpecial: true },
      { name: 'Malabar Fish Curry (King Fish)', price: '₹420', isSpecial: true },
      { name: 'Coin Porotta (4 pcs)', price: '₹80', isSpecial: false },
      { name: 'Elaneer Payasam (Tender Coconut Dessert)', price: '₹120', isSpecial: true },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title={restaurant.name}
        description={`${restaurant.cuisine} • ${restaurant.location}`}
        breadcrumbs={[
          { label: 'Explore', href: '/explore' },
          { label: 'Restaurants', href: '/restaurants' },
          { label: restaurant.name },
        ]}
        action={
          <a href={`tel:${restaurant.phone}`}>
            <Button className="gap-2">
              <Phone className="w-4 h-4" /> Call Dining Desk ({restaurant.phone})
            </Button>
          </a>
        }
      />

      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-base font-bold text-amber-500 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" /> {restaurant.ratingAvg} ★
            </span>
            <p className="text-xs text-slate-400">({restaurant.ratingCount} verified diner reviews)</p>
          </div>
          <Badge variant="purple">{restaurant.avgCost}</Badge>
        </div>

        {/* Signature Dishes Menu */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-cyan-600" /> Signature Dishes & Menu Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurant.specialties.map((item) => (
              <div
                key={item.name}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  {item.isSpecial && (
                    <Badge variant="warning" className="text-[10px] mt-1">Chef&apos;s Special</Badge>
                  )}
                </div>
                <span className="font-black text-cyan-600 dark:text-cyan-400">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
