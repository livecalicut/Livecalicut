-- LiveCalicut Sprint 10: Real Estate & Properties Module Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Property Categories Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_categories (
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
-- 2. Property Agencies Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT,
    description TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'suspended')) NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 3. Property Agents Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    agency_id UUID REFERENCES public.property_agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    experience_years INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 4. Properties Core Entity Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    agency_id UUID REFERENCES public.property_agencies(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES public.property_agents(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.property_categories(id) ON DELETE RESTRICT NOT NULL,
    listing_type TEXT DEFAULT 'sell' CHECK (listing_type IN ('buy', 'sell', 'rent', 'lease')) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    is_negotiable BOOLEAN DEFAULT FALSE NOT NULL,
    bedrooms INT DEFAULT 0 NOT NULL,
    bathrooms INT DEFAULT 0 NOT NULL,
    area_sqft NUMERIC(10, 2) NOT NULL,
    built_up_sqft NUMERIC(10, 2),
    parking_spaces INT DEFAULT 0 NOT NULL,
    floor_number INT DEFAULT 0 NOT NULL,
    furnished_status TEXT DEFAULT 'semi_furnished' CHECK (furnished_status IN ('unfurnished', 'semi_furnished', 'fully_furnished')) NOT NULL,
    property_age_years INT DEFAULT 0 NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    google_maps_link TEXT,
    address TEXT,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'sold', 'rented')) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    favorites_count INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 5. Property Images Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT
);

----------------------------------------------------
-- 6. Property Features Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    feature_name TEXT NOT NULL,
    feature_value TEXT NOT NULL
);

----------------------------------------------------
-- 7. Property Amenities Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    amenity_name TEXT NOT NULL,
    UNIQUE(property_id, amenity_name)
);

----------------------------------------------------
-- 8. Property Inquiries Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 9. Property Favorites Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, property_id)
);

----------------------------------------------------
-- 10. Property Reports Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.property_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- Indexes for Fast Real Estate Filtering
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties(category_id);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON public.properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);

----------------------------------------------------
-- RLS Policies Setup
----------------------------------------------------
ALTER TABLE public.property_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public property categories view" ON public.property_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public agencies view" ON public.property_agencies FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public agents view" ON public.property_agents FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public properties view" ON public.properties FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Users insert properties" ON public.properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Owners update properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id);

----------------------------------------------------
-- Seed Categories for Real Estate
----------------------------------------------------
INSERT INTO public.property_categories (id, name, slug) VALUES
('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Apartments & Flats', 'apartments-flats'),
('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Villas & Houses', 'villas-houses'),
('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Plots & Land', 'plots-land'),
('h1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Commercial & Offices', 'commercial-offices')
ON CONFLICT (slug) DO NOTHING;
