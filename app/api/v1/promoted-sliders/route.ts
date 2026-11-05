import { NextResponse } from 'next/server';
import { PromotedSlidersService } from '@/lib/services/promoted-sliders.service';

/**
 * GET /api/v1/promoted-sliders?section=featured|explore
 * Public API to fetch active sliders for the frontend
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const section = (url.searchParams.get('section') as any) || 'all';

    const sliders = await PromotedSlidersService.getAllSliders({
      activeOnly: true,
      section,
    });

    return NextResponse.json({ success: true, sliders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to load sliders' },
      { status: 500 }
    );
  }
}

