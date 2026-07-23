export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'featured';

export interface BusinessListing {
  id: string;
  owner_id?: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address: string;
  ward_location: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  images: string[];
  opening_hours?: Record<string, string>;
  status: ListingStatus;
  rating_avg: number;
  review_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string;
  status: 'published' | 'flagged';
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}
