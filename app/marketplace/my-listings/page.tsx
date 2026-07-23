import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Eye, Heart, Edit, Trash2 } from 'lucide-react';

export default function MyListingsPage() {
  const myListings = [
    {
      id: '1',
      title: 'MacBook Pro M2 16GB / 512GB SSD',
      price: '₹88,000',
      status: 'active',
      views: 142,
      favorites: 12,
      postedDate: 'July 11, 2026',
      slug: 'macbook-pro-m2-16gb',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="My Classified Items for Sale"
        description="Manage your posted items, mark as sold or update pricing."
        icon={<ShoppingBag className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'My Listings' },
        ]}
      />

      <div className="space-y-4">
        {myListings.map((item) => (
          <Card key={item.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">{item.price}</p>
              </div>
              <Badge variant="success">Active Listing</Badge>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {item.views} Views</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {item.favorites} Favorites</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button variant="danger" size="sm" className="gap-1 text-xs">
                  <Trash2 className="w-3.5 h-3.5" /> Mark Sold
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
