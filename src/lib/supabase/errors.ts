import { PostgrestError } from '@supabase/supabase-js';

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }

  static fromDatabaseError(error: PostgrestError): SupabaseError {
    return new SupabaseError(
      error.message,
      error.code,
      { hint: error.hint, details: error.details }
    );
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
} 