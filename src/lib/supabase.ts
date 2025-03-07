import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// 从环境变量或 Constants manifest 中获取 Supabase URL 和 anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建 Supabase 客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型定义
export interface User {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  category: 'makeup' | 'skincare' | 'fragrance' | 'tools';
  sub_category: string | null;
  purchase_date: string | null;
  expiry_date: string | null;
  batch_number: string | null;
  status: 'unopened' | 'in_use' | 'finished';
  image_url: string | null;
  created_at: string;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_name: string;
  is_sensitive: boolean;
  created_at: string;
} 