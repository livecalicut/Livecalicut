-- LiveCalicut Sprint 16: AI Concierge & Recommendation Engine Migration
-- Author: Chief Product Architect & Principal Software Engineer
-- Created: 2026-07-13

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. AI Conversations Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Local Discovery' NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

----------------------------------------------------
-- 2. AI Messages Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE NOT NULL,
    sender TEXT CHECK (sender IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    intent TEXT DEFAULT 'general_inquiry',
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL, -- Grounded listings & action buttons payload
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 3. AI Feedback Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES public.ai_messages(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating INT CHECK (rating IN (1, -1)) NOT NULL, -- 1 = Helpful, -1 = Unhelpful
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- 4. AI Recommendations Table
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE NOT NULL,
    entity_module TEXT NOT NULL,
    entity_id UUID NOT NULL,
    score NUMERIC(5, 4) DEFAULT 0.9500 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

----------------------------------------------------
-- RLS Policies Setup
----------------------------------------------------
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own ai conversations" ON public.ai_conversations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users view own ai messages" ON public.ai_messages FOR SELECT USING (true);
CREATE POLICY "Users insert ai feedback" ON public.ai_feedback FOR INSERT WITH CHECK (true);
