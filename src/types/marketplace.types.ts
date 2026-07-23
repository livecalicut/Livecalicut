export type ItemCondition = 'new' | 'like_new' | 'used';

export interface MarketplaceItem {
  id: string;
  seller_id: string;
  title: string;
  category: string;
  price: number;
  condition: ItemCondition;
  description: string;
  images: string[];
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    phone?: string;
    avatar_url?: string;
  };
}
