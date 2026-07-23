import { z } from 'zod';

export const createJobSchema = z.object({
  companyId: z.string().uuid('Please select a company'),
  categoryId: z.string().uuid('Please select a job category'),
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.string().optional(),
  requirements: z.string().optional(),
  experience: z.string().default('Fresher / Experienced'),
  salary: z.string().min(1, 'Salary or stipend details required'),
  salaryType: z.enum(['monthly', 'yearly', 'daily', 'hourly']).default('monthly'),
  employmentType: z.enum(['full-time', 'part-time', 'internship', 'temporary', 'contract', 'freelance', 'walk-in', 'wfh']),
  openingsCount: z.number().default(1),
  isUrgent: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const applyJobSchema = z.object({
  jobId: z.string().uuid(),
  resumeUrl: z.string().url('Valid resume URL is required'),
  coverLetter: z.string().optional(),
  phone: z.string().min(10, 'Valid mobile number required'),
  email: z.string().email('Valid email address required'),
});

export const companySchema = z.object({
  name: z.string().min(2, 'Company name is required'),
  slug: z.string().min(2, 'Slug is required'),
  industry: z.string().min(2, 'Industry is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone: z.string().min(10, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
});
