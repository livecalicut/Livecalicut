import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Eye, Edit, Trash2 } from 'lucide-react';

export default function MyPropertiesPage() {
  const myProperties = [
    {
      id: '1',
      title: 'Luxury 3 BHK Villa in Kozhikode Bypass',
      price: '₹1.25 Cr',
      status: 'published',
      views: 310,
      slug: 'luxury-3-bhk-villa-kozhikode-bypass',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="My Posted Properties"
        description="Manage your real estate listings, update pricing or mark as sold."
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: 'My Properties' },
        ]}
      />

      <div className="space-y-4">
        {myProperties.map((prop) => (
          <Card key={prop.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{prop.title}</h4>
                <p className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">{prop.price}</p>
              </div>
              <Badge variant="success">Published</Badge>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {prop.views} Views</span>
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
