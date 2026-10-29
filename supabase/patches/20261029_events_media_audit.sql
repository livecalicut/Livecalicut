-- Adds tables the admin panel writes to but the live database is missing:
--   events + event_categories  (Admin → Events "Create")
--   media_assets               (upload registry; uploads work without it, but it enables media search)
--   audit_logs                 (Admin → Audit Logs)
-- Idempotent: safe to run more than once.
-- Paste into Supabase Dashboard → SQL → New query → Run.
-- marketplace_items / properties / places are larger modules: apply
-- migrations 20260713000006, 20260713000007 and 20260713000009 when those go live.

CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    organizer_id UUID,
    venue TEXT NOT NULL DEFAULT '',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    google_maps_link TEXT,
    category_id UUID REFERENCES public.event_categories(id) ON DELETE RESTRICT NOT NULL,
    city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
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
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'pending', 'published', 'cancelled', 'archived', 'rejected')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

CREATE TABLE IF NOT EXISTS public.media_assets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_name   TEXT NOT NULL,
    stored_name     TEXT NOT NULL,
    mime_type       TEXT NOT NULL,
    extension       TEXT NOT NULL,
    width           INTEGER,
    height          INTEGER,
    file_size       BIGINT NOT NULL,
    storage_bucket  TEXT NOT NULL,
    folder_path     TEXT NOT NULL DEFAULT '/',
    checksum        TEXT,
    owner_id        UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    module          TEXT NOT NULL,
    entity_type     TEXT,
    entity_id       UUID,
    status          TEXT NOT NULL DEFAULT 'active',
    is_public       BOOLEAN NOT NULL DEFAULT true,
    public_url      TEXT,
    alt_text        TEXT,
    caption         TEXT,
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_owner ON public.media_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_module ON public.media_assets(module);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS: public can read published events/categories; all writes go through
-- server routes using the service-role key (which bypasses RLS).
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_event_categories" ON public.event_categories;
CREATE POLICY "public_read_event_categories" ON public.event_categories
  FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_published_events" ON public.events;
CREATE POLICY "public_read_published_events" ON public.events
  FOR SELECT USING (status = 'published' AND deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_public_media" ON public.media_assets;
CREATE POLICY "public_read_public_media" ON public.media_assets
  FOR SELECT USING (is_public AND deleted_at IS NULL);

DROP POLICY IF EXISTS "admin_read_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_read_audit_logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid() AND r.name IN ('Super Admin', 'City Admin')
    )
  );

NOTIFY pgrst, 'reload schema';
