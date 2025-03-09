import { ProductRepository, ProductFilters } from '@/lib/supabase/repositories/products';
import { UserProduct } from '@/types/products';
import { ProductCategory } from '@/types/products';
import { useAuth } from '@/hooks/useAuth';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  /**
   * 获取指定分类的用户产品列表
   */
  async getUserProductsByCategory(userId: string, category: ProductCategory | 'MAKEUP'): Promise<UserProduct[]> {
    try {
      const filters: ProductFilters = {
        userId,
        category,
      };
      
      const products = await this.repository.getUserProducts(filters);
      return products;
    } catch (error) {
      console.error('获取用户产品列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取指定分类的产品数量
   */
  async getCategoryProductCount(userId: string, category: ProductCategory | 'MAKEUP'): Promise<number> {
    try {
      const count = await this.repository.getCategoryCount(userId, category);
      return count;
    } catch (error) {
      console.error('获取分类产品数量失败:', error);
      throw error;
    }
  }

  // 获取所有用户产品
  async getAllUserProducts(userId: string): Promise<UserProduct[]> {
    const filters: ProductFilters = {
      userId,
      category: 'all' as any // 使用 'all' 来获取所有产品
    };
    return await this.repository.getUserProducts(filters);
  }
} 