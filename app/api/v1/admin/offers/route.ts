import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';
import { OffersService, Offer } from '@/lib/services/offers.service';

/**
 * GET /api/v1/admin/offers
 * Super Admin & Content Editors: Fetch all offers (including draft/inactive)
 */
export async function GET() {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const offers = await OffersService.getAllOffers({ activeOnly: false });
    return NextResponse.json({ success: true, offers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to load offers' }, { status: 500 });
  }
}

/**
 * POST /api/v1/admin/offers
 * Create a new offer
 */
export async function POST(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => null);
    if (!body || !body.title || !body.business_name || !body.discount) {
      return NextResponse.json(
        { success: false, error: 'Title, business name, and discount text are required' },
        { status: 400 }
      );
    }

    const offer = await OffersService.createOffer(body);
    return NextResponse.json({ success: true, offer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to create offer' }, { status: 500 });
  }
}

/**
 * PUT /api/v1/admin/offers
 * Update an existing offer
 */
export async function PUT(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ success: false, error: 'Offer ID is required' }, { status: 400 });
    }

    const updated = await OffersService.updateOffer(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, offer: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update offer' }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/admin/offers
 * Delete an offer
 */
export async function DELETE(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Offer ID is required' }, { status: 400 });
    }

    const success = await OffersService.deleteOffer(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to delete offer' }, { status: 500 });
  }
}

