import { createClient, User, Session, AuthError } from '@supabase/supabase-js';
import type { Database } from './types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// 创建带类型的 Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 重新导出类型
export type { User, Session, AuthError };
export type { Database };

// 导出其他模块
export * from './errors'; 