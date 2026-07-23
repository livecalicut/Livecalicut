import { createClient } from '@/lib/supabase/client';

export class FeedService {
  private static supabase = createClient();

  static async getNews(filters: { categorySlug?: string; isFeatured?: boolean } = {}) {
    let query = this.supabase
      .from('news')
      .select('*, news_categories(name, slug)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false });

    if (filters.categorySlug) {
      const { data: cat } = await this.supabase
        .from('news_categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getEvents(filters: { categorySlug?: string; isFeatured?: boolean } = {}) {
    let query = this.supabase
      .from('events')
      .select('*, event_categories(name, slug), organizers(name, slug, avatar)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('start_date', { ascending: true });

    if (filters.categorySlug) {
      const { data: cat } = await this.supabase
        .from('event_categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getAnnouncements(cityId?: string) {
    let query = this.supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('published_at', { ascending: false });

    if (cityId) query = query.eq('city_id', cityId);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }
}
