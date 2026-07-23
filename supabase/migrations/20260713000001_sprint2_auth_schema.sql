-- LiveCalicut Sprint 2: Authentication & User Management Schema
-- Author: Chief Product Architect
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Cities Table (Multi-city Spatial Partitioning)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    state TEXT DEFAULT 'Kerala' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 2. Roles Table (RBAC Matrix)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL, -- 'Guest', 'User', 'Merchant', 'Moderator', 'City Admin', 'Super Admin'
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 3. Profiles Table (Extends Supabase auth.users)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 4. User Preferences Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    theme TEXT DEFAULT 'dark' NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE NOT NULL,
    preferred_language TEXT DEFAULT 'en' NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- Seed Roles & Default Cities
----------------------------------------------------
INSERT INTO public.cities (id, name, slug, state) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Kozhikode (Calicut)', 'kozhikode', 'Kerala')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.roles (id, name, description) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'Guest', 'Unauthenticated public visitor'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'User', 'Registered consumer resident'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'Merchant', 'Business listing owner'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'Moderator', 'Content & review moderator'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'City Admin', 'Kozhikode city platform manager'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'Super Admin', 'Enterprise root administrator')
ON CONFLICT (name) DO NOTHING;

----------------------------------------------------
-- Row Level Security (RLS) Policies
----------------------------------------------------
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Cities RLS
CREATE POLICY "Cities viewable by public" ON public.cities FOR SELECT USING (deleted_at IS NULL);

-- Roles RLS
CREATE POLICY "Roles viewable by public" ON public.roles FOR SELECT USING (deleted_at IS NULL);

-- Profiles RLS
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id AND deleted_at IS NULL);

-- User Preferences RLS
CREATE POLICY "Users view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id AND deleted_at IS NULL);

----------------------------------------------------
-- Automated Profile Creation Trigger
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
    default_city_id UUID;
BEGIN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'User' LIMIT 1;
    SELECT id INTO default_city_id FROM public.cities WHERE slug = 'kozhikode' LIMIT 1;

    INSERT INTO public.profiles (id, city_id, role_id, full_name, email, avatar, status)
    VALUES (
        new.id,
        default_city_id,
        default_role_id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'LiveCalicut Resident'),
        new.email,
        new.raw_user_meta_data->>'avatar_url',
        'active'
    );

    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_signed_up
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();
