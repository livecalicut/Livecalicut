-- LiveCalicut Hyperlocal Database Schema Migration
-- Author: Lead Software Architect
-- Created: 2026-07-13

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum Types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'business_owner', 'user');
CREATE TYPE listing_status AS ENUM ('pending', 'approved', 'rejected', 'featured');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'walk_in', 'gig', 'freelance');
CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'used');

----------------------------------------------------
-- 1. Profiles Table (Extends Supabase auth.users)
----------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

----------------------------------------------------
-- 2. Businesses Directory Table
----------------------------------------------------
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    address TEXT NOT NULL,
    ward_location TEXT NOT NULL, -- e.g., Mavoor Road, Kozhikode Beach, Palayam, Cyberpark
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    logo_url TEXT,
    images TEXT[] DEFAULT '{}',
    opening_hours JSONB DEFAULT '{}'::jsonb,
    status listing_status DEFAULT 'pending'::listing_status NOT NULL,
    rating_avg NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
    review_count INT DEFAULT 0 NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_ward ON public.businesses(ward_location);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_search ON public.businesses USING gin(name gin_trgm_ops);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved businesses viewable by everyone" 
    ON public.businesses FOR SELECT 
    USING (status = 'approved' OR status = 'featured' OR auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
    ));

CREATE POLICY "Authenticated users can submit business listing" 
    ON public.businesses FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners or Admins can update business listing" 
    ON public.businesses FOR UPDATE 
    USING (auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
    ));

----------------------------------------------------
-- 3. Business Reviews Table
----------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    status TEXT DEFAULT 'published' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" 
    ON public.reviews FOR SELECT USING (status = 'published');

CREATE POLICY "Users can create reviews" 
    ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

----------------------------------------------------
-- 4. Jobs Board Table
----------------------------------------------------
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_type job_type DEFAULT 'full_time'::job_type NOT NULL,
    location TEXT NOT NULL,
    salary_range TEXT,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    contact_phone TEXT,
    contact_email TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active jobs viewable by everyone" 
    ON public.jobs FOR SELECT USING (is_active = TRUE OR auth.uid() = employer_id);

CREATE POLICY "Users can create job posts" 
    ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Employers can update own jobs" 
    ON public.jobs FOR UPDATE USING (auth.uid() = employer_id);

----------------------------------------------------
-- 5. Marketplace / Classifieds Table
----------------------------------------------------
CREATE TABLE public.marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    condition item_condition DEFAULT 'used'::item_condition NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Marketplace items viewable by everyone" 
    ON public.marketplace_items FOR SELECT USING (is_available = TRUE OR auth.uid() = seller_id);

CREATE POLICY "Users can create marketplace items" 
    ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own marketplace items" 
    ON public.marketplace_items FOR UPDATE USING (auth.uid() = seller_id);

----------------------------------------------------
-- 6. Storage Buckets Config & RLS Setup
----------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES 
('business-gallery', 'business-gallery', true),
('marketplace-items', 'marketplace-items', true),
('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public storage objects viewable by everyone" 
    ON storage.objects FOR SELECT USING (bucket_id IN ('business-gallery', 'marketplace-items', 'user-avatars'));

CREATE POLICY "Authenticated users can upload storage objects" 
    ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

----------------------------------------------------
-- 7. Triggers for Automatic User Profile Creation
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'LiveCalicut Member'),
        new.email,
        new.raw_user_meta_data->>'avatar_url',
        'user'::user_role
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

----------------------------------------------------
-- 8. Trigger for Recalculating Business Rating Avg
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.businesses
    SET 
        rating_avg = (SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00) FROM public.reviews WHERE business_id = NEW.business_id AND status = 'published'),
        review_count = (SELECT COUNT(*) FROM public.reviews WHERE business_id = NEW.business_id AND status = 'published')
    WHERE id = NEW.business_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_review_changed
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_business_rating();
