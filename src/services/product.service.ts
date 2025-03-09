import { ProductRepository, ProductFilters, DeleteUserProductResult } from '@/lib/supabase/repositories/products';
import { UserProduct } from '@/types/products';
import { ProductCategory } from '@/types/products';
import { useAuth } from '@/hooks/useAuth';
import { ValidationError } from '@/lib/supabase/client';

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

  /**
   * 删除用户的产品
   * @param userId 用户ID
   * @param productId 产品ID
   * @throws {ValidationError} 当参数无效时
   * @returns 删除操作的结果
   */
  async deleteUserProduct(userId: string, productId: string): Promise<DeleteUserProductResult> {
    // 参数验证
    if (!userId?.trim()) {
      throw new ValidationError('用户ID不能为空');
    }
    if (!productId?.trim()) {
      throw new ValidationError('产品ID不能为空');
    }

    // 调用仓库层删除方法
    const result = await this.repository.deleteUserProduct(userId, productId);

    // 如果删除失败，抛出适当的错误
    if (!result.success && result.error) {
      if (result.error.code === 'NOT_FOUND') {
        throw new ValidationError(result.error.message);
      }
      // 其他错误会保持原样返回
    }

    return result;
  }
} 