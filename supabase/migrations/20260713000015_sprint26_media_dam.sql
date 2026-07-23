-- LiveCalicut Sprint 26: Enterprise Media & Digital Asset Management
-- Migration: 20260713000015_sprint26_media_dam.sql

----------------------------------------------------
-- 1. media_assets — Central DAM Registry
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    module          TEXT NOT NULL,        -- 'business','news','event','job','marketplace','property','explore','profile','system'
    entity_type     TEXT,
    entity_id       UUID,
    status          TEXT NOT NULL DEFAULT 'active',  -- 'active','archived','deleted'
    is_public       BOOLEAN NOT NULL DEFAULT true,
    public_url      TEXT,
    alt_text        TEXT,
    caption         TEXT,
    deleted_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 2. media_variants — Processed Image Sizes (WebP)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_variants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id    UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
    variant     TEXT NOT NULL,  -- 'thumbnail','small','medium','large','webp'
    width       INTEGER,
    height      INTEGER,
    file_size   BIGINT,
    public_url  TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 3. media_tags — Searchable Tag Association
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_tags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id    UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(asset_id, tag)
);

----------------------------------------------------
-- 4. media_permissions — Granular Access Control
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_permissions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id    UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
    grantee_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role        TEXT NOT NULL DEFAULT 'viewer',  -- 'viewer','editor','owner'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(asset_id, grantee_id)
);

----------------------------------------------------
-- 5. media_audit_log — Upload/Delete/Replace Audit
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_audit_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id    UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
    actor_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,  -- 'upload','delete','replace','download','tag'
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 6. Indexes for Performance
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_media_assets_owner       ON public.media_assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_module      ON public.media_assets(module);
CREATE INDEX IF NOT EXISTS idx_media_assets_entity      ON public.media_assets(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_status      ON public.media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_bucket      ON public.media_assets(storage_bucket);
CREATE INDEX IF NOT EXISTS idx_media_assets_created_at  ON public.media_assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_variants_asset     ON public.media_variants(asset_id);
CREATE INDEX IF NOT EXISTS idx_media_tags_asset         ON public.media_tags(asset_id);

----------------------------------------------------
-- 7. updated_at Triggers
----------------------------------------------------
CREATE TRIGGER set_media_assets_updated_at
    BEFORE UPDATE ON public.media_assets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

----------------------------------------------------
-- 8. Row Level Security
----------------------------------------------------
ALTER TABLE public.media_assets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_variants    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_tags        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_audit_log   ENABLE ROW LEVEL SECURITY;

-- Public can read public active assets
CREATE POLICY "Public read active media" ON public.media_assets
    FOR SELECT USING (is_public = true AND status = 'active' AND deleted_at IS NULL);

-- Owner can manage their own assets
CREATE POLICY "Owner manage media" ON public.media_assets
    FOR ALL USING (auth.uid() = owner_id);

-- Public read variants of public assets
CREATE POLICY "Public read media variants" ON public.media_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.media_assets ma
            WHERE ma.id = asset_id AND ma.is_public = true AND ma.status = 'active'
        )
    );
