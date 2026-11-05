import { SettingsService } from '@/lib/services/settings.service';
import {
  PROMOTED_BUSINESSES_SET_1,
  PROMOTED_BUSINESSES_SET_2,
  PromotedCardItem,
} from '@/lib/constants/promoted-sliders';

export interface PromotedSlider {
  id: string;
  section: 'featured' | 'explore'; // 'featured' = After Featured Listings, 'explore' = After Explore Calicut
  brandName: string;
  brandTag?: string;
  headline: string;
  dealHighlight: string;
  subtext: string;
  bottomStrip: string;
  bankIconText?: string;
  image: string;
  href: string;
  phone?: string;
  badgeText?: string;
  badgeColor?: 'amber' | 'rose' | 'emerald' | 'blue' | 'purple';
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PromotedSlidersSettings {
  items: PromotedSlider[];
  enabled: boolean;
  show_creative_banner: boolean;
  banner_headline: string;
  banner_subtext: string;
  banner_badge: string;
  banner_cta_text: string;
  banner_cta_url: string;
  version?: number;
}

export const DEFAULT_PROMOTED_SLIDERS_SETTINGS: PromotedSlidersSettings = {
  items: [],
  enabled: true,
  show_creative_banner: true,
  banner_headline: 'Spotlight Your Brand Across Kozhikode',
  banner_subtext:
    'Put your business directly in front of thousands of Kozhikode shoppers, diners & clients daily. Premium homepage visibility, high-intent category reach, and instant direct WhatsApp inquiries.',
  banner_badge: 'FEATURE YOUR BUSINESS',
  banner_cta_text: 'Promote Your Business',
  banner_cta_url: '/merchant',
  version: 2,
};

export const INITIAL_PROMOTED_SLIDERS: PromotedSlider[] = [
  ...PROMOTED_BUSINESSES_SET_1.map((item, idx) => ({
    id: item.id,
    section: 'featured' as const,
    brandName: item.brandName,
    brandTag: item.brandTag,
    headline: item.headline,
    dealHighlight: item.dealHighlight,
    subtext: item.subtext,
    bottomStrip: item.bottomStrip,
    bankIconText: item.bankIconText,
    image: item.image,
    href: item.href,
    phone: item.phone,
    badgeText: item.badgeText,
    badgeColor: item.badgeColor || 'amber',
    is_active: true,
    display_order: idx + 1,
    created_at: new Date().toISOString(),
  })),
  ...PROMOTED_BUSINESSES_SET_2.map((item, idx) => ({
    id: item.id,
    section: 'explore' as const,
    brandName: item.brandName,
    brandTag: item.brandTag,
    headline: item.headline,
    dealHighlight: item.dealHighlight,
    subtext: item.subtext,
    bottomStrip: item.bottomStrip,
    bankIconText: item.bankIconText,
    image: item.image,
    href: item.href,
    phone: item.phone,
    badgeText: item.badgeText,
    badgeColor: item.badgeColor || 'amber',
    is_active: true,
    display_order: idx + 1,
    created_at: new Date().toISOString(),
  })),
];

export class PromotedSlidersService {
  /**
   * Fetch current promoted sliders configuration and items from settings.
   * Auto-initializes v2 full-width 2-sec banner carousel on first run.
   * Once initialized to v2, user manual deletions and toggles are strictly respected!
   */
  static async getSettings(): Promise<PromotedSlidersSettings> {
    try {
      const getSettingPromise = SettingsService.getSetting('promoted_sliders');
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const stored = (await Promise.race([getSettingPromise, timeoutPromise]).catch(() => null)) as any;

      // If missing or not yet upgraded to version 2, initialize with sample full banners & enabled=true
      if (!stored || typeof stored !== 'object' || stored.version !== 2) {
        const initialSettings: PromotedSlidersSettings = {
          items: INITIAL_PROMOTED_SLIDERS,
          enabled: true,
          show_creative_banner: true,
          banner_headline: stored?.banner_headline || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_headline,
          banner_subtext: stored?.banner_subtext || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_subtext,
          banner_badge: stored?.banner_badge || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_badge,
          banner_cta_text: stored?.banner_cta_text || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_cta_text,
          banner_cta_url: stored?.banner_cta_url || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_cta_url,
          version: 2,
        };

        // Persist v2 initialization to Supabase asynchronously
        SettingsService.updateSetting(
          'promoted_sliders',
          initialSettings,
          'Auto-initialize v2 full-width 2-sec banner carousel'
        ).catch(() => {});

        return initialSettings;
      }

      // If version is 2, respect user-managed configuration (even if empty [] when deleted!)
      const items: PromotedSlider[] = Array.isArray(stored.items) ? stored.items : [];
      const enabled = stored.enabled !== false;
      const show_creative_banner = stored.show_creative_banner !== false;

      return {
        items,
        enabled,
        show_creative_banner,
        banner_headline: stored.banner_headline || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_headline,
        banner_subtext: stored.banner_subtext || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_subtext,
        banner_badge: stored.banner_badge || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_badge,
        banner_cta_text: stored.banner_cta_text || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_cta_text,
        banner_cta_url: stored.banner_cta_url || DEFAULT_PROMOTED_SLIDERS_SETTINGS.banner_cta_url,
        version: 2,
      };
    } catch (err) {
      console.warn('[PromotedSlidersService] getSettings fallback:', err);
      return { ...DEFAULT_PROMOTED_SLIDERS_SETTINGS, items: INITIAL_PROMOTED_SLIDERS };
    }
  }

  /**
   * Fetch all promoted sliders safely.
   */
  static async getAllSliders(
    options: {
      activeOnly?: boolean;
      section?: 'featured' | 'explore' | 'all';
    } = {}
  ): Promise<PromotedSlider[]> {
    const settings = await this.getSettings();
    if (settings.enabled === false && options.activeOnly) {
      return [];
    }

    let items = [...settings.items];

    if (options.activeOnly) {
      items = items.filter((item) => item.is_active !== false);
    }

    if (options.section && options.section !== 'all') {
      items = items.filter((item) => item.section === options.section);
    }

    return items.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  }

  /**
   * Update section-wide settings (e.g. enabled, show_creative_banner, banner copy)
   */
  static async updateSettings(updates: Partial<PromotedSlidersSettings>): Promise<PromotedSlidersSettings> {
    const current = await this.getSettings();
    const next: PromotedSlidersSettings = {
      ...current,
      ...updates,
      version: 2,
    };

    await SettingsService.updateSetting(
      'promoted_sliders',
      next,
      'Updated promoted sliders settings'
    );

    return next;
  }

  /**
   * Create a new promoted slider card (called from Admin panel)
   */
  static async createSlider(payload: Partial<PromotedSlider>): Promise<PromotedSlider> {
    const settings = await this.getSettings();
    const now = new Date().toISOString();

    const newSlider: PromotedSlider = {
      id: `pb-${Date.now()}`,
      section: payload.section || 'featured',
      brandName: (payload.brandName || 'SPONSORED BRAND').trim().toUpperCase(),
      brandTag: payload.brandTag || undefined,
      headline: (payload.headline || 'Exclusive Calicut Promotion').trim(),
      dealHighlight: (payload.dealHighlight || 'Special Offer').trim(),
      subtext: (payload.subtext || 'Verified business in Calicut').trim(),
      bottomStrip: (payload.bottomStrip || 'Limited Time Special Deal').trim(),
      bankIconText: payload.bankIconText || 'SPECIAL',
      image: payload.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
      href: payload.href || '/business',
      phone: payload.phone || undefined,
      badgeText: payload.badgeText || 'SPECIAL OFFER',
      badgeColor: payload.badgeColor || 'amber',
      is_active: payload.is_active !== false,
      display_order: payload.display_order ?? settings.items.length + 1,
      created_at: now,
      updated_at: now,
    };

    const nextItems = [newSlider, ...settings.items];
    await SettingsService.updateSetting(
      'promoted_sliders',
      { ...settings, items: nextItems, version: 2 },
      `Created promoted slider ${newSlider.id}`
    );

    return newSlider;
  }

  /**
   * Update an existing promoted slider card
   */
  static async updateSlider(id: string, updates: Partial<PromotedSlider>): Promise<PromotedSlider> {
    const settings = await this.getSettings();
    const idx = settings.items.findIndex((item) => item.id === id);
    if (idx === -1) {
      throw new Error(`Slider with ID ${id} not found`);
    }

    const updated: PromotedSlider = {
      ...settings.items[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const nextItems = [...settings.items];
    nextItems[idx] = updated;

    await SettingsService.updateSetting(
      'promoted_sliders',
      { ...settings, items: nextItems, version: 2 },
      `Updated promoted slider ${id}`
    );

    return updated;
  }

  /**
   * Delete a promoted slider card
   */
  static async deleteSlider(id: string): Promise<boolean> {
    const settings = await this.getSettings();
    const nextItems = settings.items.filter((item) => item.id !== id);

    await SettingsService.updateSetting(
      'promoted_sliders',
      { ...settings, items: nextItems, version: 2 },
      `Deleted promoted slider ${id}`
    );

    return true;
  }

  /**
   * Clear all promoted sliders (empties the list)
   */
  static async clearAllSliders(): Promise<boolean> {
    const settings = await this.getSettings();
    await SettingsService.updateSetting(
      'promoted_sliders',
      { ...settings, items: [], version: 2 },
      'Cleared all promoted sliders'
    );
    return true;
  }

  /**
   * Manually seed sample sliders (only when user clicks button in admin)
   */
  static async seedSampleSliders(): Promise<PromotedSlider[]> {
    const settings = await this.getSettings();
    const seeded = INITIAL_PROMOTED_SLIDERS;
    await SettingsService.updateSetting(
      'promoted_sliders',
      { ...settings, items: seeded, version: 2 },
      'Seeded demo promoted sliders'
    );
    return seeded;
  }

  /**
   * Convert PromotedSlider to PromotedCardItem for frontend display
   */
  static toCardItem(slider: PromotedSlider): PromotedCardItem {
    return {
      id: slider.id,
      brandName: slider.brandName,
      brandTag: slider.brandTag,
      headline: slider.headline,
      dealHighlight: slider.dealHighlight,
      subtext: slider.subtext,
      bottomStrip: slider.bottomStrip,
      bankIconText: slider.bankIconText,
      image: slider.image,
      href: slider.href,
      phone: slider.phone,
      badgeText: slider.badgeText,
      badgeColor: slider.badgeColor,
      isAd: true,
    };
  }
}
