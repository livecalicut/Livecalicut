-- LiveCalicut production patch: Marketplace, Properties, Explore
-- Generated 2026-10-29 from migrations 20260713000006, 20260713000007 and
-- 20260713000009 (verbatim) followed by an RLS hardening section.
--
-- Run AFTER supabase/patches/20261029_events_media_audit.sql.
-- Prerequisites already present in production: cities, areas, profiles,
-- businesses, roles, user_roles.
-- Runs as one transaction: any error rolls back everything.
-- Paste into Supabase Dashboard -> SQL -> New query -> Run.

BEGIN;

-- =====================================================================
-- 20260713000006_sprint9_marketplace.sql
-- =====================================================================
-- LiveCalicut Sprint 9: Buy & Sell Marketplace Module Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Seller Profiles Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seller_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'suspended')) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 2. Marketplace Categories Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_categories (
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
-- 3. Marketplace Items Core Entity Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.seller_profiles(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.marketplace_categories(id) ON DELETE RESTRICT NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    price_type TEXT DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'negotiable', 'contact_for_price')) NOT NULL,
    is_negotiable BOOLEAN DEFAULT FALSE NOT NULL,
    condition TEXT DEFAULT 'used_good' CHECK (condition IN ('brand_new', 'like_new', 'used_good', 'used_fair')) NOT NULL,
    brand TEXT,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    cover_image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived')) NOT NULL,
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
-- 4. Marketplace Images Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0 NOT NULL
);

----------------------------------------------------
-- 5. Marketplace Attributes Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
    attribute_name TEXT NOT NULL,
    attribute_value TEXT NOT NULL
);

----------------------------------------------------
-- 6. Marketplace Favorites Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, item_id)
);

----------------------------------------------------
-- 7. Marketplace Reports Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketplace_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE NOT NULL,
    reason TEXT NOT NULL, -- 'spam', 'fake_item', 'prohibited', 'overpriced'
    details TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- Trigger: Auto Favorites Counter Recalculation
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.recalculate_item_favorites()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.marketplace_items
    SET favorites_count = (SELECT COUNT(*) FROM public.marketplace_favorites WHERE item_id = NEW.item_id)
    WHERE id = NEW.item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_marketplace_favorite_modified
    AFTER INSERT OR DELETE ON public.marketplace_favorites
    FOR EACH ROW EXECUTE FUNCTION public.recalculate_item_favorites();

----------------------------------------------------
-- RLS Policies Setup
----------------------------------------------------
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public sellers view" ON public.seller_profiles FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public marketplace categories view" ON public.marketplace_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public items view" ON public.marketplace_items FOR SELECT USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "Sellers create items" ON public.marketplace_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Sellers update own items" ON public.marketplace_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users favorite items" ON public.marketplace_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

----------------------------------------------------
-- Seed Categories for Marketplace
----------------------------------------------------
INSERT INTO public.marketplace_categories (id, name, slug) VALUES
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Electronics & Gadgets', 'electronics-gadgets'),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Mobiles & Tablets', 'mobiles-tablets'),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Vehicles & Motorcycles', 'vehicles-motorcycles'),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Furniture & Home Decor', 'furniture-decor')
ON CONFLICT (slug) DO NOTHING;


-- =====================================================================
-- 20260713000007_sprint10_properties.sql
-- =====================================================================
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
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Apartments & Flats', 'apartments-flats'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Villas & Houses', 'villas-houses'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Plots & Land', 'plots-land'),
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Commercial & Offices', 'commercial-offices')
ON CONFLICT (slug) DO NOTHING;


-- =====================================================================
-- 20260713000009_sprint14_explore.sql
-- =====================================================================
-- LiveCalicut Sprint 14: Explore Calicut Platform Migration
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
-- Seed Categories for Explore Calicut
----------------------------------------------------
INSERT INTO public.place_categories (id, name, slug) VALUES
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Beaches & Waterfronts', 'beaches-waterfronts'),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Historical Sites & Forts', 'historical-sites'),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'SM Street & Shopping Malls', 'sm-street-shopping'),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Culinary Trails & Dining', 'culinary-trails')
ON CONFLICT (slug) DO NOTHING;


-- =====================================================================
-- Security hardening for the three migrations above
-- =====================================================================

-- Pin search_path on the favorites trigger function (SECURITY DEFINER)
ALTER FUNCTION public.recalculate_item_favorites() SET search_path = public;

-- ---------------------------------------------------------------------
-- marketplace_items / properties: users (staff included) create and edit
-- only rows they own, and cannot reassign ownership.
-- Moderation/admin actions use the service-role key and bypass RLS.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Sellers create items" ON public.marketplace_items;
DROP POLICY IF EXISTS "Sellers create own items" ON public.marketplace_items;
CREATE POLICY "Sellers create own items" ON public.marketplace_items
  FOR INSERT TO authenticated
  WITH CHECK (
    seller_id = auth.uid()
  );

DROP POLICY IF EXISTS "Sellers update own items" ON public.marketplace_items;
CREATE POLICY "Sellers update own items" ON public.marketplace_items
  FOR UPDATE TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

DROP POLICY IF EXISTS "Sellers view own items" ON public.marketplace_items;
CREATE POLICY "Sellers view own items" ON public.marketplace_items
  FOR SELECT TO authenticated
  USING (seller_id = auth.uid());

DROP POLICY IF EXISTS "Users insert properties" ON public.properties;
DROP POLICY IF EXISTS "Owners create properties" ON public.properties;
CREATE POLICY "Owners create properties" ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
  );

DROP POLICY IF EXISTS "Owners update properties" ON public.properties;
CREATE POLICY "Owners update properties" ON public.properties
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners view own properties" ON public.properties;
CREATE POLICY "Owners view own properties" ON public.properties
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

-- ---------------------------------------------------------------------
-- Child tables the migrations left WITHOUT row level security.
-- ---------------------------------------------------------------------
ALTER TABLE public.marketplace_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_features      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_gallery          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_menu        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_gallery          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_bookmarks   ENABLE ROW LEVEL SECURITY;

-- Listing media/details: public read; writes by the listing's owner,
-- matching the create APIs.
DROP POLICY IF EXISTS "Public read marketplace images" ON public.marketplace_images;
CREATE POLICY "Public read marketplace images" ON public.marketplace_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners add marketplace images" ON public.marketplace_images;
CREATE POLICY "Owners add marketplace images" ON public.marketplace_images
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.marketplace_items i
    WHERE i.id = item_id
      AND i.seller_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Public read marketplace attributes" ON public.marketplace_attributes;
CREATE POLICY "Public read marketplace attributes" ON public.marketplace_attributes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read property images" ON public.property_images;
CREATE POLICY "Public read property images" ON public.property_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owners add property images" ON public.property_images;
CREATE POLICY "Owners add property images" ON public.property_images
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_id
      AND p.owner_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Public read property features" ON public.property_features;
CREATE POLICY "Public read property features" ON public.property_features FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read property amenities" ON public.property_amenities;
CREATE POLICY "Public read property amenities" ON public.property_amenities FOR SELECT USING (true);

-- Inquiries hold enquirer contact details: visible only to the enquirer
-- and the listing owner.
DROP POLICY IF EXISTS "Users create own inquiries" ON public.property_inquiries;
CREATE POLICY "Users create own inquiries" ON public.property_inquiries
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Enquirer or owner reads inquiries" ON public.property_inquiries;
CREATE POLICY "Enquirer or owner reads inquiries" ON public.property_inquiries
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.owner_id = auth.uid())
  );

-- Reports: no client policies — written and read via the service-role key only.

-- Favorites / bookmarks: each user manages only their own rows.
DROP POLICY IF EXISTS "Users read own marketplace favorites" ON public.marketplace_favorites;
CREATE POLICY "Users read own marketplace favorites" ON public.marketplace_favorites
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users delete own marketplace favorites" ON public.marketplace_favorites;
CREATE POLICY "Users delete own marketplace favorites" ON public.marketplace_favorites
  FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users read own property favorites" ON public.property_favorites;
CREATE POLICY "Users read own property favorites" ON public.property_favorites
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users add own property favorites" ON public.property_favorites;
CREATE POLICY "Users add own property favorites" ON public.property_favorites
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Users delete own property favorites" ON public.property_favorites;
CREATE POLICY "Users delete own property favorites" ON public.property_favorites
  FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own experience bookmarks" ON public.experience_bookmarks;
CREATE POLICY "Users manage own experience bookmarks" ON public.experience_bookmarks
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Explore content: public read; reviews written by their author.
DROP POLICY IF EXISTS "Public read place gallery" ON public.place_gallery;
CREATE POLICY "Public read place gallery" ON public.place_gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read restaurant menu" ON public.restaurant_menu;
CREATE POLICY "Public read restaurant menu" ON public.restaurant_menu FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read hotel gallery" ON public.hotel_gallery;
CREATE POLICY "Public read hotel gallery" ON public.hotel_gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read place reviews" ON public.place_reviews;
CREATE POLICY "Public read place reviews" ON public.place_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users write own place reviews" ON public.place_reviews;
CREATE POLICY "Users write own place reviews" ON public.place_reviews
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

NOTIFY pgrst, 'reload schema';

COMMIT;
