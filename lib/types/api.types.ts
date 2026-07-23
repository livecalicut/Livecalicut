// lib/types/api.types.ts
// Shared TypeScript types for all LiveCalicut API modules

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  error?: string;
  errors?: ApiError[];
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: unknown;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

// ---- Business ----
export interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  area?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  is_verified?: boolean;
  is_featured?: boolean;
  city_slug?: string;
  status?: string;
  cover_image?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ---- Job ----
export interface Job {
  id: string;
  title: string;
  slug: string;
  description?: string;
  company_name?: string;
  location?: string;
  area?: string;
  job_type?: string;       // 'full-time','part-time','contract','internship','walk-in'
  salary_min?: number;
  salary_max?: number;
  salary_display?: string;
  experience?: string;
  skills?: string[];
  category?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  status?: string;
  expires_at?: string;
  created_at?: string;
}

// ---- Marketplace ----
export interface MarketplaceListing {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  price_display?: string;
  condition?: string;      // 'new','like-new','good','fair'
  category?: string;
  location?: string;
  area?: string;
  images?: string[];
  seller_name?: string;
  seller_phone?: string;
  is_featured?: boolean;
  status?: string;
  created_at?: string;
}

// ---- Property ----
export interface Property {
  id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  price_display?: string;
  property_type?: string;  // 'apartment','house','villa','plot','commercial'
  listing_type?: string;   // 'rent','sale','lease'
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  location?: string;
  area?: string;
  images?: string[];
  is_featured?: boolean;
  status?: string;
  created_at?: string;
}

// ---- News ----
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  cover_image?: string;
  published_at?: string;
  created_at?: string;
}

// ---- Event ----
export interface CityEvent {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  venue?: string;
  area?: string;
  start_date?: string;
  end_date?: string;
  cover_image?: string;
  is_featured?: boolean;
  status?: string;
}

// ---- Search ----
export interface SearchDocument {
  id: string;
  module: string;
  entity_id: string;
  title: string;
  description?: string;
  category?: string;
  city_slug?: string;
  area?: string;
  ranking_score: number;
  is_featured: boolean;
  is_verified: boolean;
}

export interface SearchGroupedResults {
  businesses: SearchDocument[];
  jobs: SearchDocument[];
  marketplace: SearchDocument[];
  properties: SearchDocument[];
  events: SearchDocument[];
  news: SearchDocument[];
  explore: SearchDocument[];
  total: number;
}

// ---- Notification ----
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  entity_type?: string;
  entity_id?: string;
  is_read: boolean;
  created_at: string;
}

// ---- Merchant ----
export interface MerchantProfile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  role?: string;
  subscription_tier?: string;
  subscription_status?: string;
}

export interface MerchantDashboard {
  profile: MerchantProfile;
  stats: {
    total_views?: number;
    total_leads?: number;
    unread_messages?: number;
    active_listings?: number;
  };
}
