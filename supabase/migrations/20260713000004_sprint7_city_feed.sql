-- LiveCalicut Sprint 7: City Feed Module Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. News Categories Table
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

----------------------------------------------------
-- 2. News Table
----------------------------------------------------
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
-- 3. News Media Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID REFERENCES public.news(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0 NOT NULL
);

----------------------------------------------------
-- 4. Event Categories Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_categories (
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
-- 5. Organizers Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    avatar TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 6. Events Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    organizer_id UUID REFERENCES public.organizers(id) ON DELETE SET NULL,
    venue TEXT NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    google_maps_link TEXT,
    category_id UUID REFERENCES public.event_categories(id) ON DELETE RESTRICT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    registration_link TEXT,
    website TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    banner TEXT,
    gallery JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_ticket_required BOOLEAN DEFAULT FALSE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'archived')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 7. Event Media Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    caption TEXT
);

----------------------------------------------------
-- 8. Announcements Table (Government & Priority Notices)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'government' CHECK (type IN ('government', 'traffic', 'weather', 'emergency')) NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 9. Featured Posts Spotlight Queue Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.featured_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT CHECK (entity_type IN ('news', 'event', 'announcement')) NOT NULL,
    entity_id UUID NOT NULL,
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
-- Indexes for Fast Feed Queries
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date ASC);

----------------------------------------------------
-- RLS Security Matrix Setup
----------------------------------------------------
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read news categories" ON public.news_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read news" ON public.news FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Public read event categories" ON public.event_categories FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (status = 'published' AND deleted_at IS NULL);
CREATE POLICY "Public read organizers" ON public.organizers FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (deleted_at IS NULL);

----------------------------------------------------
-- Seed Categories for News & Events
----------------------------------------------------
INSERT INTO public.news_categories (id, name, slug) VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Infrastructure', 'infrastructure'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'City Updates', 'city-updates'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Culture & Festivals', 'culture-festivals'),
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'IT & Cyberpark', 'it-cyberpark')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.event_categories (id, name, slug) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Cultural Fests', 'cultural-fests'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Food & Culinary Expo', 'food-expo'),
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Tech Meetups', 'tech-meetups')
ON CONFLICT (slug) DO NOTHING;
