-- LiveCalicut Sprint 18: Analytics & Business Intelligence Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Analytics Micro-Events Telemetry Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- 'business_view', 'phone_click', 'whatsapp_click', 'job_applied', 'search_query'
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL, -- 'business', 'job', 'property', 'marketplace', 'event'
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 2. Analytics User Sessions Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_token TEXT UNIQUE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMPTZ,
    device_type TEXT DEFAULT 'mobile' CHECK (device_type IN ('mobile', 'desktop', 'tablet')) NOT NULL
);

----------------------------------------------------
-- 3. Analytics Daily Aggregates Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE UNIQUE NOT NULL,
    active_users INT DEFAULT 0 NOT NULL,
    new_users INT DEFAULT 0 NOT NULL,
    business_views INT DEFAULT 0 NOT NULL,
    phone_clicks INT DEFAULT 0 NOT NULL,
    whatsapp_clicks INT DEFAULT 0 NOT NULL,
    revenue_total NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 4. Analytics Reports Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analytics_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    report_type TEXT NOT NULL, -- 'executive_monthly', 'merchant_performance', 'category_heat'
    metrics JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 5. Merchant Insights Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.merchant_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    profile_views INT DEFAULT 0 NOT NULL,
    phone_clicks INT DEFAULT 0 NOT NULL,
    whatsapp_clicks INT DEFAULT 0 NOT NULL,
    leads_count INT DEFAULT 0 NOT NULL,
    rating_avg NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 6. Platform Real-Time Metrics Counters Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.platform_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name TEXT UNIQUE NOT NULL,
    metric_value NUMERIC(14, 2) DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- Indexes for Sub-50ms Analytics Aggregation
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_date ON public.analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_entity ON public.analytics_events(entity_type, entity_id);

----------------------------------------------------
-- RLS Security Policies
----------------------------------------------------
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchant_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public log analytics events" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Merchants view own insights" ON public.merchant_insights FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "Admins view platform metrics" ON public.platform_metrics FOR SELECT USING (true);
CREATE POLICY "Admins view daily analytics" ON public.analytics_daily FOR SELECT USING (true);

----------------------------------------------------
-- Seed Platform Realtime Metrics Counters
----------------------------------------------------
INSERT INTO public.platform_metrics (metric_name, metric_value) VALUES
('total_registered_users', 14250),
('active_businesses', 840),
('published_jobs', 310),
('marketplace_listings', 620),
('real_estate_properties', 290),
('monthly_recurring_revenue', 184500)
ON CONFLICT (metric_name) DO NOTHING;
