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

export class SearchEngineService {
  private static supabase = createClient();

  /**
   * Universal full-text search using PostgreSQL tsvector + trigram fallback.
   * Returns results grouped by module for BFF consumption.
   */
  static async search(params: {
    q: string;
    module: string;
    city?: string;
    category?: string;
    featured?: boolean;
    verified?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<SearchGroupedResults> {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 50);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Sanitized query — convert to tsquery-safe format
    const tsQuery = params.q
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => `${w}:*`)
      .join(' & ');

    let query = this.supabase
      .from('search_documents')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .textSearch('search_vector', tsQuery, { config: 'english' })
      .range(from, to);

    // Module filter
    if (params.module && params.module !== 'all') {
      query = query.eq('module', params.module);
    }

    // City filter
    if (params.city && params.city !== 'all') {
      query = query.eq('city_slug', params.city);
    }

    // Category filter
    if (params.category) {
      query = query.eq('category', params.category);
    }

    // Featured / Verified filters
    if (params.featured === true) query = query.eq('is_featured', true);
    if (params.verified === true) query = query.eq('is_verified', true);

    // Sorting
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
      default: // relevance — ranking_score DESC, featured first
        query = query.order('is_featured', { ascending: false })
                     .order('ranking_score', { ascending: false });
    }

    const { data, count } = await query;
    const docs = (data || []) as SearchDocument[];

    // Async: record popular query (fire and forget)
    this.recordPopularQuery(params.q, params.city || 'calicut').catch(() => {});

    // Group results by module
    return this.groupByModule(docs, count || 0);
  }

  /**
   * Autocomplete suggestions — trigram similarity + popular terms
   */
  static async getSuggestions(q: string, city: string, limit: number = 6): Promise<SearchSuggestion[]> {
    // Trigram similarity match on search_documents titles
    const { data: docResults } = await this.supabase
      .from('search_documents')
      .select('title, module')
      .eq('status', 'active')
      .ilike('title', `%${q}%`)
      .order('ranking_score', { ascending: false })
      .limit(limit);

    // Popular query prefix match
    const { data: popularResults } = await this.supabase
      .from('search_popular')
      .select('query')
      .eq('city_slug', city)
      .ilike('query', `${q}%`)
      .order('hit_count', { ascending: false })
      .limit(4);

    const suggestions: SearchSuggestion[] = [];

    // Popular terms first
    (popularResults || []).forEach((p) => {
      suggestions.push({ label: p.query, module: 'popular' });
    });

    // Document title suggestions
    (docResults || []).forEach((d) => {
      if (!suggestions.find((s) => s.label.toLowerCase() === d.title.toLowerCase())) {
        suggestions.push({ label: d.title, module: d.module });
      }
    });

    return suggestions.slice(0, limit);
  }

  /**
   * Get trending/popular searches for a city
   */
  static async getTrending(city: string, limit: number = 10): Promise<string[]> {
    const { data } = await this.supabase
      .from('search_popular')
      .select('query')
      .eq('city_slug', city)
      .order('hit_count', { ascending: false })
      .limit(limit);

    return (data || []).map((r) => r.query);
  }

  /**
   * Get a user's recent search history
   */
  static async getRecentSearches(userId: string, limit: number = 10) {
    const { data } = await this.supabase
      .from('search_history')
      .select('id, query, module, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return data || [];
  }

  /**
   * Record a search query into history + increment popular counter
   */
  static async recordSearchHistory(userId: string, query: string, module: string, resultCount: number) {
    await this.supabase.from('search_history').insert({
      user_id: userId,
      query: query.trim().toLowerCase(),
      module,
      result_count: resultCount,
    });
  }

  /**
   * Save a search query for future alerts
   */
  static async saveSearch(userId: string, query: string, module: string, filters?: Record<string, unknown>, alertEmail?: boolean) {
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

  /**
   * Clear all search history for a user
   */
  static async clearHistory(userId: string) {
    const { error } = await this.supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }

  /**
   * Index (upsert) a search document for any module entity
   */
  static async indexDocument(doc: {
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
    const { error } = await this.supabase
      .from('search_documents')
      .upsert(
        {
          module: doc.module,
          entity_id: doc.entityId,
          title: doc.title,
          description: doc.description || null,
          keywords: doc.keywords || null,
          tags: doc.tags || null,
          category: doc.category || null,
          city_slug: doc.citySlug || 'calicut',
          area: doc.area || null,
          popularity_score: doc.popularityScore ?? 0,
          ranking_score: doc.rankingScore ?? 0,
          is_featured: doc.isFeatured ?? false,
          is_verified: doc.isVerified ?? false,
          status: 'active',
          published_at: doc.publishedAt || new Date().toISOString(),
        } as any,
        { onConflict: 'module,entity_id' }
      );

    if (error) throw new Error(`Indexing failed: ${error.message}`);
  }

  /**
   * Remove a document from the search index (soft — set status=inactive)
   */
  static async deindexDocument(module: string, entityId: string) {
    await this.supabase
      .from('search_documents')
      .update({ status: 'inactive' })
      .eq('module', module)
      .eq('entity_id', entityId);
  }

  // ------------------------------------------------
  // Private Helpers
  // ------------------------------------------------

  private static async recordPopularQuery(q: string, city: string) {
    await this.supabase.rpc('record_search_query', { p_query: q, p_city: city });
  }

  private static groupByModule(docs: SearchDocument[], total: number): SearchGroupedResults {
    const group = (module: string) =>
      docs.filter((d) => d.module === module);

    return {
      businesses:  group('business'),
      jobs:        group('job'),
      marketplace: group('marketplace'),
      properties:  group('property'),
      events:      group('event'),
      news:        group('news'),
      explore:     group('explore'),
      total,
    };
  }
}
