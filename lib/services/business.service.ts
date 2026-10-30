import { createClient } from '@/lib/supabase/client';
import { businessCover, businessImages } from '@/lib/business/images';

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
        cover_image: businessCover(b),
        images: businessImages(b),
      })),
      total: count ?? 0,
    };
  }

  static async getBusinessBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*, business_categories(name, slug), areas(name, slug)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCategories() {
    try {
      const { data, error } = await this.supabase
        .from('business_categories')
        .select('*, business_subcategories(*)')
        .is('deleted_at', null)
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fall through to fallback list
    }

    return [
      { id: '1', name: 'Restaurants & Cafés', slug: 'restaurants-cafes', icon_name: 'Utensils', display_order: 1 },
      { id: '2', name: 'Tourism & Destinations', slug: 'tourism-destinations', icon_name: 'Palmtree', display_order: 2 },
      { id: '3', name: 'Lifestyle & Wellness', slug: 'lifestyle-wellness', icon_name: 'Sparkles', display_order: 3 },
      { id: '4', name: 'Shopping & Entertainment', slug: 'shopping-entertainment', icon_name: 'ShoppingBag', display_order: 4 },
      { id: '5', name: 'Arts & Culture', slug: 'arts-culture', icon_name: 'Palette', display_order: 5 },
      { id: '6', name: 'Business Directory', slug: 'business-directory', icon_name: 'Building2', display_order: 6 },
      { id: '7', name: 'Local Services', slug: 'local-services', icon_name: 'Wrench', display_order: 7 },
      { id: '8', name: 'Classifieds', slug: 'classifieds', icon_name: 'Tag', display_order: 8 },
      { id: '9', name: 'Properties', slug: 'properties', icon_name: 'Home', display_order: 9 },
      { id: '10', name: 'Featured Businesses', slug: 'featured-businesses', icon_name: 'Crown', display_order: 10 },
      { id: '11', name: 'Jobs & Careers', slug: 'jobs-careers', icon_name: 'Briefcase', display_order: 11 },
      { id: '12', name: 'Internships', slug: 'internships', icon_name: 'GraduationCap', display_order: 12 },
      { id: '13', name: 'Education & Courses', slug: 'education-courses', icon_name: 'BookOpen', display_order: 13 },
      { id: '14', name: 'Startups & Creators', slug: 'startups-creators', icon_name: 'Rocket', display_order: 14 },
      { id: '15', name: 'Community Stories', slug: 'community-stories', icon_name: 'Newspaper', display_order: 15 },
      { id: '16', name: 'Traffic & Transport', slug: 'traffic-transport', icon_name: 'Bus', display_order: 16 },
      { id: '17', name: 'Sports & Activities', slug: 'sports-activities', icon_name: 'Trophy', display_order: 17 },
      { id: '18', name: 'Local Initiatives', slug: 'local-initiatives', icon_name: 'HeartHandshake', display_order: 18 },
      { id: '19', name: 'Public Announcements', slug: 'public-announcements', icon_name: 'Megaphone', display_order: 19 },
    ];
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
