import { createAdminClient, createPublicClient } from '@/lib/supabase/server';
import { SettingsService } from '@/lib/services/settings.service';

export interface Offer {
  id: string;
  business_id?: string | null;
  business_name: string;
  title: string;
  description?: string;
  discount: string;
  code?: string;
  location: string;
  category: string;
  image?: string | null;
  link: string;
  valid_till: string;
  is_active: boolean;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class OffersService {
  /**
   * Fetch all offers. If activeOnly is true, only returns active offers.
   * Tries Supabase table 'offers' first; seamlessly falls back to SettingsService ('city_offers').
   */
  static async getAllOffers(options: { activeOnly?: boolean } = {}): Promise<Offer[]> {
    try {
      const supabase = createPublicClient();
      let query = supabase.from('offers').select('*').order('created_at', { ascending: false });

      if (options.activeOnly) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as Offer[];
      }
    } catch {
      // Supabase table query failed, proceed to fallback
    }

    // Fallback to SettingsService
    try {
      const stored = await SettingsService.getSetting('city_offers');
      const items = Array.isArray((stored as any)?.items) ? ((stored as any).items as Offer[]) : [];
      if (options.activeOnly) {
        return items.filter((o) => o.is_active !== false);
      }
      return items;
    } catch {
      return [];
    }
  }

  /**
   * Create an offer. Writes to Supabase offers table and updates SettingsService.
   */
  static async createOffer(input: Partial<Offer>): Promise<Offer> {
    const now = new Date().toISOString();
    const offer: Offer = {
      id: input.id || `off-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      business_id: input.business_id || null,
      business_name: input.business_name?.trim() || 'Calicut Merchant',
      title: input.title?.trim() || 'Special Offer',
      description: input.description?.trim() || '',
      discount: input.discount?.trim() || 'Special Deal',
      code: input.code?.trim() || '',
      location: input.location?.trim() || 'Calicut',
      category: input.category?.trim() || 'Retail & Shopping',
      image: input.image || null,
      link: input.link?.trim() || '/business',
      valid_till: input.valid_till?.trim() || 'Limited Time',
      is_active: input.is_active !== false,
      is_featured: Boolean(input.is_featured),
      created_at: now,
      updated_at: now,
    };

    // 1. Try writing to Supabase table
    try {
      const supabase = await createAdminClient();
      await supabase.from('offers').insert(offer);
    } catch {
      // Table might not exist yet
    }

    // 2. Also persist in SettingsService
    try {
      const current = await this.getAllOffers();
      const next = [offer, ...current.filter((o) => o.id !== offer.id)];
      await SettingsService.updateSetting('city_offers', { items: next }, 'Created offer ' + offer.id);
    } catch {
      // Ignore settings error
    }

    return offer;
  }

  /**
   * Update an offer.
   */
  static async updateOffer(id: string, updates: Partial<Offer>): Promise<Offer | null> {
    const now = new Date().toISOString();

    // 1. Try Supabase table
    try {
      const supabase = await createAdminClient();
      await supabase.from('offers').update({ ...updates, updated_at: now }).eq('id', id);
    } catch {
      // Ignore
    }

    // 2. Update SettingsService
    try {
      const current = await this.getAllOffers();
      const existing = current.find((o) => o.id === id);
      if (!existing) return null;

      const updated: Offer = { ...existing, ...updates, updated_at: now };
      const next = current.map((o) => (o.id === id ? updated : o));
      await SettingsService.updateSetting('city_offers', { items: next }, 'Updated offer ' + id);
      return updated;
    } catch {
      return null;
    }
  }

  /**
   * Delete an offer.
   */
  static async deleteOffer(id: string): Promise<boolean> {
    // 1. Try Supabase table
    try {
      const supabase = await createAdminClient();
      await supabase.from('offers').delete().eq('id', id);
    } catch {
      // Ignore
    }

    // 2. Update SettingsService
    try {
      const current = await this.getAllOffers();
      const next = current.filter((o) => o.id !== id);
      await SettingsService.updateSetting('city_offers', { items: next }, 'Deleted offer ' + id);
      return true;
    } catch {
      return false;
    }
  }
}
