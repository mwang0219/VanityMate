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
  user_id: string;
  purchase_date: string;
  expiry_date: string | null;
  opened_date: string | null;
  status: 'unopened' | 'in_use' | 'used_up';
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