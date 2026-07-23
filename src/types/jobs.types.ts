export type JobType = 'full_time' | 'part_time' | 'walk_in' | 'gig' | 'freelance';

export interface JobPosting {
  id: string;
  employer_id: string;
  business_id?: string;
  title: string;
  company_name: string;
  job_type: JobType;
  location: string;
  salary_range?: string;
  description: string;
  requirements: string[];
  contact_phone?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
