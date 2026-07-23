import { createClient } from '@/lib/supabase/client';
import { BusinessService } from '@/lib/services/business.service';
import { JobService } from '@/lib/services/job.service';
import { ExploreService } from '@/lib/services/explore.service';

export class PublicGatewayService {
  private static supabase = createClient();

  static async getHomepagePayload(citySlug: string = 'calicut') {
    const [featuredBusinesses, activeJobs, explorePlaces] = await Promise.all([
      BusinessService.getFeaturedBusinesses(),
      JobService.getJobs({ isFeatured: true }),
      ExploreService.getPlaces(),
    ]);

    return {
      cityName: citySlug === 'calicut' ? 'Kozhikode' : citySlug.toUpperCase(),
      citySlug,
      featuredBusinesses: featuredBusinesses.slice(0, 6),
      cyberparkJobs: activeJobs.slice(0, 4),
      exploreSpots: explorePlaces.slice(0, 3),
      bannerAlerts: [
        'Malabar Literature Festival passes live in Kozhikode!',
        'Cyberpark mega job fair registration open.',
      ],
    };
  }

  static async getCategories() {
    return BusinessService.getCategories();
  }

  static async getCities() {
    const { data, error } = await this.supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}
