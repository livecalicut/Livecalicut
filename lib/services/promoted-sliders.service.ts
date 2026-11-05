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
   * Fetch all promoted sliders safely with timeout and in-memory fallback.
   * Completely read-only: NEVER performs DB writes during page reads or static builds.
   */
  static async getAllSliders(
    options: {
      activeOnly?: boolean;
      section?: 'featured' | 'explore' | 'all';
    } = {}
  ): Promise<PromotedSlider[]> {
    try {
      // Fast 2-second timeout to ensure static builds (SSG) & SSR never hang
      const getSettingPromise = SettingsService.getSetting('promoted_sliders');
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000));
      const stored = await Promise.race([getSettingPromise, timeoutPromise]).catch(() => null);

      let items: PromotedSlider[] =
        Array.isArray((stored as any)?.items) && (stored as any).items.length > 0
          ? ((stored as any).items as PromotedSlider[])
          : INITIAL_PROMOTED_SLIDERS;

      if (options.activeOnly) {
        items = items.filter((item) => item.is_active !== false);
      }

      if (options.section && options.section !== 'all') {
        items = items.filter((item) => item.section === options.section);
      }

      return items.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    } catch (err) {
      console.warn('[PromotedSlidersService] getAllSliders fallback:', err);
      let fallback = INITIAL_PROMOTED_SLIDERS;
      if (options.activeOnly) {
        fallback = fallback.filter((item) => item.is_active !== false);
      }
      if (options.section && options.section !== 'all') {
        fallback = fallback.filter((item) => item.section === options.section);
      }
      return fallback;
    }
  }

  /**
   * Create a new promoted slider card (called exclusively from Admin panel)
   */
  static async createSlider(payload: Partial<PromotedSlider>): Promise<PromotedSlider> {
    const all = await this.getAllSliders({ activeOnly: false });
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
      display_order: payload.display_order ?? all.length + 1,
      created_at: now,
      updated_at: now,
    };

    const next = [newSlider, ...all];
    await SettingsService.updateSetting(
      'promoted_sliders',
      { items: next },
      `Created promoted slider ${newSlider.id}`
    );

    return newSlider;
  }

  /**
   * Update an existing promoted slider card
   */
  static async updateSlider(id: string, updates: Partial<PromotedSlider>): Promise<PromotedSlider> {
    const all = await this.getAllSliders({ activeOnly: false });
    const idx = all.findIndex((item) => item.id === id);
    if (idx === -1) {
      throw new Error(`Slider with ID ${id} not found`);
    }

    const updated: PromotedSlider = {
      ...all[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    all[idx] = updated;
    await SettingsService.updateSetting(
      'promoted_sliders',
      { items: all },
      `Updated promoted slider ${id}`
    );

    return updated;
  }

  /**
   * Delete a promoted slider card
   */
  static async deleteSlider(id: string): Promise<boolean> {
    const all = await this.getAllSliders({ activeOnly: false });
    const next = all.filter((item) => item.id !== id);

    await SettingsService.updateSetting(
      'promoted_sliders',
      { items: next },
      `Deleted promoted slider ${id}`
    );

    return true;
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
