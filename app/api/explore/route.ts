import { NextResponse } from 'next/server';
import { ExploreService } from '@/lib/services/explore.service';

export async function GET() {
  try {
    const [places, restaurants, hotels, experiences] = await Promise.all([
      ExploreService.getPlaces(),
      ExploreService.getRestaurants(),
      ExploreService.getHotels(),
      ExploreService.getExperiences(),
    ]);

    return NextResponse.json({
      data: {
        places,
        restaurants,
        hotels,
        experiences,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
