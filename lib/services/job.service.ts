import { createClient } from '@/lib/supabase/client';

export class JobService {
  private static supabase = createClient();

  static async getJobs(filters: {
    employmentType?: string;
    keyword?: string;
    isUrgent?: boolean;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: any[]; total: number }> {
    const page = Math.max(1, filters.page ?? 1);
    const limit = Math.min(100, Math.max(1, filters.limit ?? 20));
    const from = (page - 1) * limit;

    let query = this.supabase
      .from('jobs')
      .select('*, companies(name, slug, logo), job_categories(name, slug)', { count: 'exact' })
      .eq('status', 'published')
      .is('deleted_at', null);

    if (filters.employmentType) query = query.eq('employment_type', filters.employmentType);
    if (filters.isUrgent) query = query.eq('is_urgent', true);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.keyword) {
      const term = filters.keyword.replace(/[%,()]/g, '');
      query = query.ilike('title', `%${term}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);

    if (error) throw error;
    return { data: data || [], total: count ?? 0 };
  }

  static async getJobBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('*, companies(name, slug, logo, description, phone, email, website), job_categories(name, slug)')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (error) throw error;
    return data;
  }

  static async applyForJob(params: {
    jobId: string;
    applicantId: string;
    resumeUrl: string;
    coverLetter?: string;
    phone: string;
    email: string;
  }) {
    const { data, error } = await this.supabase
      .from('job_applications')
      .insert({
        job_id: params.jobId,
        applicant_id: params.applicantId,
        resume_url: params.resumeUrl,
        cover_letter: params.coverLetter,
        phone: params.phone,
        email: params.email,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserApplications(userId: string) {
    const { data, error } = await this.supabase
      .from('job_applications')
      .select('*, jobs(title, slug, salary, companies(name, logo))')
      .eq('applicant_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async toggleSaveJob(userId: string, jobId: string) {
    const { data: existing } = await this.supabase
      .from('saved_jobs')
      .select('id')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (existing) {
      await this.supabase.from('saved_jobs').delete().eq('id', existing.id);
      return false;
    } else {
      await this.supabase.from('saved_jobs').insert({
        user_id: userId,
        job_id: jobId,
      });
      return true;
    }
  }

  static async getCompanies() {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async createJob(payload: any) {
    const { data, error } = await this.supabase
      .from('jobs')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
