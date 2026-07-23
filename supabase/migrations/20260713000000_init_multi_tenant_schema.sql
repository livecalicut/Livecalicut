-- LiveCalicut Multi-Tenant Enterprise Schema Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

-- Enable PostGIS & Full-Text Search Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum Definitions
CREATE TYPE user_role AS ENUM ('super_admin', 'city_admin', 'merchant', 'user');
CREATE TYPE listing_status AS ENUM ('pending', 'approved', 'rejected', 'featured');
CREATE TYPE job_type AS ENUM ('full_time', 'part_time', 'walk_in', 'gig', 'freelance');
CREATE TYPE item_condition AS ENUM ('new', 'like_new', 'used');

----------------------------------------------------
-- 1. Cities & Spatial Tenant Tables
----------------------------------------------------
CREATE TABLE public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT DEFAULT 'Kerala' NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., Mavoor Road, Kozhikode Beach, Palayam, Cyberpark
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 2. Extended Profiles & RBAC
----------------------------------------------------
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    city_id UUID REFERENCES public.cities(id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

----------------------------------------------------
-- 3. Commercial Taxonomy & Business Directory
----------------------------------------------------
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon_name TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    ward_id UUID REFERENCES public.wards(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    location GEOGRAPHY(POINT, 4326),
    logo_url TEXT,
    images TEXT[] DEFAULT '{}',
    status listing_status DEFAULT 'pending'::listing_status NOT NULL,
    rating_avg NUMERIC(3, 2) DEFAULT 0.00 NOT NULL,
    review_count INT DEFAULT 0 NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_businesses_city ON public.businesses(city_id);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_search ON public.businesses USING gin(name gin_trgm_ops);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved businesses viewable by everyone" 
    ON public.businesses FOR SELECT 
    USING (status = 'approved' OR status = 'featured' OR auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'city_admin' OR role = 'super_admin')
    ));

CREATE POLICY "Authenticated users insert business listing" 
    ON public.businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Owners or Admins update business listing" 
    ON public.businesses FOR UPDATE USING (auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'city_admin' OR role = 'super_admin')
    ));

----------------------------------------------------
-- 4. Reviews & Rating Subsystem
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

CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

----------------------------------------------------
-- 5. Jobs & Cyberpark Hiring Vertical
----------------------------------------------------
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
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
CREATE POLICY "Jobs viewable by everyone" ON public.jobs FOR SELECT USING (is_active = TRUE OR auth.uid() = employer_id);
CREATE POLICY "Employers create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);

----------------------------------------------------
-- 6. Local News & Articles Vertical
----------------------------------------------------
CREATE TABLE public.news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news viewable by public" ON public.news_articles FOR SELECT USING (is_published = TRUE);

----------------------------------------------------
-- 7. Buy & Sell Classifieds Vertical
----------------------------------------------------
CREATE TABLE public.marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    condition item_condition DEFAULT 'used'::item_condition NOT NULL,
    description TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Marketplace items viewable by public" ON public.marketplace_items FOR SELECT USING (is_available = TRUE OR auth.uid() = seller_id);
CREATE POLICY "Users insert classified items" ON public.marketplace_items FOR INSERT WITH CHECK (auth.uid() = seller_id);

----------------------------------------------------
-- 8. Razorpay Subscriptions & Commerce
----------------------------------------------------
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    plan_tier TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = merchant_id);

----------------------------------------------------
-- Seed Initial Tenant (Kozhikode / Calicut)
----------------------------------------------------
INSERT INTO public.cities (name, slug, state, latitude, longitude) VALUES
('Kozhikode (Calicut)', 'kozhikode', 'Kerala', 11.2588, 75.7804)
ON CONFLICT (slug) DO NOTHING;
