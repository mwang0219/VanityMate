import { BaseRepository } from './base';
import { Product, UserProduct } from '../types';
import { ProductCategory } from '@/types/products';
import { supabase } from '../client';

export interface ProductFilters {
  userId: string;
  category: ProductCategory | 'MAKEUP';
}

export class ProductRepository extends BaseRepository<UserProduct> {
  constructor() {
    super('user_products');
  }

  /**
   * 获取用户产品列表
   */
  async getUserProducts(filters: ProductFilters): Promise<UserProduct[]> {
    const { userId, category } = filters;

    try {
      let query = supabase
        .from('user_products')
        .select(`
          id,
          user_id,
          product_id,
          status,
          batch_code,
          purchase_date,
          open_date,
          expiry_date,
          image_url,
          is_favorite,
          last_used_at,
          notes,
          created_at,
          updated_at,
          product:products (
            id,
            name,
            brand,
            category_id,
            subcategory_id,
            description,
            image_url,
            pao,
            created_at
          )
        `)
        .eq('user_id', userId);

      // 应用分类筛选
      if (category === 'MAKEUP') {
        query = query.in('product.category_id', [ProductCategory.BASE, ProductCategory.EYE, ProductCategory.LIP]);
      } else if (category && category !== 'all') {
        query = query.eq('product.category_id', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 获取指定类别的产品数量
   */
  async getCategoryCount(userId: string, category: ProductCategory | 'MAKEUP'): Promise<number> {
    try {
      let query = supabase
        .from('user_products')
        .select(`
          id,
          product:products (
            category_id
          )
        `, { count: 'exact', head: true })
        .eq('user_id', userId);

      if (category === 'MAKEUP') {
        query = query.in('product.category_id', [ProductCategory.BASE, ProductCategory.EYE, ProductCategory.LIP]);
      } else {
        query = query.eq('product.category_id', category);
      }

      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('获取类别产品数量失败:', error);
      return 0;
    }
  }
} 