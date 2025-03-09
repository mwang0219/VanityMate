import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductService } from '@/services/product.service';
import { UserProduct } from '@/lib/supabase/types';
import { productCache } from '@/utils/products/cache';

export interface UseProductDataOptions {
  skipCache?: boolean;
}

export function useProductData() {
  const { user } = useAuth();
  const productService = new ProductService();

  const fetchProducts = useCallback(async (options: UseProductDataOptions = {}) => {
    if (!user?.id) {
      throw new Error('用户未登录');
    }

    // 如果不跳过缓存，先尝试从缓存获取
    if (!options.skipCache) {
      const cachedProducts = productCache.get(user.id);
      if (cachedProducts) {
        return cachedProducts;
      }
    }

    // 从服务器获取数据
    const products = await productService.getAllUserProducts(user.id);
    
    // 缓存新数据
    productCache.set(user.id, products);
    
    return products;
  }, [user?.id, productService]);

  const invalidateCache = useCallback(() => {
    if (user?.id) {
      productCache.clear(user.id);
    }
  }, [user?.id]);

  const getCacheStatus = useCallback(() => {
    if (!user?.id) {
      return {
        exists: false,
        isValid: false,
        isExpired: true,
        age: 0
      };
    }
    return productCache.getStatus(user.id);
  }, [user?.id]);

  return {
    fetchProducts,
    invalidateCache,
    getCacheStatus,
    isAuthenticated: !!user?.id
  };
} 