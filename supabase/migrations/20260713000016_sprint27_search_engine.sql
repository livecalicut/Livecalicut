-- LiveCalicut Sprint 27: Universal Search Engine Backend
-- Migration: 20260713000016_sprint27_search_engine.sql

CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- Trigram similarity for fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- Accent-insensitive search

----------------------------------------------------
-- 1. search_documents — Central Search Index
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module          TEXT NOT NULL,      -- 'business','news','event','job','marketplace','property','explore'
    entity_id       UUID NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    keywords        TEXT,               -- space-separated keyword bag
    tags            TEXT[],
    category        TEXT,
    subcategory     TEXT,
    city_id         UUID REFERENCES public.cities(id) ON DELETE SET NULL,
    city_slug       TEXT,
    area            TEXT,
    latitude        NUMERIC(10, 7),
    longitude       NUMERIC(10, 7),
    popularity_score REAL NOT NULL DEFAULT 0,
    ranking_score    REAL NOT NULL DEFAULT 0,
    is_featured     BOOLEAN NOT NULL DEFAULT false,
    is_verified     BOOLEAN NOT NULL DEFAULT false,
    status          TEXT NOT NULL DEFAULT 'active',
    published_at    TIMESTAMPTZ,
    -- PostgreSQL full-text search vector (auto-maintained by trigger)
    search_vector   TSVECTOR,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(module, entity_id)
);

----------------------------------------------------
-- 2. search_synonyms — Synonym Dictionary
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_synonyms (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    term        TEXT NOT NULL UNIQUE,
    synonyms    TEXT[] NOT NULL,        -- e.g. 'biriyani' -> ['biryani','briyani','biriani']
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 3. search_popular — Trending / Popular Queries
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_popular (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query       TEXT NOT NULL UNIQUE,
    hit_count   INTEGER NOT NULL DEFAULT 1,
    city_slug   TEXT NOT NULL DEFAULT 'calicut',
    last_hit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 4. search_history — Per-User Recent Searches
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    query       TEXT NOT NULL,
    module      TEXT NOT NULL DEFAULT 'all',
    result_count INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 5. search_saved — Saved Search Alerts
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_saved (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    query       TEXT NOT NULL,
    module      TEXT NOT NULL DEFAULT 'all',
    filters     JSONB,
    alert_email BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, query, module)
);

----------------------------------------------------
-- 6. search_filters — Saved Filter Presets
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.search_filters (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    module      TEXT NOT NULL,
    filters     JSONB NOT NULL,
    is_default  BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- 7. Full-Text Search Indexes (GIN)
----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_search_docs_vector
    ON public.search_documents USING GIN(search_vector);

CREATE INDEX IF NOT EXISTS idx_search_docs_trgm_title
    ON public.search_documents USING GIN(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_search_docs_module
    ON public.search_documents(module);

CREATE INDEX IF NOT EXISTS idx_search_docs_city
    ON public.search_documents(city_slug);

CREATE INDEX IF NOT EXISTS idx_search_docs_ranking
    ON public.search_documents(ranking_score DESC);

CREATE INDEX IF NOT EXISTS idx_search_docs_featured
    ON public.search_documents(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_search_docs_status
    ON public.search_documents(status) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_search_popular_count
    ON public.search_popular(hit_count DESC);

CREATE INDEX IF NOT EXISTS idx_search_history_user
    ON public.search_history(user_id, created_at DESC);

----------------------------------------------------
-- 8. Function: Maintain search_vector (auto)
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(unaccent(NEW.title), '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(unaccent(NEW.keywords), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(unaccent(NEW.description), '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(unaccent(NEW.category), '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_search_documents_vector
    BEFORE INSERT OR UPDATE OF title, keywords, description, category
    ON public.search_documents
    FOR EACH ROW EXECUTE FUNCTION public.update_search_vector();

----------------------------------------------------
-- 9. Function: Increment popular query hit count
----------------------------------------------------
CREATE OR REPLACE FUNCTION public.record_search_query(p_query TEXT, p_city TEXT DEFAULT 'calicut')
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.search_popular (query, city_slug, hit_count, last_hit_at)
    VALUES (lower(trim(p_query)), p_city, 1, NOW())
    ON CONFLICT (query)
    DO UPDATE SET hit_count = search_popular.hit_count + 1, last_hit_at = NOW();
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------
-- 10. updated_at trigger for search_documents
----------------------------------------------------
CREATE TRIGGER set_search_documents_updated_at
    BEFORE UPDATE ON public.search_documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

----------------------------------------------------
-- 11. Row Level Security
----------------------------------------------------
ALTER TABLE public.search_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_synonyms  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_popular   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_saved     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_filters   ENABLE ROW LEVEL SECURITY;

-- Anyone can read active search documents
CREATE POLICY "Public read search index" ON public.search_documents
    FOR SELECT USING (status = 'active');

-- Anyone can read synonyms and popular terms
CREATE POLICY "Public read synonyms"  ON public.search_synonyms FOR SELECT USING (true);
CREATE POLICY "Public read trending"  ON public.search_popular  FOR SELECT USING (true);

-- Users manage only their own search data
CREATE POLICY "User owns search history" ON public.search_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "User owns saved searches" ON public.search_saved
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "User owns filters" ON public.search_filters
    FOR ALL USING (auth.uid() = user_id);

----------------------------------------------------
-- 12. Seed: Kozhikode Popular Search Terms
----------------------------------------------------
INSERT INTO public.search_popular (query, hit_count, city_slug) VALUES
    ('biriyani', 1250, 'calicut'),
    ('beach', 980, 'calicut'),
    ('jobs', 870, 'calicut'),
    ('apartments', 650, 'calicut'),
    ('cafe', 540, 'calicut'),
    ('restaurant', 480, 'calicut'),
    ('hospital', 420, 'calicut'),
    ('software jobs', 390, 'calicut'),
    ('second hand mobile', 310, 'calicut'),
    ('hotels', 280, 'calicut')
ON CONFLICT (query) DO NOTHING;

----------------------------------------------------
-- 13. Seed: Common Synonyms (Kozhikode Local)
----------------------------------------------------
INSERT INTO public.search_synonyms (term, synonyms) VALUES
    ('biriyani',   ARRAY['biryani', 'briyani', 'biriani', 'biriyanee']),
    ('calicut',    ARRAY['kozhikode', 'kozikode', 'kozhikkode']),
    ('beach',      ARRAY['beachside', 'seashore', 'kadalpuram']),
    ('job',        ARRAY['jobs', 'vacancy', 'hiring', 'career', 'employment']),
    ('flat',       ARRAY['apartment', 'house', 'home', 'rental']),
    ('hospital',   ARRAY['clinic', 'health', 'doctor', 'medical'])
ON CONFLICT (term) DO NOTHING;
