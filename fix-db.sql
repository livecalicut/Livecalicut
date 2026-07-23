-- FINAL DATABASE FIX SCRIPT
-- Copy this entire file and run it in the Supabase SQL Editor

-- 1. Drop conflicting tables to reset the auth schema
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- 2. Recreate Roles (Sprint 31 format)
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Roles
INSERT INTO public.roles (name, description) VALUES
    ('Guest', 'Unauthenticated public visitor'),
    ('User', 'Authenticated resident user'),
    ('Merchant', 'Kozhikode business owner and service provider'),
    ('Moderator', 'Content & review moderation editor'),
    ('City Admin', 'Municipal content administrator'),
    ('Super Admin', 'Full platform engine superuser');

-- 3. Recreate Profiles (Sprint 31 format + Sprint 5 compatibility)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    avatar TEXT,
    city VARCHAR(100) DEFAULT 'Kozhikode',
    area VARCHAR(100),
    bio TEXT,
    account_status VARCHAR(20) DEFAULT 'active',
    verification_status VARCHAR(20) DEFAULT 'unverified',
    status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_city_id ON public.profiles(city_id);

-- 4. Recreate User Roles Table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 5. Fix Trigger Function to handle the new columns properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    default_role_id UUID;
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url, avatar, city)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'city', 'Kozhikode')
    );

    SELECT id INTO default_role_id FROM public.roles WHERE name = 'User' LIMIT 1;

    IF default_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, default_role_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Ensure RLS is enabled and accessible
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Profiles Read" ON public.profiles;
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Read Own Roles" ON public.user_roles;
CREATE POLICY "Users Read Own Roles" ON public.user_roles FOR SELECT USING (true);

-- 7. Restore missing profiles for existing auth users and assign Super Admin!
INSERT INTO public.profiles (id, full_name, email)
SELECT id, email, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role_id)
SELECT u.id, r.id
FROM auth.users u, public.roles r
WHERE r.name = 'Super Admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
