import type { Database } from '@/lib/supabase/types/database';

// 从数据库类型中提取基础类型
type DbProduct = Database['public']['Tables']['products']['Row'];
type DbUserProduct = Database['public']['Tables']['user_products']['Row'];

// 产品状态枚举
export enum ProductStatus {
  UNOPENED = 1,
  IN_USE = 2,
  FINISHED = 3
}

// 产品分类枚举
export enum ProductCategory {
  BASE = 'BASE',
  EYE = 'EYE',
  LIP = 'LIP',
  SKINCARE = 'SKINCARE',
  FRAGRANCE = 'FRAGRANCE',
  TOOLS = 'TOOLS'
}

// 扩展数据库类型，添加业务逻辑所需的字段和关系
export interface Product extends DbProduct {
  subcategory?: ProductSubcategory;
}

export interface UserProduct extends Omit<DbUserProduct, 'user_id'> {
  user_id: string; // 确保 user_id 不为 null
  product: Product | null;
  status: ProductStatus;
}

export interface ProductSubcategory {
  id: string;
  name: string;
  category_id: ProductCategory;
} 