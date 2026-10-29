-- 20261029_reports.sql
-- Generic abuse/flag reports used by admin Moderation (/admin/reports) and
-- POST /api/businesses/report. Production never received migration 000002's
-- reports table. Idempotent; run after 20261029_events_media_audit.sql.
BEGIN;

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    resolution_status TEXT DEFAULT 'pending' NOT NULL
        CHECK (resolution_status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_reports_entity ON public.reports(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_reports_resolution ON public.reports(resolution_status, created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Signed-in users file reports as themselves and see only their own.
-- Admin reads/updates go through the service role after a server-side role check.
DROP POLICY IF EXISTS "Users create reports" ON public.reports;
DROP POLICY IF EXISTS "Users create own reports" ON public.reports;
CREATE POLICY "Users create own reports" ON public.reports
    FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Users view own reports" ON public.reports;
CREATE POLICY "Users view own reports" ON public.reports
    FOR SELECT TO authenticated USING (reporter_id = auth.uid());

COMMIT;

NOTIFY pgrst, 'reload schema';
