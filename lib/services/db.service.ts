import { createClient } from '@/lib/supabase/client';

export class DbService {
  private static supabase = createClient();

  static async findById(table: string, id: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async findAll(table: string, filters: Record<string, any> = {}) {
    let query = this.supabase.from(table).select('*').is('deleted_at', null);
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query = query.eq(key, val);
      }
    });
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async insert(table: string, record: Record<string, any>) {
    const { data, error } = await this.supabase
      .from(table)
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(table: string, id: string, record: Record<string, any>) {
    const { data, error } = await this.supabase
      .from(table)
      .update({ ...record, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async softDelete(table: string, id: string) {
    const { data, error } = await this.supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString(), is_active: false })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
