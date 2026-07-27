-- LiveCalicut bootstrap schema (greenfield)
-- Paste into Supabase Dashboard → SQL → New query → Run
-- Then: npm run db:seed

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

----------------------------------------------------
-- Core tenancy & auth
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT DEFAULT 'Kerala' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    avatar_url TEXT,
    city TEXT DEFAULT 'Kozhikode',
    area TEXT,
    bio TEXT,
    account_status TEXT DEFAULT 'active',
    verification_status TEXT DEFAULT 'unverified',
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    pincode TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB DEFAULT '{}'::jsonb NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- Business directory
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_categories (
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

CREATE TABLE IF NOT EXISTS public.business_subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.business_categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.business_categories(id) ON DELETE RESTRICT NOT NULL,
    subcategory_id UUID REFERENCES public.business_subcategories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    google_maps_link TEXT,
    social_media JSONB DEFAULT '{}'::jsonb NOT NULL,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    rating_avg NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
    review_count INT DEFAULT 0 NOT NULL,
    view_count INT DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- Jobs
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    description TEXT NOT NULL,
    industry TEXT NOT NULL,
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
-- News
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_categories (
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

CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    category_id UUID REFERENCES public.news_categories(id) ON DELETE RESTRICT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    author TEXT DEFAULT 'LiveCalicut Editorial' NOT NULL,
    source TEXT DEFAULT 'Kozhikode News Desk',
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')) NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    likes_count INT DEFAULT 0 NOT NULL,
    shares_count INT DEFAULT 0 NOT NULL,
    bookmarks_count INT DEFAULT 0 NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- Auth trigger
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_role_id UUID;
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, avatar, city)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'city', 'Kozhikode')
    )
    ON CONFLICT (id) DO NOTHING;

    SELECT id INTO default_role_id FROM public.roles WHERE name = 'User' LIMIT 1;
    IF default_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, default_role_id)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

----------------------------------------------------
-- Public read RLS (anon can list public content)
----------------------------------------------------
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop + recreate public read policies idempotently
  PERFORM 1;
END $$;

DROP POLICY IF EXISTS "public_read_cities" ON public.cities;
CREATE POLICY "public_read_cities" ON public.cities FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_areas" ON public.areas;
CREATE POLICY "public_read_areas" ON public.areas FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_roles" ON public.roles;
CREATE POLICY "public_read_roles" ON public.roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_user_roles" ON public.user_roles;
CREATE POLICY "public_read_user_roles" ON public.user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "public_read_settings" ON public.settings;
CREATE POLICY "public_read_settings" ON public.settings FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_business_categories" ON public.business_categories;
CREATE POLICY "public_read_business_categories" ON public.business_categories FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_business_subcategories" ON public.business_subcategories;
CREATE POLICY "public_read_business_subcategories" ON public.business_subcategories FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_businesses" ON public.businesses;
CREATE POLICY "public_read_businesses" ON public.businesses FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_companies" ON public.companies;
CREATE POLICY "public_read_companies" ON public.companies FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_job_categories" ON public.job_categories;
CREATE POLICY "public_read_job_categories" ON public.job_categories FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_jobs" ON public.jobs;
CREATE POLICY "public_read_jobs" ON public.jobs FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_news_categories" ON public.news_categories;
CREATE POLICY "public_read_news_categories" ON public.news_categories FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_news" ON public.news;
CREATE POLICY "public_read_news" ON public.news FOR SELECT USING (deleted_at IS NULL);

----------------------------------------------------
-- Audit logs (admin activity trail)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_read_audit_logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_insert_audit_logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = admin_id);

-- Seed baseline roles + city so auth trigger works before npm seed
INSERT INTO public.cities (id, name, slug, state, status, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kozhikode (Calicut)', 'kozhikode', 'Kerala', 'active', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.roles (name, description) VALUES
    ('Guest', 'Unauthenticated public visitor'),
    ('User', 'Authenticated resident user'),
    ('Merchant', 'Kozhikode business owner and service provider'),
    ('Moderator', 'Content & review moderation editor'),
    ('City Admin', 'Municipal content administrator'),
    ('Super Admin', 'Full platform engine superuser')
ON CONFLICT (name) DO NOTHING;
