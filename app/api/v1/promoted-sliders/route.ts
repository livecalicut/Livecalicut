import { NextResponse } from 'next/server';
import { PromotedSlidersService } from '@/lib/services/promoted-sliders.service';

/**
 * GET /api/v1/promoted-sliders?section=featured|explore
 * Public API to fetch active sliders and section settings for the frontend
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const section = (url.searchParams.get('section') as any) || 'all';

    const settings = await PromotedSlidersService.getSettings();
    if (settings.enabled === false) {
      return NextResponse.json({
        success: true,
        sliders: [],
        enabled: false,
        show_creative_banner: false,
      });
    }

    let sliders = settings.items.filter((item) => item.is_active !== false);
    if (section && section !== 'all') {
      sliders = sliders.filter((item) => item.section === section);
    }
    sliders.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

    return NextResponse.json({
      success: true,
      sliders,
      enabled: settings.enabled,
      show_creative_banner: settings.show_creative_banner,
      banner_headline: settings.banner_headline,
      banner_subtext: settings.banner_subtext,
      banner_badge: settings.banner_badge,
      banner_cta_text: settings.banner_cta_text,
      banner_cta_url: settings.banner_cta_url,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load sliders' },
      { status: 500 }
    );
  }
}
