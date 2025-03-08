export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  subcategory_id: number | null;
  description: string | null;
  image_url: string | null;
  pao: number | null;
  created_at: string;
}

export interface UserProduct {
  id: string;
  user_id: string;
  product_id: string;
  status: number;
  batch_code: string | null;
  purchase_date: string | null;
  open_date: string | null;
  expiry_date: string | null;
  image_url: string | null;
  is_favorite: boolean;
  last_used_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  ingredient_id: string;
  created_at: string;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type DatabaseError = {
  code: string;
  message: string;
  details: any;
}; 