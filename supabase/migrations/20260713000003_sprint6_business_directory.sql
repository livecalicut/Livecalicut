-- LiveCalicut Sprint 6: Business Directory Module Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

----------------------------------------------------
-- 1. Business Categories Table
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

----------------------------------------------------
-- 2. Business Subcategories Table
----------------------------------------------------
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

----------------------------------------------------
-- 3. Businesses Core Entity Table
----------------------------------------------------
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
    location GEOGRAPHY(POINT, 4326),
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
-- 4. Business Images Gallery Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
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
-- 5. Business Hours Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6) NOT NULL, -- 0=Sunday, 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT FALSE NOT NULL,
    UNIQUE(business_id, day_of_week)
);

----------------------------------------------------
-- 6. Business Contacts Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    contact_type TEXT NOT NULL, -- 'landline', 'mobile', 'manager', 'helpdesk'
    contact_value TEXT NOT NULL,
    name TEXT
);

----------------------------------------------------
-- 7. Business Reviews Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT NOT NULL,
    reply_comment TEXT,
    reply_at TIMESTAMPTZ,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'pending', 'flagged')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 8. Business Review Images Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_review_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES public.business_reviews(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL
);

----------------------------------------------------
-- 9. Business Tags Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(business_id, tag_id)
);

----------------------------------------------------
-- 10. Featured Businesses Queue Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.featured_businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    priority_score INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- Indexes for High Performance Querying
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_businesses_city_id ON public.businesses(city_id);
CREATE INDEX IF NOT EXISTS idx_businesses_area_id ON public.businesses(area_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON public.businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_verification ON public.businesses(verification_status);
CREATE INDEX IF NOT EXISTS idx_businesses_featured ON public.businesses(is_featured);
CREATE INDEX IF NOT EXISTS idx_businesses_search_name ON public.businesses USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.business_reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.business_reviews(user_id);

----------------------------------------------------
-- Trigger: Recalculate Business Average Rating
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_business_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.businesses
    SET 
        rating_avg = (SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0.00) FROM public.business_reviews WHERE business_id = NEW.business_id AND status = 'published' AND deleted_at IS NULL),
        review_count = (SELECT COUNT(*) FROM public.business_reviews WHERE business_id = NEW.business_id AND status = 'published' AND deleted_at IS NULL)
    WHERE id = NEW.business_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_business_review_modified
    AFTER INSERT OR UPDATE OR DELETE ON public.business_reviews
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_business_rating();

----------------------------------------------------
-- Row Level Security (RLS) Policies
----------------------------------------------------
ALTER TABLE public.business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public categories read" ON public.business_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public subcategories read" ON public.business_subcategories FOR SELECT USING (deleted_at IS NULL);

CREATE POLICY "Approved businesses viewable by public" ON public.businesses FOR SELECT
    USING (verification_status = 'approved' OR auth.uid() = owner_id OR EXISTS (
        SELECT 1 FROM public.profiles p JOIN public.roles r ON p.role_id = r.id 
        WHERE p.id = auth.uid() AND r.name IN ('Super Admin', 'City Admin', 'Moderator')
    ));

CREATE POLICY "Authenticated users submit business" ON public.businesses FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owners update own business" ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Reviews viewable by public" ON public.business_reviews FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Users insert reviews" ON public.business_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

----------------------------------------------------
-- Seed Default Categories for Kozhikode
----------------------------------------------------
INSERT INTO public.business_categories (id, name, slug, icon_name, display_order) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Dining & Cafes', 'dining-cafes', 'Utensils', 1),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Textiles & Shopping', 'textiles-shopping', 'ShoppingBag', 2),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Hospitals & Clinics', 'hospitals-clinics', 'Activity', 3),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'IT & Cyberpark Firms', 'it-cyberpark', 'Laptop', 4),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'Home & Auto Services', 'home-auto-services', 'Wrench', 5),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380006', 'Hotels & Resorts', 'hotels-resorts', 'Hotel', 6)
ON CONFLICT (slug) DO NOTHING;
