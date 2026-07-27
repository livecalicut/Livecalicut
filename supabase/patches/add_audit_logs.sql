-- Add audit_logs if you already ran an older bootstrap.sql
-- Paste into Supabase Dashboard → SQL → New query → Run

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_read_audit_logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_insert_audit_logs" ON public.audit_logs;
CREATE POLICY "admin_insert_audit_logs" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = admin_id);
