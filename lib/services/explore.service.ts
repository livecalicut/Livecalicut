import { createClient } from '@/lib/supabase/client';

export class ExploreService {
  private static supabase = createClient();

  static async getPlaces(categorySlug?: string) {
    let query = this.supabase
      .from('places')
      .select('*, place_categories(name, slug)')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('rating_avg', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getPlaceBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('places')
      .select('*, place_categories(name, slug), place_gallery(*), place_reviews(*, profiles(full_name, avatar))')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  static async getRestaurants() {
    const { data, error } = await this.supabase
      .from('restaurants')
      .select('*, restaurant_menu(*)')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getHotels() {
    const { data, error } = await this.supabase
      .from('hotels')
      .select('*, hotel_gallery(*)')
      .order('star_rating', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getExperiences() {
    const { data, error } = await this.supabase
      .from('experiences')
      .select('*')
      .eq('status', 'active')
      .order('title', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
