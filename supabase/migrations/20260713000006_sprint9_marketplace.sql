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
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Electronics & Gadgets', 'electronics-gadgets'),
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Mobiles & Tablets', 'mobiles-tablets'),
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Vehicles & Motorcycles', 'vehicles-motorcycles'),
('g1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'Furniture & Home Decor', 'furniture-decor')
ON CONFLICT (slug) DO NOTHING;
