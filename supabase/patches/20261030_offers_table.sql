-- LiveCalicut Offers & Deals Table Patch
-- Run in Supabase SQL Editor if table is not yet present

CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
    business_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    discount TEXT NOT NULL,
    code TEXT DEFAULT '',
    location TEXT DEFAULT 'Calicut',
    category TEXT DEFAULT 'Retail & Shopping',
    image TEXT,
    link TEXT DEFAULT '/business',
    valid_till TEXT DEFAULT 'Ongoing',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_offers_active ON public.offers (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_offers_created ON public.offers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_offers_category ON public.offers (category);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'offers' AND policyname = 'Public read active offers'
    ) THEN
        CREATE POLICY "Public read active offers" ON public.offers FOR SELECT USING (is_active = TRUE);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'offers' AND policyname = 'Authenticated editors manage offers'
    ) THEN
        CREATE POLICY "Authenticated editors manage offers" ON public.offers FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;
