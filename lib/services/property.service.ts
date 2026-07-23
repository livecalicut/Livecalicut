import { createClient } from '@/lib/supabase/client';

export class PropertyService {
  private static supabase = createClient();

  static async getProperties(filters: {
    listingType?: string;
    categorySlug?: string;
    keyword?: string;
    bedrooms?: number;
    isFeatured?: boolean;
  } = {}) {
    let query = this.supabase
      .from('properties')
      .select('*, property_categories(name, slug), property_agencies(name, logo)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters.listingType) query = query.eq('listing_type', filters.listingType);
    if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.keyword) query = query.ilike('title', `%${filters.keyword}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getPropertyBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('properties')
      .select('*, property_categories(name, slug), property_agencies(name, logo, phone, email, website), property_agents(name, photo, phone, email), property_amenities(*), property_images(*)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  static async submitInquiry(params: {
    propertyId: string;
    name: string;
    phone: string;
    email: string;
    message: string;
  }) {
    const { data, error } = await this.supabase
      .from('property_inquiries')
      .insert({
        property_id: params.propertyId,
        name: params.name,
        phone: params.phone,
        email: params.email,
        message: params.message,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async toggleFavorite(userId: string, propertyId: string) {
    const { data: existing } = await this.supabase
      .from('property_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      await this.supabase.from('property_favorites').delete().eq('id', existing.id);
      return false;
    } else {
      await this.supabase.from('property_favorites').insert({
        user_id: userId,
        property_id: propertyId,
      });
      return true;
    }
  }

  static async getAgencies() {
    const { data, error } = await this.supabase
      .from('property_agencies')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
