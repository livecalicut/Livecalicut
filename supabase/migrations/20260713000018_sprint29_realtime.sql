-- LiveCalicut Sprint 29: Enterprise Realtime Infrastructure
-- Migration: 20260713000018_sprint29_realtime.sql

----------------------------------------------------
-- 1. realtime_channels — Channel Registry
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.realtime_channels (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT UNIQUE NOT NULL,
    channel_type    TEXT NOT NULL,  -- 'public','user','merchant','admin','city','area','system'
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    requires_auth   BOOLEAN NOT NULL DEFAULT false,
    min_role        TEXT,           -- Minimum required role: 'user','merchant','moderator','admin'
    city_slug       TEXT,           -- NULL = all cities
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 2. event_queue — Outbound Event Buffer
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_queue (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type      TEXT NOT NULL,
    channel_name    TEXT NOT NULL,
    payload         JSONB NOT NULL,
    publisher_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    priority        SMALLINT NOT NULL DEFAULT 5,  -- 1=critical, 5=normal, 10=low
    status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending','dispatched','failed'
    attempts        SMALLINT NOT NULL DEFAULT 0,
    max_attempts    SMALLINT NOT NULL DEFAULT 3,
    scheduled_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dispatched_at   TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 3. event_history — Immutable Event Audit Trail
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type      TEXT NOT NULL,
    channel_name    TEXT NOT NULL,
    payload         JSONB NOT NULL,
    publisher_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    entity_type     TEXT,
    entity_id       UUID,
    city_slug       TEXT NOT NULL DEFAULT 'calicut',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 4. realtime_subscriptions — Client Channel Subscriptions
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.realtime_subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    channel_name    TEXT NOT NULL,
    filters         JSONB,           -- Optional payload filters
    is_active       BOOLEAN NOT NULL DEFAULT true,
    subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    UNIQUE(user_id, channel_name)
);

----------------------------------------------------
-- 5. delivery_logs — Notification Delivery Tracking
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id        UUID REFERENCES public.event_queue(id) ON DELETE CASCADE,
    recipient_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    channel         TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending',  -- 'pending','delivered','failed','read'
    delivered_at    TIMESTAMPTZ,
    read_at         TIMESTAMPTZ,
    failure_reason  TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 6. Indexes
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_event_queue_status    ON public.event_queue(status, scheduled_at)  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_event_queue_channel   ON public.event_queue(channel_name, status);
CREATE INDEX IF NOT EXISTS idx_event_history_type    ON public.event_history(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_history_entity  ON public.event_history(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_event_history_city    ON public.event_history(city_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rt_subs_user          ON public.realtime_subscriptions(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_delivery_logs_recip   ON public.delivery_logs(recipient_id, created_at DESC);

----------------------------------------------------
-- 7. Supabase Realtime Publication
-- Add event_queue to Realtime subscription so clients
-- can use Supabase Realtime JS client to subscribe.
----------------------------------------------------
ALTER TABLE public.event_queue   REPLICA IDENTITY FULL;
ALTER TABLE public.event_history REPLICA IDENTITY FULL;

DO $$
BEGIN
    -- Only run if the publication exists
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.event_queue;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.event_history;
    END IF;
END$$;

----------------------------------------------------
-- 8. Row Level Security
----------------------------------------------------
ALTER TABLE public.realtime_channels      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_queue            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_history          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_logs          ENABLE ROW LEVEL SECURITY;

-- Anyone can read public active channels
CREATE POLICY "Public read channels" ON public.realtime_channels
    FOR SELECT USING (is_active = true AND (requires_auth = false OR auth.uid() IS NOT NULL));

-- Anyone can read public event history
CREATE POLICY "Public read event history" ON public.event_history
    FOR SELECT USING (
        channel_name LIKE 'public.%' OR
        channel_name LIKE 'city.%'
    );

-- Users manage their own subscriptions
CREATE POLICY "User owns subscriptions" ON public.realtime_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Users see their own delivery logs
CREATE POLICY "User owns delivery logs" ON public.delivery_logs
    FOR SELECT USING (auth.uid() = recipient_id);

----------------------------------------------------
-- 9. Seed: Platform Default Channels
----------------------------------------------------
INSERT INTO public.realtime_channels (name, channel_type, description, requires_auth, min_role) VALUES
    ('public.announcements',     'public',   'Platform-wide announcements',              false, NULL),
    ('public.trending',          'public',   'Trending listings and searches',           false, NULL),
    ('city.calicut',             'city',     'Kozhikode city-level live updates',        false, NULL),
    ('city.kochi',               'city',     'Kochi city-level live updates',            false, NULL),
    ('city.trivandrum',          'city',     'Trivandrum city-level live updates',       false, NULL),
    ('system.health',            'system',   'Platform health and status events',        true,  'admin'),
    ('system.alerts',            'system',   'Critical system alerts',                   true,  'admin'),
    ('merchant.notifications',   'merchant', 'Merchant-specific notifications',          true,  'merchant'),
    ('admin.notifications',      'admin',    'Admin control center notifications',       true,  'moderator')
ON CONFLICT (name) DO NOTHING;
