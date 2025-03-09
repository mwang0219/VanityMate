import { BaseRepository } from './base';
import { Product, UserProduct, ProductCategory, ProductStatus } from '@/types/products';
import { supabase } from '../client';
import type { Database } from '../types/database';

// 使用数据库类型定义
type DbUserProduct = Database['public']['Tables']['user_products']['Row'];
type DbProduct = Database['public']['Tables']['products']['Row'];

export interface ProductFilters {
  userId: string;
  category: ProductCategory | 'MAKEUP' | 'all';
}

export class ProductRepository extends BaseRepository<UserProduct> {
  constructor() {
    super('user_products');
  }

  /**
   * 将数据库状态值转换为 ProductStatus 枚举
   */
  private mapStatus(status: number | null): ProductStatus {
    switch (status) {
      case 1:
        return ProductStatus.UNOPENED;
      case 2:
        return ProductStatus.IN_USE;
      case 3:
        return ProductStatus.FINISHED;
      default:
        return ProductStatus.UNOPENED; // 默认值
    }
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
          *,
          product:products (*)
        `)
        .eq('user_id', userId);

      // 应用分类筛选
      if (category === 'MAKEUP') {
        query = query.in('product.category_id', [ProductCategory.BASE, ProductCategory.EYE, ProductCategory.LIP]);
      } else if (category !== 'all') {
        query = query.eq('product.category_id', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // 转换数据库类型到应用类型
      return (data || []).map(item => {
        // 解构出需要特殊处理的字段
        const { user_id, status: dbStatus, ...rest } = item;
        return {
          ...rest,
          user_id: user_id!, // 确保 user_id 不为 null
          product: item.product as Product | null,
          status: this.mapStatus(dbStatus) // 转换状态值
        };
      });
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  /**
   * 获取指定类别的产品数量
   */
  async getCategoryCount(userId: string, category: ProductCategory | 'MAKEUP'): Promise<number> {
    try {
      let query = supabase
        .from('user_products')
        .select('product:products!inner(category_id)', { 
          count: 'exact', 
          head: true 
        })
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