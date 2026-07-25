import type { SupabaseClient } from '@supabase/supabase-js';

export interface MerchantDashboardMetrics {
  profileCompletion: number;
  totalViews: number;
  totalReviews: number;
  ratingAvg: number;
  newLeadsCount: number;
  listingsCount: number;
  hasBusiness: boolean;
}

export type MerchantLead = {
  id: string;
  kind: 'property' | 'job';
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  subject: string;
  created_at: string;
};

/** Fields a merchant is expected to fill in for a complete public listing. */
const PROFILE_FIELDS = [
  'name',
  'description',
  'short_description',
  'phone',
  'email',
  'website',
  'whatsapp',
  'latitude',
  'longitude',
  'category_id',
  'area_id',
] as const;

export class MerchantService {
  /** All non-deleted businesses owned by this user. A merchant may own several. */
  static async getOwnedBusinesses(supabase: SupabaseClient, ownerId: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*, business_categories(name)')
      .eq('owner_id', ownerId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[MerchantService.getOwnedBusinesses]', error.message);
      return [];
    }
    return data ?? [];
  }

  static async getDashboardMetrics(
    supabase: SupabaseClient,
    ownerId: string
  ): Promise<MerchantDashboardMetrics> {
    const businesses = await this.getOwnedBusinesses(supabase, ownerId);

    if (businesses.length === 0) {
      return {
        profileCompletion: 0,
        totalViews: 0,
        totalReviews: 0,
        ratingAvg: 0,
        newLeadsCount: 0,
        listingsCount: 0,
        hasBusiness: false,
      };
    }

    const totalViews = businesses.reduce((sum, b) => sum + (b.view_count ?? 0), 0);
    const totalReviews = businesses.reduce((sum, b) => sum + (b.review_count ?? 0), 0);

    // Weight each business's average by its review count so the headline rating
    // is a true aggregate rather than an average of averages.
    const weighted = businesses.reduce(
      (sum, b) => sum + Number(b.rating_avg ?? 0) * (b.review_count ?? 0),
      0
    );
    const ratingAvg = totalReviews > 0 ? Number((weighted / totalReviews).toFixed(2)) : 0;

    const filled = businesses[0]
      ? PROFILE_FIELDS.filter((field) => {
          const value = businesses[0][field];
          return value !== null && value !== undefined && String(value).trim() !== '';
        }).length
      : 0;
    const profileCompletion = Math.round((filled / PROFILE_FIELDS.length) * 100);

    const leads = await this.getCustomerLeads(supabase, ownerId);

    return {
      profileCompletion,
      totalViews,
      totalReviews,
      ratingAvg,
      newLeadsCount: leads.filter((lead) => lead.status === 'pending').length,
      listingsCount: businesses.length,
      hasBusiness: true,
    };
  }

  /**
   * Inquiries and applications for listings this owner actually owns.
   *
   * The previous implementation selected every row in `property_inquiries`
   * with no owner filter, exposing other merchants' leads.
   */
  static async getCustomerLeads(
    supabase: SupabaseClient,
    ownerId: string
  ): Promise<MerchantLead[]> {
    const [{ data: properties }, { data: jobs }] = await Promise.all([
      supabase.from('properties').select('id, title').eq('owner_id', ownerId).is('deleted_at', null),
      supabase.from('jobs').select('id, title').eq('created_by', ownerId).is('deleted_at', null),
    ]);

    const propertyIds = (properties ?? []).map((p) => p.id);
    const jobIds = (jobs ?? []).map((j) => j.id);

    const propertyTitles = new Map((properties ?? []).map((p) => [p.id, p.title as string]));
    const jobTitles = new Map((jobs ?? []).map((j) => [j.id, j.title as string]));

    const [inquiries, applications] = await Promise.all([
      propertyIds.length
        ? supabase
            .from('property_inquiries')
            .select('id, property_id, name, email, phone, message, status, created_at')
            .in('property_id', propertyIds)
            .order('created_at', { ascending: false })
            .limit(100)
        : Promise.resolve({ data: [], error: null }),
      jobIds.length
        ? supabase
            .from('job_applications')
            .select('id, job_id, email, phone, cover_letter, status, created_at, profiles(full_name)')
            .in('job_id', jobIds)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(100)
        : Promise.resolve({ data: [], error: null }),
    ]);

    const nameOf = (rel: unknown): string | undefined => {
      if (Array.isArray(rel)) return (rel[0] as { full_name?: string } | undefined)?.full_name;
      return (rel as { full_name?: string } | null)?.full_name;
    };

    const propertyLeads: MerchantLead[] = (inquiries.data ?? []).map((row: any) => ({
      id: row.id,
      kind: 'property',
      name: row.name ?? 'Unknown',
      email: row.email ?? '',
      phone: row.phone ?? '',
      message: row.message ?? '',
      status: row.status ?? 'pending',
      subject: propertyTitles.get(row.property_id) ?? 'Property inquiry',
      created_at: row.created_at,
    }));

    const jobLeads: MerchantLead[] = (applications.data ?? []).map((row: any) => ({
      id: row.id,
      kind: 'job',
      name: nameOf(row.profiles) ?? 'Applicant',
      email: row.email ?? '',
      phone: row.phone ?? '',
      message: row.cover_letter ?? '',
      status: row.status ?? 'pending',
      subject: jobTitles.get(row.job_id) ?? 'Job application',
      created_at: row.created_at,
    }));

    return [...propertyLeads, ...jobLeads].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async getMerchantBusiness(supabase: SupabaseClient, ownerId: string) {
    const businesses = await this.getOwnedBusinesses(supabase, ownerId);
    return businesses[0] ?? null;
  }

  static async getMerchantProfile(supabase: SupabaseClient, ownerId: string) {
    return this.getMerchantBusiness(supabase, ownerId);
  }

  static async updateMerchantProfile(
    supabase: SupabaseClient,
    ownerId: string,
    payload: Record<string, unknown>
  ) {
    const business = await this.getMerchantBusiness(supabase, ownerId);
    if (!business) throw new Error('No business registered for this account');

    const { data, error } = await supabase
      .from('businesses')
      .update(payload)
      .eq('id', business.id)
      .eq('owner_id', ownerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
