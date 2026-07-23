import { createClient } from '@/lib/supabase/client';

export interface SearchResultItem {
  id: string;
  module: 'businesses' | 'news' | 'events' | 'jobs' | 'marketplace' | 'properties' | 'tourism';
  title: string;
  summary: string;
  category: string;
  location: string;
  url: string;
  thumbnail?: string;
  metaBadge?: string;
}

export class GlobalSearchService {
  private static supabase = createClient();

  static async searchAll(queryText: string, moduleFilter: string = 'all'): Promise<SearchResultItem[]> {
    if (!queryText || queryText.trim().length === 0) return [];
    const term = `%${queryText.trim()}%`;
    const results: SearchResultItem[] = [];

    // 1. Search Businesses
    if (moduleFilter === 'all' || moduleFilter === 'businesses') {
      const { data: businesses } = await this.supabase
        .from('businesses')
        .select('id, name, slug, short_description, description, rating_avg, business_categories(name), areas(name)')
        .ilike('name', term)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(6);

      businesses?.forEach((b: any) => {
        results.push({
          id: b.id,
          module: 'businesses',
          title: b.name,
          summary: b.short_description || b.description.substring(0, 100),
          category: b.business_categories?.name || 'Commercial Outlets',
          location: b.areas?.name || 'Kozhikode',
          url: `/business/${b.slug}`,
          metaBadge: `Rating ${b.rating_avg}`,
        });
      });
    }

    // 2. Search Local News
    if (moduleFilter === 'all' || moduleFilter === 'news') {
      const { data: newsList } = await this.supabase
        .from('news')
        .select('id, title, slug, summary, news_categories(name)')
        .ilike('title', term)
        .eq('status', 'published')
        .is('deleted_at', null)
        .limit(6);

      newsList?.forEach((n: any) => {
        results.push({
          id: n.id,
          module: 'news',
          title: n.title,
          summary: n.summary,
          category: n.news_categories?.name || 'Local News',
          location: 'Kozhikode',
          url: `/news/${n.slug}`,
        });
      });
    }

    // 3. Search Events
    if (moduleFilter === 'all' || moduleFilter === 'events') {
      const { data: eventsList } = await this.supabase
        .from('events')
        .select('id, title, slug, venue, start_date, event_categories(name)')
        .ilike('title', term)
        .eq('status', 'published')
        .is('deleted_at', null)
        .limit(6);

      eventsList?.forEach((e: any) => {
        results.push({
          id: e.id,
          module: 'events',
          title: e.title,
          summary: `Event at ${e.venue}`,
          category: e.event_categories?.name || 'Events',
          location: e.venue,
          url: `/events/${e.slug}`,
          metaBadge: new Date(e.start_date).toLocaleDateString(),
        });
      });
    }

    // 4. Search Jobs
    if (moduleFilter === 'all' || moduleFilter === 'jobs') {
      const { data: jobsList } = await this.supabase
        .from('jobs')
        .select('id, title, slug, salary, employment_type, companies(name)')
        .ilike('title', term)
        .eq('status', 'published')
        .is('deleted_at', null)
        .limit(6);

      jobsList?.forEach((j: any) => {
        results.push({
          id: j.id,
          module: 'jobs',
          title: j.title,
          summary: `${j.companies?.name || 'Cyberpark Firm'} • ${j.salary}`,
          category: j.employment_type.toUpperCase(),
          location: 'Cyberpark / Calicut',
          url: `/jobs/${j.slug}`,
          metaBadge: j.salary,
        });
      });
    }

    // 5. Search Marketplace
    if (moduleFilter === 'all' || moduleFilter === 'marketplace') {
      const { data: itemsList } = await this.supabase
        .from('marketplace_items')
        .select('id, title, slug, price, condition, marketplace_categories(name)')
        .ilike('title', term)
        .eq('status', 'active')
        .is('deleted_at', null)
        .limit(6);

      itemsList?.forEach((m: any) => {
        results.push({
          id: m.id,
          module: 'marketplace',
          title: m.title,
          summary: `Price ₹${m.price}`,
          category: m.marketplace_categories?.name || 'Classifieds',
          location: 'Kozhikode',
          url: `/marketplace/${m.slug}`,
          metaBadge: `₹${m.price}`,
        });
      });
    }

    // 6. Search Properties
    if (moduleFilter === 'all' || moduleFilter === 'properties') {
      const { data: propsList } = await this.supabase
        .from('properties')
        .select('id, title, slug, price, listing_type, bedrooms, property_categories(name)')
        .ilike('title', term)
        .eq('status', 'published')
        .is('deleted_at', null)
        .limit(6);

      propsList?.forEach((p: any) => {
        results.push({
          id: p.id,
          module: 'properties',
          title: p.title,
          summary: `${p.bedrooms} BHK Real Estate • ${p.listing_type.toUpperCase()}`,
          category: p.property_categories?.name || 'Real Estate',
          location: 'Kozhikode',
          url: `/properties/${p.slug}`,
          metaBadge: `₹${p.price}`,
        });
      });
    }

    return results;
  }

  static async getTrendingSearches() {
    const { data } = await this.supabase
      .from('popular_searches')
      .select('keyword, search_count')
      .eq('is_trending', true)
      .limit(6);
    return data || [];
  }
}
