import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PropertyPriceBadgeProps {
  price: number;
  listingType?: 'buy' | 'sell' | 'rent' | 'lease' | string;
}

export const PropertyPriceBadge: React.FC<PropertyPriceBadgeProps> = ({ price, listingType = 'sell' }) => {
  const formatPrice = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const typeLabels: Record<string, string> = {
    sell: 'For Sale',
    rent: 'For Rent',
    lease: 'For Lease',
    buy: 'Wanted',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-lg font-black text-cyan-600 dark:text-cyan-400">
        {formatPrice(price)}
      </span>
      <Badge variant={listingType === 'rent' ? 'purple' : 'success'}>
        {typeLabels[listingType] || listingType}
      </Badge>
    </div>
  );
};
