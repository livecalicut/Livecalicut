import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface SearchDocument {
  id: string;
  module: string;
  entity_id: string;
  title: string;
  description?: string;
  category?: string;
  city_slug?: string;
  area?: string;
  ranking_score: number;
  is_featured: boolean;
  is_verified: boolean;
  published_at?: string;
  slug?: string;
}

export interface SearchGroupedResults {
  businesses: SearchDocument[];
  jobs: SearchDocument[];
  marketplace: SearchDocument[];
  properties: SearchDocument[];
  events: SearchDocument[];
  news: SearchDocument[];
  explore: SearchDocument[];
  total: number;
}

export interface SearchSuggestion {
  label: string;
  module: string;
}

type SearchParams = {
  q: string;
  module: string;
  city?: string;
  category?: string;
  area?: string;
  featured?: boolean;
  verified?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
};

function emptyResults(): SearchGroupedResults {
  return {
    businesses: [],
    jobs: [],
    marketplace: [],
    properties: [],
    events: [],
    news: [],
    explore: [],
    total: 0,
  };
}

function doc(
  partial: Omit<SearchDocument, 'ranking_score' | 'is_featured' | 'is_verified'> &
    Partial<SearchDocument>
): SearchDocument {
  return {
    ranking_score: 0,
    is_featured: false,
    is_verified: false,
    ...partial,
  };
}

export class SearchEngineService {
  private static supabase = createClient();

  /**
   * Universal search over live entity tables (businesses, jobs, news, …).
   * Uses search_documents when that index has rows; otherwise queries live tables.
   */
  static async search(
    params: SearchParams,
    supabaseClient?: SupabaseClient
  ): Promise<SearchGroupedResults> {
    const supabase = supabaseClient || this.supabase;
    const q = params.q.trim();
    if (!q) return emptyResults();

    try {
      const indexed = await this.searchIndexed(params, supabase);
      if (indexed.total > 0) return indexed;
    } catch {
      // Index may be missing on greenfield DBs
    }

    return this.searchLiveTables(params, supabase);
  }

  private static async searchIndexed(
    params: SearchParams,
    supabase: SupabaseClient
  ): Promise<SearchGroupedResults> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 50);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const tsQuery = params.q
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `${w.replace(/[^a-zA-Z0-9_-]/g, '')}:*`)
      .filter((w) => w.length > 2)
      .join(' & ');

    if (!tsQuery) return emptyResults();

    let query = supabase
      .from('search_documents')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .textSearch('search_vector', tsQuery, { config: 'english' })
      .range(from, to);

    if (params.module && params.module !== 'all') {
      query = query.eq('module', params.module);
    }
    if (params.city && params.city !== 'all' && params.city !== 'calicut') {
      query = query.eq('city_slug', params.city);
    }
    if (params.area) query = query.ilike('area', `%${params.area}%`);
    if (params.category) query = query.eq('category', params.category);
    if (params.featured === true) query = query.eq('is_featured', true);
    if (params.verified === true) query = query.eq('is_verified', true);

    switch (params.sort) {
      case 'latest':
        query = query.order('published_at', { ascending: false });
        break;
      case 'trending':
        query = query.order('popularity_score', { ascending: false });
        break;
      case 'highest_rated':
        query = query.order('ranking_score', { ascending: false });
        break;
      default:
        query = query
          .order('is_featured', { ascending: false })
          .order('ranking_score', { ascending: false });
    }

    const { data, count, error } = await query;
    if (error) throw error;

    this.recordPopularQuery(params.q, params.city || 'calicut').catch(() => {});
    return this.groupByModule((data || []) as SearchDocument[], count || 0);
  }

  private static async searchLiveTables(
    params: SearchParams,
    supabase: SupabaseClient
  ): Promise<SearchGroupedResults> {
    const safe = params.q.trim().replace(/[%(),]/g, ' ').replace(/\s+/g, ' ').trim();
    const term = `%${safe}%`;
    const area = params.area?.trim();
    const module = params.module || 'all';
    const perModule = Math.min(params.limit || 20, 24);
    const want = (name: string) => module === 'all' || module === name;

    const results = emptyResults();

    const run = async (fn: () => Promise<void>) => {
      try {
        await fn();
      } catch (err) {
        console.warn('[SearchEngineService.live]', err instanceof Error ? err.message : err);
      }
    };

    const tasks: Promise<void>[] = [];

    if (want('business')) {
      tasks.push(
        run(async () => {
          let q = supabase
            .from('businesses')
            .select(
              'id, name, slug, short_description, description, is_featured, is_verified, rating_avg, business_categories(name), areas(name)'
            )
            .ilike('name', term)
            .eq('status', 'active')
            .is('deleted_at', null)
            .limit(perModule);

          if (params.verified) q = q.eq('is_verified', true);
          if (params.featured) q = q.eq('is_featured', true);

          const { data, error } = await q;
          if (error) throw error;

          const rows = (data || []).filter((b: any) =>
            area ? String(b.areas?.name || '').toLowerCase().includes(area.toLowerCase()) : true
          );

          results.businesses = rows.map((b: any) =>
            doc({
              id: b.id,
              module: 'business',
              entity_id: b.slug || b.id,
              slug: b.slug,
              title: b.name,
              description: b.short_description || b.description || '',
              category: b.business_categories?.name,
              area: b.areas?.name,
              is_featured: !!b.is_featured,
              is_verified: !!b.is_verified,
              ranking_score: Number(b.rating_avg) || 0,
            })
          );
        })
      );
    }

    if (want('job')) {
      tasks.push(
        run(async () => {
          const { data, error } = await supabase
            .from('jobs')
            .select(
              'id, title, slug, salary, employment_type, is_featured, companies(name), areas(name)'
            )
            .ilike('title', term)
            .eq('status', 'published')
            .is('deleted_at', null)
            .limit(perModule);
          if (error) throw error;

          const rows = (data || []).filter((j: any) =>
            area ? String(j.areas?.name || '').toLowerCase().includes(area.toLowerCase()) : true
          );

          results.jobs = rows.map((j: any) =>
            doc({
              id: j.id,
              module: 'job',
              entity_id: j.slug || j.id,
              slug: j.slug,
              title: j.title,
              description:
                `${j.companies?.name || 'Employer'} · ${j.salary || j.employment_type || ''}`.trim(),
              category: j.employment_type,
              area: j.areas?.name || 'Kozhikode',
              is_featured: !!j.is_featured,
            })
          );
        })
      );
    }

    if (want('marketplace')) {
      tasks.push(
        run(async () => {
          const { data, error } = await supabase
            .from('marketplace_items')
            .select(
              'id, title, slug, price, condition, marketplace_categories(name), areas(name)'
            )
            .ilike('title', term)
            .eq('status', 'active')
            .is('deleted_at', null)
            .limit(perModule);
          if (error) throw error;

          const rows = (data || []).filter((m: any) =>
            area ? String(m.areas?.name || '').toLowerCase().includes(area.toLowerCase()) : true
          );

          results.marketplace = rows.map((m: any) =>
            doc({
              id: m.id,
              module: 'marketplace',
              entity_id: m.slug || m.id,
              slug: m.slug,
              title: m.title,
              description: m.price != null ? `₹${m.price}` : m.condition || '',
              category: m.marketplace_categories?.name,
              area: m.areas?.name,
            })
          );
        })
      );
    }

    if (want('property')) {
      tasks.push(
        run(async () => {
          const { data, error } = await supabase
            .from('properties')
            .select(
              'id, title, slug, price, listing_type, bedrooms, property_categories(name), areas(name)'
            )
            .ilike('title', term)
            .in('status', ['published', 'active'])
            .is('deleted_at', null)
            .limit(perModule);
          if (error) throw error;

          const rows = (data || []).filter((p: any) =>
            area ? String(p.areas?.name || '').toLowerCase().includes(area.toLowerCase()) : true
          );

          results.properties = rows.map((p: any) =>
            doc({
              id: p.id,
              module: 'property',
              entity_id: p.slug || p.id,
              slug: p.slug,
              title: p.title,
              description: [
                p.bedrooms ? `${p.bedrooms} BHK` : null,
                p.listing_type,
                p.price != null ? `₹${p.price}` : null,
              ]
                .filter(Boolean)
                .join(' · '),
              category: p.property_categories?.name,
              area: p.areas?.name,
            })
          );
        })
      );
    }

    if (want('event')) {
      tasks.push(
        run(async () => {
          const { data, error } = await supabase
            .from('events')
            .select('id, title, slug, venue, start_date, event_categories(name), areas(name)')
            .ilike('title', term)
            .in('status', ['published', 'active'])
            .is('deleted_at', null)
            .limit(perModule);
          if (error) throw error;

          const rows = (data || []).filter((e: any) =>
            area
              ? String(e.areas?.name || e.venue || '')
                  .toLowerCase()
                  .includes(area.toLowerCase())
              : true
          );

          results.events = rows.map((e: any) =>
            doc({
              id: e.id,
              module: 'event',
              entity_id: e.slug || e.id,
              slug: e.slug,
              title: e.title,
              description: e.venue || '',
              category: e.event_categories?.name,
              area: e.areas?.name || e.venue,
              published_at: e.start_date,
            })
          );
        })
      );
    }

    if (want('news')) {
      tasks.push(
        run(async () => {
          const { data, error } = await supabase
            .from('news')
            .select('id, title, slug, summary, published_at, news_categories(name)')
            .ilike('title', term)
            .eq('status', 'published')
            .is('deleted_at', null)
            .limit(perModule);
          if (error) throw error;

          results.news = (data || []).map((n: any) =>
            doc({
              id: n.id,
              module: 'news',
              entity_id: n.slug || n.id,
              slug: n.slug,
              title: n.title,
              description: n.summary || '',
              category: n.news_categories?.name,
              area: 'Kozhikode',
              published_at: n.published_at,
            })
          );
        })
      );
    }

    await Promise.all(tasks);

    results.total =
      results.businesses.length +
      results.jobs.length +
      results.marketplace.length +
      results.properties.length +
      results.events.length +
      results.news.length +
      results.explore.length;

    this.recordPopularQuery(params.q, params.city || 'calicut').catch(() => {});
    return results;
  }

  static async getSuggestions(q: string, city: string, limit: number = 6): Promise<SearchSuggestion[]> {
    const term = `%${q}%`;
    const suggestions: SearchSuggestion[] = [];

    const [{ data: businesses }, { data: jobs }, { data: news }] = await Promise.all([
      this.supabase
        .from('businesses')
        .select('name')
        .ilike('name', term)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(3),
      this.supabase
        .from('jobs')
        .select('title')
        .ilike('title', term)
        .eq('status', 'published')
        .is('deleted_at', null)
        .limit(2),
      this.supabase
        .from('news')
        .select('title')
        .ilike('title', term)
        .eq('status', 'published')
        .is('deleted_at', null)
        .limit(2),
    ]);

    (businesses || []).forEach((b: any) => suggestions.push({ label: b.name, module: 'business' }));
    (jobs || []).forEach((j: any) => suggestions.push({ label: j.title, module: 'job' }));
    (news || []).forEach((n: any) => suggestions.push({ label: n.title, module: 'news' }));

    try {
      const { data: popularResults } = await this.supabase
        .from('search_popular')
        .select('query')
        .eq('city_slug', city)
        .ilike('query', `${q}%`)
        .order('hit_count', { ascending: false })
        .limit(4);

      (popularResults || []).forEach((p) => {
        if (!suggestions.find((s) => s.label.toLowerCase() === p.query.toLowerCase())) {
          suggestions.unshift({ label: p.query, module: 'popular' });
        }
      });
    } catch {
      /* optional */
    }

    return suggestions.slice(0, limit);
  }

  static async getTrending(city: string, limit: number = 10): Promise<string[]> {
    try {
      const { data } = await this.supabase
        .from('search_popular')
        .select('query')
        .eq('city_slug', city)
        .order('hit_count', { ascending: false })
        .limit(limit);
      if (data && data.length > 0) return data.map((r) => r.query);
    } catch {
      /* fall through */
    }

    const { data: businesses } = await this.supabase
      .from('businesses')
      .select('name')
      .eq('status', 'active')
      .eq('is_featured', true)
      .is('deleted_at', null)
      .limit(limit);

    return (businesses || []).map((b: any) => b.name).filter(Boolean);
  }

  static async getRecentSearches(userId: string, limit: number = 10) {
    const { data } = await this.supabase
      .from('search_history')
      .select('id, query, module, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  static async recordSearchHistory(
    userId: string,
    query: string,
    module: string,
    resultCount: number
  ) {
    try {
      await this.supabase.from('search_history').insert({
        user_id: userId,
        query: query.trim().toLowerCase(),
        module,
        result_count: resultCount,
      });
    } catch {
      /* optional */
    }
  }

  static async saveSearch(
    userId: string,
    query: string,
    module: string,
    filters?: Record<string, unknown>,
    alertEmail?: boolean
  ) {
    const { data, error } = await this.supabase
      .from('search_saved')
      .upsert(
        {
          user_id: userId,
          query: query.trim().toLowerCase(),
          module,
          filters: filters || null,
          alert_email: alertEmail || false,
        },
        { onConflict: 'user_id,query,module' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async clearHistory(userId: string) {
    const { error } = await this.supabase.from('search_history').delete().eq('user_id', userId);
    if (error) throw new Error(error.message);
  }

  static async indexDocument(docInput: {
    module: string;
    entityId: string;
    title: string;
    description?: string;
    keywords?: string;
    tags?: string[];
    category?: string;
    citySlug?: string;
    area?: string;
    popularityScore?: number;
    rankingScore?: number;
    isFeatured?: boolean;
    isVerified?: boolean;
    publishedAt?: string;
  }) {
    const { error } = await this.supabase.from('search_documents').upsert(
      {
        module: docInput.module,
        entity_id: docInput.entityId,
        title: docInput.title,
        description: docInput.description || null,
        keywords: docInput.keywords || null,
        tags: docInput.tags || null,
        category: docInput.category || null,
        city_slug: docInput.citySlug || 'calicut',
        area: docInput.area || null,
        popularity_score: docInput.popularityScore ?? 0,
        ranking_score: docInput.rankingScore ?? 0,
        is_featured: docInput.isFeatured ?? false,
        is_verified: docInput.isVerified ?? false,
        status: 'active',
        published_at: docInput.publishedAt || new Date().toISOString(),
      } as any,
      { onConflict: 'module,entity_id' }
    );

    if (error) throw new Error(`Indexing failed: ${error.message}`);
  }

  static async deindexDocument(module: string, entityId: string) {
    await this.supabase
      .from('search_documents')
      .update({ status: 'inactive' })
      .eq('module', module)
      .eq('entity_id', entityId);
  }

  private static async recordPopularQuery(q: string, city: string) {
    try {
      await this.supabase.rpc('record_search_query', { p_query: q, p_city: city });
    } catch {
      /* optional */
    }
  }

  private static groupByModule(docs: SearchDocument[], total: number): SearchGroupedResults {
    const group = (module: string) => docs.filter((d) => d.module === module);

    return {
      businesses: group('business'),
      jobs: group('job'),
      marketplace: group('marketplace'),
      properties: group('property'),
      events: group('event'),
      news: group('news'),
      explore: group('explore'),
      total,
    };
  }
}
