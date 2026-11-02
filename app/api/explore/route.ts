import { NextResponse } from 'next/server';
import { ExploreService } from '@/lib/services/explore.service';
import { isMissingTable } from '@/lib/api/errors';

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
    if (!isMissingTable(err)) console.error('Explore API error:', err);
    return NextResponse.json({
      data: {
        places: [],
        restaurants: [],
        hotels: [],
        experiences: [],
      },
    });
  }
}
