import { supabase } from '../client';
import { SupabaseError } from '../errors';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

export class BaseRepository<T> {
  constructor(protected table: string) {}

  protected handleError(error: any): never {
    if (error.code) {
      throw SupabaseError.fromDatabaseError(error);
    }
    throw error;
  }

  async findOne(id: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findMany(query?: (builder: PostgrestFilterBuilder<any, any, any>) => PostgrestFilterBuilder<any, any, any>): Promise<T[]> {
    try {
      let builder = supabase.from(this.table).select('*');
      if (query) {
        builder = query(builder);
      }
      const { data, error } = await builder;

      if (error) throw error;
      return data || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const { data: created, error } = await supabase
        .from(this.table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return created;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: updated, error } = await supabase
        .from(this.table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error);
    }
  }
} 