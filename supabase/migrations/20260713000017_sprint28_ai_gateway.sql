-- LiveCalicut Sprint 28: Enterprise AI Gateway
-- Migration: 20260713000017_sprint28_ai_gateway.sql

----------------------------------------------------
-- 1. ai_models — Registered AI Provider Models
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_models (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider        TEXT NOT NULL,   -- 'gemini','openai','anthropic','local'
    model_name      TEXT NOT NULL,
    display_name    TEXT NOT NULL,
    context_window  INTEGER,
    cost_per_1k_input  NUMERIC(10, 6) DEFAULT 0,
    cost_per_1k_output NUMERIC(10, 6) DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    is_default      BOOLEAN NOT NULL DEFAULT false,
    capabilities    TEXT[] DEFAULT ARRAY['chat']::TEXT[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(provider, model_name)
);

----------------------------------------------------
-- 2. ai_sessions — Conversation Sessions
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_token   TEXT UNIQUE,   -- For anonymous sessions
    intent          TEXT,          -- Last detected intent
    city_slug       TEXT NOT NULL DEFAULT 'calicut',
    user_role       TEXT NOT NULL DEFAULT 'guest',
    metadata        JSONB,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 3. ai_messages — Chat History per Session
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID NOT NULL REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
    role            TEXT NOT NULL,   -- 'user','assistant','system'
    content         TEXT NOT NULL,
    intent          TEXT,
    model_used      TEXT,
    provider_used   TEXT,
    tokens_input    INTEGER DEFAULT 0,
    tokens_output   INTEGER DEFAULT 0,
    latency_ms      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 4. ai_prompts — Reusable Prompt Templates
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_prompts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT UNIQUE NOT NULL,
    intent          TEXT NOT NULL,
    system_prompt   TEXT NOT NULL,
    user_prompt_template TEXT NOT NULL,
    variables       TEXT[],          -- Declared injection variables
    version         INTEGER NOT NULL DEFAULT 1,
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 5. ai_feedback — User Quality Ratings
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_feedback (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id      UUID NOT NULL REFERENCES public.ai_messages(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
    thumbs_up       BOOLEAN,
    comment         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 6. ai_usage — Token & Cost Tracking per Day
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_usage (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    provider        TEXT NOT NULL,
    model_name      TEXT NOT NULL,
    total_requests  INTEGER NOT NULL DEFAULT 0,
    total_input_tokens  BIGINT NOT NULL DEFAULT 0,
    total_output_tokens BIGINT NOT NULL DEFAULT 0,
    total_cost_usd  NUMERIC(10, 4) NOT NULL DEFAULT 0,
    error_count     INTEGER NOT NULL DEFAULT 0,
    avg_latency_ms  INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(date, provider, model_name)
);

----------------------------------------------------
-- 7. Indexes
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user      ON public.ai_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session   ON public.ai_messages(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_date         ON public.ai_usage(date DESC);
CREATE INDEX IF NOT EXISTS idx_ai_prompts_intent     ON public.ai_prompts(intent) WHERE is_active = true;

----------------------------------------------------
-- 8. updated_at triggers
----------------------------------------------------
CREATE TRIGGER set_ai_sessions_updated_at
    BEFORE UPDATE ON public.ai_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER set_ai_prompts_updated_at
    BEFORE UPDATE ON public.ai_prompts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

----------------------------------------------------
-- 9. Row Level Security
----------------------------------------------------
ALTER TABLE public.ai_models   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active models"  ON public.ai_models   FOR SELECT USING (is_active = true);
CREATE POLICY "User owns sessions"         ON public.ai_sessions  FOR ALL   USING (auth.uid() = user_id);
CREATE POLICY "User owns messages"         ON public.ai_messages  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ai_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
);
CREATE POLICY "User owns feedback"         ON public.ai_feedback  FOR ALL   USING (auth.uid() = user_id);

----------------------------------------------------
-- 10. Seed: Active AI Models Registry
----------------------------------------------------
INSERT INTO public.ai_models (provider, model_name, display_name, context_window, cost_per_1k_input, cost_per_1k_output, is_default, capabilities) VALUES
    ('gemini', 'gemini-2.0-flash',       'Gemini 2.0 Flash',        1048576, 0.000075, 0.000300, true,  ARRAY['chat','search','recommend','summarize']),
    ('gemini', 'gemini-2.5-pro',         'Gemini 2.5 Pro',          2097152, 0.001250, 0.010000, false, ARRAY['chat','search','recommend','summarize','code']),
    ('openai', 'gpt-4o-mini',            'GPT-4o Mini',             128000,  0.000150, 0.000600, false, ARRAY['chat','search','recommend']),
    ('openai', 'gpt-4o',                 'GPT-4o',                  128000,  0.002500, 0.010000, false, ARRAY['chat','search','recommend','summarize','code'])
ON CONFLICT (provider, model_name) DO NOTHING;
