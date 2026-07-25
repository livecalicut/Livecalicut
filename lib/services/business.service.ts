import { createClient } from '@/lib/supabase/client';

export class BusinessService {
  private static supabase = createClient();

  static async getBusinesses(
    filters: {
      categorySlug?: string;
      citySlug?: string;
      keyword?: string;
      isFeatured?: boolean;
      isVerified?: boolean;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ data: any[]; total: number }> {
    const page = Math.max(1, filters.page ?? 1);
    // Cap the page size so a caller cannot request the whole table.
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const from = (page - 1) * limit;

    // `!inner` lets the category slug be filtered in the same round trip
    // instead of looking the category id up first.
    const categoryJoin = filters.categorySlug
      ? 'business_categories!inner(name, slug)'
      : 'business_categories(name, slug)';

    let query = this.supabase
      .from('businesses')
      .select(`*, ${categoryJoin}, areas(name, slug)`, { count: 'exact' })
      .is('deleted_at', null)
      .eq('status', 'active');

    if (filters.categorySlug) query = query.eq('business_categories.slug', filters.categorySlug);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.isVerified) query = query.eq('is_verified', true);
    if (filters.keyword) {
      const term = filters.keyword.replace(/[%,()]/g, '');
      query = query.or(`name.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    const { data, error, count } = await query
      .order('is_featured', { ascending: false })
      .order('rating_avg', { ascending: false })
      .range(from, from + limit - 1);

    if (error) throw error;

    return {
      data: (data || []).map((b: any) => ({
        ...b,
        category: b.business_categories?.name || b.category,
        location: b.areas?.name || b.location,
        area: b.areas?.name,
        rating: b.rating_avg ?? b.rating ?? 0,
        cover_image: b.social_media?.cover_image || b.cover_image || null,
      })),
      total: count ?? 0,
    };
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

  static async getFeaturedBusinesses(limit = 12) {
    const { data } = await this.getBusinesses({ isFeatured: true, limit });
    return data;
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
