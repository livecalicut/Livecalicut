import { createClient } from '@/lib/supabase/client';

export type SearchableEntityType =
  | 'business'
  | 'job'
  | 'marketplace'
  | 'property'
  | 'event'
  | 'news'
  | 'community'
  | 'tourism';

export class SearchService {
  private static supabase = createClient();

  static async indexEntity(params: {
    cityId: string;
    entityType: SearchableEntityType;
    entityId: string;
    title: string;
    description?: string;
    keywords?: string[];
    wardLocation?: string;
  }) {
    const { data, error } = await this.supabase
      .from('search_index')
      .upsert({
        city_id: params.cityId,
        entity_type: params.entityType,
        entity_id: params.entityId,
        title: params.title,
        description: params.description,
        keywords: params.keywords || [],
        ward_location: params.wardLocation,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async search(cityId: string, queryText: string, entityType?: SearchableEntityType) {
    let query = this.supabase
      .from('search_index')
      .select('*')
      .eq('city_id', cityId)
      .is('deleted_at', null)
      .ilike('title', `%${queryText}%`);

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}
