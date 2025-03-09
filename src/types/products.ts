export interface Product {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  subcategory_id?: number;
  description?: string;
  image_url?: string;
  pao?: number;
  created_at: string;
}

export interface UserProduct {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  status: number;
  batch_code?: string;
  purchase_date?: string;
  open_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_favorite: boolean;
  last_used_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export enum ProductCategory {
  BASE = 'BASE',
  EYE = 'EYE',
  LIP = 'LIP',
  SKINCARE = 'SKINCARE',
  FRAGRANCE = 'FRAGRANCE',
  TOOLS = 'TOOLS',
}

export enum ProductStatus {
  UNOPENED = 1,
  IN_USE = 2,
  FINISHED = 3,
}

export interface ProductSubcategory {
  id: number;
  category_id: string;
  name: string;
  description?: string;
} 