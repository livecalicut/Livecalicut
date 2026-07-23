-- LiveCalicut Sprint 14: Explore Kozhikode Platform Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Place Categories Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.place_categories (
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
-- 2. Places Core Entity Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.place_categories(id) ON DELETE RESTRICT NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    google_maps_link TEXT,
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    opening_hours TEXT,
    entry_fee NUMERIC(8, 2) DEFAULT 0 NOT NULL,
    is_free_entry BOOLEAN DEFAULT TRUE NOT NULL,
    contact_phone TEXT,
    website TEXT,
    rating_avg NUMERIC(3, 2) DEFAULT 4.5 NOT NULL,
    rating_count INT DEFAULT 0 NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 3. Place Gallery Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.place_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT
);

----------------------------------------------------
-- 4. Place Reviews Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.place_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 5. Restaurants Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cuisine_type TEXT NOT NULL, -- 'Malabar Traditional', 'Seafood', 'Arabian', 'Multi-Cuisine'
    avg_cost_for_two NUMERIC(8, 2) DEFAULT 500 NOT NULL,
    is_pure_veg BOOLEAN DEFAULT FALSE NOT NULL,
    phone TEXT,
    website TEXT
);

----------------------------------------------------
-- 6. Restaurant Menu Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurant_menu (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(8, 2) NOT NULL,
    is_specialty BOOLEAN DEFAULT FALSE NOT NULL
);

----------------------------------------------------
-- 7. Hotels & Resorts Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    star_rating INT DEFAULT 4 CHECK (star_rating BETWEEN 1 AND 5) NOT NULL,
    starting_price_per_night NUMERIC(10, 2) NOT NULL,
    amenities JSONB DEFAULT '[]'::jsonb NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT
);

----------------------------------------------------
-- 8. Hotel Gallery Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotel_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT
);

----------------------------------------------------
-- 9. Experiences & Food Trails Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    type TEXT DEFAULT 'food_trail' CHECK (type IN ('food_trail', 'walking_tour', 'boat_ride', 'camping')) NOT NULL,
    duration TEXT NOT NULL,
    cost_per_person NUMERIC(8, 2) DEFAULT 0 NOT NULL,
    location TEXT NOT NULL,
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL
);

----------------------------------------------------
-- 10. Experience Bookmarks Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    experience_id UUID REFERENCES public.experiences(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, experience_id)
);

----------------------------------------------------
-- RLS Policies Setup
----------------------------------------------------
ALTER TABLE public.place_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read place categories" ON public.place_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read places" ON public.places FOR SELECT USING (status = 'active' AND deleted_at IS NULL);
CREATE POLICY "Public read restaurants" ON public.restaurants FOR SELECT USING (true);
CREATE POLICY "Public read hotels" ON public.hotels FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON public.experiences FOR SELECT USING (status = 'active');

----------------------------------------------------
-- Seed Categories for Explore Kozhikode
----------------------------------------------------
INSERT INTO public.place_categories (id, name, slug) VALUES
('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Beaches & Waterfronts', 'beaches-waterfronts'),
('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Historical Sites & Forts', 'historical-sites'),
('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'SM Street & Shopping Malls', 'sm-street-shopping'),
('j1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Culinary Trails & Dining', 'culinary-trails')
ON CONFLICT (slug) DO NOTHING;
