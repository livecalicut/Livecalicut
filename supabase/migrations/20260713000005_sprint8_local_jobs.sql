-- LiveCalicut Sprint 8: Local Jobs Board Module Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Companies Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    description TEXT NOT NULL,
    industry TEXT NOT NULL, -- e.g., 'IT & Cyberpark', 'Retail & Textiles', 'Healthcare'
    website TEXT,
    email TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    address TEXT,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    social_links JSONB DEFAULT '{}'::jsonb NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 2. Company Media Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.company_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT
);

----------------------------------------------------
-- 3. Job Categories Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT,
    display_order INT DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 4. Job Skills Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

----------------------------------------------------
-- 5. Jobs Core Entity Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.job_categories(id) ON DELETE RESTRICT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    experience TEXT DEFAULT 'Fresher / Experienced' NOT NULL,
    education TEXT,
    salary TEXT NOT NULL,
    salary_type TEXT DEFAULT 'monthly' CHECK (salary_type IN ('monthly', 'yearly', 'daily', 'hourly')) NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'internship', 'temporary', 'contract', 'freelance', 'walk-in', 'wfh')) NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    openings_count INT DEFAULT 1 NOT NULL,
    application_deadline TIMESTAMPTZ,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'closed')) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 6. Job Applications Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')) NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    UNIQUE(job_id, applicant_id)
);

----------------------------------------------------
-- 7. Saved Jobs Bookmarks Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, job_id)
);

----------------------------------------------------
-- Indexes for Performance Querying
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.job_applications(applicant_id);

----------------------------------------------------
-- Row Level Security (RLS) Matrix
----------------------------------------------------
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public companies view" ON public.companies FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public job categories view" ON public.job_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public published jobs view" ON public.jobs FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Employers insert jobs" ON public.jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Applicants insert applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Applicants view own applications" ON public.job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Users insert saved jobs" ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own saved jobs" ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);

----------------------------------------------------
-- Seed Categories for Jobs
----------------------------------------------------
INSERT INTO public.job_categories (id, name, slug) VALUES
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Software & IT (Cyberpark)', 'software-it'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Retail & Sales', 'retail-sales'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Healthcare & Clinical', 'healthcare-clinical'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Hotels & Dining', 'hotels-dining')
ON CONFLICT (slug) DO NOTHING;
