-- Migration SQL: Sprint 31 Auth & Role Management (LiveCalicut Digital Ecosystem)

-- 1. Create Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Platform Roles
INSERT INTO public.roles (name, description) VALUES
    ('Guest', 'Unauthenticated public visitor'),
    ('User', 'Authenticated resident user'),
    ('Merchant', 'Kozhikode business owner and service provider'),
    ('Moderator', 'Content & review moderation editor'),
    ('City Admin', 'Municipal content administrator'),
    ('Super Admin', 'Full platform engine superuser')
ON CONFLICT (name) DO NOTHING;

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    city VARCHAR(100) DEFAULT 'Kozhikode',
    area VARCHAR(100),
    bio TEXT,
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
    verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create User Roles Join Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 4. Create Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Standard Platform Permissions
INSERT INTO public.permissions (code, module, description) VALUES
    ('public:view', 'general', 'View public pages'),
    ('bookmark:manage', 'user', 'Bookmark businesses and listings'),
    ('review:create', 'user', 'Post reviews for local businesses'),
    ('job:apply', 'user', 'Apply to active Cyberpark vacancies'),
    ('business:manage', 'merchant', 'Create and update commercial outlet profiles'),
    ('job:manage', 'merchant', 'Post and manage job openings'),
    ('marketplace:manage', 'merchant', 'Post pre-owned marketplace listings'),
    ('property:manage', 'merchant', 'Post real estate listings'),
    ('analytics:view', 'merchant', 'View merchant dashboard lead analytics'),
    ('content:moderate', 'moderator', 'Approve reviews and handle report flags'),
    ('city:manage', 'admin', 'Manage city events and announcements'),
    ('platform:super', 'system', 'Superuser full platform access')
ON CONFLICT (code) DO NOTHING;

-- 5. Create Role Permissions Join Table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- 6. Create User Sessions Tracking Table
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_info TEXT,
    ip_address VARCHAR(45),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Automatic Signup Trigger Function: Create Profile & Assign 'User' Role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
BEGIN
    -- Create Profile Record
    INSERT INTO public.profiles (id, full_name, email, avatar_url, city)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'city', 'Kozhikode')
    );

    -- Find Default 'User' Role ID
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'User' LIMIT 1;

    -- Assign Default Role
    IF default_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (NEW.id, default_role_id);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Trigger to Auth Users Table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Roles Policies
CREATE POLICY "Users Read Own Roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- User Sessions Policies
CREATE POLICY "Users Read Own Sessions" ON public.user_sessions FOR SELECT USING (auth.uid() = user_id);
