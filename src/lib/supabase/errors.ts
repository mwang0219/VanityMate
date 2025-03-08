import { DatabaseError } from './types';

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }

  static fromDatabaseError(error: DatabaseError): SupabaseError {
    return new SupabaseError(error.message, error.code, error.details);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
} 