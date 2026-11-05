import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';
import { PromotedSlidersService } from '@/lib/services/promoted-sliders.service';

/**
 * GET /api/v1/admin/promoted-sliders
 * Content Editors & Admins: Fetch all promoted sliders (including inactive)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const section = (url.searchParams.get('section') as any) || 'all';

    const sliders = await PromotedSlidersService.getAllSliders({
      activeOnly: false,
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

/**
 * POST /api/v1/admin/promoted-sliders
 * Create a new promoted slider card
 */
export async function POST(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => null);
    if (!body || !body.brandName || !body.headline) {
      return NextResponse.json(
        { success: false, error: 'Brand name and headline are required.' },
        { status: 400 }
      );
    }

    const slider = await PromotedSlidersService.createSlider(body);
    return NextResponse.json({ success: true, slider });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create slider' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/admin/promoted-sliders
 * Update an existing promoted slider card
 */
export async function PUT(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Slider ID is required for updating.' },
        { status: 400 }
      );
    }

    const updated = await PromotedSlidersService.updateSlider(body.id, body);
    return NextResponse.json({ success: true, slider: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update slider' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/admin/promoted-sliders?id=...
 * Delete a promoted slider card
 */
export async function DELETE(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Slider ID is required.' },
        { status: 400 }
      );
    }

    const success = await PromotedSlidersService.deleteSlider(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete slider' },
      { status: 500 }
    );
  }
}

