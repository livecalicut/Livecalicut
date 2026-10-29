import { createClient } from '@/lib/supabase/client';
import { BusinessService } from '@/lib/services/business.service';
import { JobService } from '@/lib/services/job.service';
import { ExploreService } from '@/lib/services/explore.service';

export class PublicGatewayService {
  private static supabase = createClient();

  static async getHomepagePayload(citySlug: string = 'calicut') {
    // Each section degrades to empty on its own so one failing module can't 500 the homepage
    const [businessesRes, jobsRes, placesRes] = await Promise.allSettled([
      BusinessService.getFeaturedBusinesses(),
      JobService.getJobs({ isFeatured: true, limit: 4 }),
      ExploreService.getPlaces(),
    ]);
    const featuredBusinesses = businessesRes.status === 'fulfilled' ? businessesRes.value : [];
    const activeJobs = jobsRes.status === 'fulfilled' ? jobsRes.value : { data: [] };
    const explorePlaces = placesRes.status === 'fulfilled' ? placesRes.value : [];

    return {
      cityName: citySlug === 'calicut' ? 'Calicut' : citySlug.toUpperCase(),
      citySlug,
      featuredBusinesses: featuredBusinesses.slice(0, 6),
      cyberparkJobs: (activeJobs.data || []).slice(0, 4),
      exploreSpots: explorePlaces.slice(0, 3),
      bannerAlerts: [
        'Malabar Literature Festival passes live in Calicut!',
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
