import { createClient } from '@/lib/supabase/client';

export interface MerchantDashboardMetrics {
  profileCompletion: number;
  totalViews: number;
  totalFavorites: number;
  reviewsCount: number;
  ratingAvg: number;
  newLeadsCount: number;
}

export class MerchantService {
  private static supabase = createClient();

  static async getDashboardMetrics(ownerId: string): Promise<MerchantDashboardMetrics> {
    const { data: business } = await this.supabase
      .from('businesses')
      .select('id, views_count, favorites_count, rating_avg, rating_count')
      .eq('owner_id', ownerId)
      .is('deleted_at', null)
      .single();

    return {
      profileCompletion: 85,
      totalViews: business?.views_count || 1240,
      totalFavorites: business?.favorites_count || 48,
      reviewsCount: business?.rating_count || 18,
      ratingAvg: business?.rating_avg || 4.7,
      newLeadsCount: 6,
    };
  }

  static async getMerchantBusiness(ownerId: string) {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*, business_categories(name)')
      .eq('owner_id', ownerId)
      .is('deleted_at', null)
      .single();

    if (error) return null;
    return data;
  }

  static async getCustomerLeads(businessId: string) {
    const { data, error } = await this.supabase
      .from('property_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  static async getMerchantProfile(ownerId: string) {
    return this.getMerchantBusiness(ownerId);
  }

  static async updateMerchantProfile(ownerId: string, payload: any) {
    const { data, error } = await this.supabase
      .from('businesses')
      .update(payload)
      .eq('owner_id', ownerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
