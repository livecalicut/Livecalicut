-- LiveCalicut Sprint 11: Universal Search & Discovery Engine Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

----------------------------------------------------
-- 1. Search Queries Table (Global Search Log)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    results_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 2. Search History Table (User Recent Searches)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    query_text TEXT NOT NULL,
    filters JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 3. Search Suggestions Table (Autocomplete Registry)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword TEXT UNIQUE NOT NULL,
    category_type TEXT NOT NULL, -- 'business', 'job', 'news', 'marketplace', 'property', 'event'
    popularity_score INT DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 4. Popular Searches Table (Trending Searches Engine)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.popular_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE NOT NULL,
    keyword TEXT NOT NULL,
    search_count INT DEFAULT 1 NOT NULL,
    is_trending BOOLEAN DEFAULT TRUE NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    UNIQUE(city_id, keyword)
);

----------------------------------------------------
-- Indexes for Sub-100ms Search Queries
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_queries_city ON public.search_queries(city_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_trgm ON public.search_suggestions USING gin(keyword gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_popular_trending ON public.popular_searches(city_id, is_trending);

----------------------------------------------------
-- Row Level Security (RLS) Policies
----------------------------------------------------
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popular_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read suggestions" ON public.search_suggestions FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read popular searches" ON public.popular_searches FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users view own history" ON public.search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert history" ON public.search_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own history" ON public.search_history FOR DELETE USING (auth.uid() = user_id);

----------------------------------------------------
-- Seed Popular Trending Searches for Kozhikode
----------------------------------------------------
INSERT INTO public.popular_searches (id, city_id, keyword, search_count, is_trending) VALUES
('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380000', 'Malabar Biryani Paragon', 450, true),
('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380000', 'Cyberpark IT Jobs', 380, true),
('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380000', '3 BHK Villa Bypass', 210, true),
('i1eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380000', 'Pre-owned iPhone', 190, true)
ON CONFLICT (city_id, keyword) DO NOTHING;
