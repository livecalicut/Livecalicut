import { NextResponse } from 'next/server';
import { OffersService } from '@/lib/services/offers.service';

export const revalidate = 60;

/**
 * Public GET: Return active offers for citizens and visitors
 */
export async function GET() {
  try {
    const offers = await OffersService.getAllOffers({ activeOnly: true });
    return NextResponse.json({ success: true, offers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to load offers' }, { status: 500 });
  }
}
