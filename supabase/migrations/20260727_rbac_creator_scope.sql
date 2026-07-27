-- RBAC hardening: Marketing Executive role + creator hierarchy on profiles

-- 1. Seed Marketing Executive (used by app code but missing from earlier seeds)
INSERT INTO public.roles (name, description) VALUES
    ('Marketing Executive', 'Field staff who create and manage their own listings and assigned users')
ON CONFLICT (name) DO NOTHING;

-- 2. Creator / parent mapping for staff-created users
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_created_by ON public.profiles(created_by);

-- 3. Soft-delete column (used by admin soft_delete action)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at ON public.profiles(deleted_at);
