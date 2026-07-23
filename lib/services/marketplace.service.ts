import { createClient } from '@/lib/supabase/client';

export class MarketplaceService {
  private static supabase = createClient();

  static async getItems(filters: {
    categorySlug?: string;
    keyword?: string;
    condition?: string;
    isFeatured?: boolean;
  } = {}) {
    let query = this.supabase
      .from('marketplace_items')
      .select('*, marketplace_categories(name, slug), seller_profiles(full_name, phone, avatar)')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters.condition) query = query.eq('condition', filters.condition);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.keyword) query = query.ilike('title', `%${filters.keyword}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async getItemBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('marketplace_items')
      .select('*, marketplace_categories(name, slug), seller_profiles(full_name, phone, whatsapp, avatar, is_verified), marketplace_images(*)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  static async toggleFavorite(userId: string, itemId: string) {
    const { data: existing } = await this.supabase
      .from('marketplace_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .single();

    if (existing) {
      await this.supabase.from('marketplace_favorites').delete().eq('id', existing.id);
      return false;
    } else {
      await this.supabase.from('marketplace_favorites').insert({
        user_id: userId,
        item_id: itemId,
      });
      return true;
    }
  }

  static async getCategories() {
    const { data, error } = await this.supabase
      .from('marketplace_categories')
      .select('*')
      .is('deleted_at', null)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
