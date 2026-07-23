-- LiveCalicut Sprint 15: Subscription & Payments Platform Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. Subscription Plans Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    monthly_price NUMERIC(10, 2) NOT NULL,
    yearly_price NUMERIC(10, 2) NOT NULL,
    features JSONB DEFAULT '[]'::jsonb NOT NULL,
    listing_limit INT DEFAULT 1 NOT NULL,
    image_limit INT DEFAULT 5 NOT NULL,
    has_analytics BOOLEAN DEFAULT FALSE NOT NULL,
    has_leads BOOLEAN DEFAULT FALSE NOT NULL,
    featured_credits INT DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 2. Subscriptions Entity Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT NOT NULL,
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')) NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 3. Payments Core Transaction Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    payment_gateway TEXT DEFAULT 'razorpay' NOT NULL,
    gateway_order_id TEXT UNIQUE NOT NULL,
    gateway_payment_id TEXT UNIQUE,
    gateway_signature TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 4. Payment Transactions Log Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL, -- 'order_created', 'payment_captured', 'signature_verified', 'failed'
    gateway_response JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 5. Invoices Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    payment_id UUID REFERENCES public.payments(id) ON DELETE RESTRICT NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    pdf_url TEXT,
    status TEXT DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'void')) NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 6. Invoice Items Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    quantity INT DEFAULT 1 NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL
);

----------------------------------------------------
-- 7. Payment Methods Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    method_type TEXT NOT NULL, -- 'upi', 'card', 'netbanking'
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 8. Discount Codes Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    max_redemptions INT DEFAULT 100 NOT NULL,
    redemptions_count INT DEFAULT 0 NOT NULL
);

----------------------------------------------------
-- 9. Featured Packages Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.featured_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    module TEXT NOT NULL, -- 'business', 'job', 'property', 'marketplace', 'event'
    credits INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL
);

----------------------------------------------------
-- RLS Policies Setup
----------------------------------------------------
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view subscription plans" ON public.subscription_plans FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Merchants view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "Merchants view own payments" ON public.payments FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "Merchants view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = merchant_id);

----------------------------------------------------
-- Seed Subscription Plans
----------------------------------------------------
INSERT INTO public.subscription_plans (id, name, slug, monthly_price, yearly_price, listing_limit, image_limit, has_analytics, has_leads, featured_credits) VALUES
('k1eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'Free Starter', 'free-starter', 0, 0, 1, 3, false, false, 0),
('k1eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'Professional Suite', 'professional-suite', 999, 9990, 5, 15, true, true, 2),
('k1eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'Enterprise Business', 'enterprise-business', 2499, 24990, 25, 50, true, true, 10)
ON CONFLICT (slug) DO NOTHING;
