import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductService } from '@/services/product.service';
import { UserProduct } from '@/lib/supabase/types';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProductData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  const { user } = useAuth();
  const productService = new ProductService();

  const fetchProducts = useCallback(async (force: boolean = false) => {
    console.log('[useProductData] 开始获取产品:', {
      force,
      hasUser: !!user?.id,
      lastFetchTime,
    });

    if (!user?.id) {
      setError(new Error('用户未登录'));
      return null;
    }

    // 如果未强制刷新且缓存未过期，跳过获取
    const now = Date.now();
    if (!force && lastFetchTime > 0 && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('[useProductData] 使用缓存数据');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const products = await productService.getAllUserProducts(user.id);
      setLastFetchTime(now);
      return products;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('获取产品列表失败');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, lastFetchTime, productService]);

  const invalidateCache = useCallback(() => {
    setLastFetchTime(0);
  }, []);

  return {
    fetchProducts,
    invalidateCache,
    isLoading,
    error,
    lastFetchTime,
  };
} 