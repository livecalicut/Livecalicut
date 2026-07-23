import { createClient } from '@/lib/supabase/client';

export class BusinessService {
  private static supabase = createClient();

  static async getBusinesses(filters: {
    categorySlug?: string;
    citySlug?: string;
    keyword?: string;
    isFeatured?: boolean;
    isVerified?: boolean;
  } = {}) {
    let query = this.supabase
      .from('businesses')
      .select('*, business_categories(name, slug), areas(name, slug)')
      .is('deleted_at', null)
      .eq('status', 'active');

    if (filters.categorySlug) {
      const { data: cat } = await this.supabase
        .from('business_categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.isVerified) query = query.eq('is_verified', true);
    if (filters.keyword) query = query.ilike('name', `%${filters.keyword}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getBusinessBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*, business_categories(name, slug), areas(name, slug), business_images(*), business_hours(*), business_reviews(*, profiles(full_name, avatar))')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCategories() {
    const { data, error } = await this.supabase
      .from('business_categories')
      .select('*, business_subcategories(*)')
      .is('deleted_at', null)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getFeaturedBusinesses() {
    return this.getBusinesses({ isFeatured: true });
  }

  static async submitReview(params: { businessId: string; userId: string; rating: number; comment: string }) {
    const { data, error } = await this.supabase
      .from('business_reviews')
      .insert({
        business_id: params.businessId,
        user_id: params.userId,
        rating: params.rating,
        comment: params.comment,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async toggleBookmark(userId: string, businessId: string) {
    const { data: existing } = await this.supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('entity_type', 'business')
      .eq('entity_id', businessId)
      .single();

    if (existing) {
      await this.supabase.from('bookmarks').delete().eq('id', existing.id);
      return false; // Removed
    } else {
      await this.supabase.from('bookmarks').insert({
        user_id: userId,
        entity_type: 'business',
        entity_id: businessId,
      });
      return true; // Added
    }
  }

  static async reportBusiness(params: { reporterId?: string; businessId: string; reason: string; details?: string }) {
    const { data, error } = await this.supabase
      .from('reports')
      .insert({
        reporter_id: params.reporterId,
        entity_type: 'business',
        entity_id: params.businessId,
        reason: params.reason,
        details: params.details,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createBusiness(payload: any) {
    const { data, error } = await this.supabase
      .from('businesses')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
