import { useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductService } from '@/services/product.service';
import { UserProduct } from '@/lib/supabase/types';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProductData() {
  const { user } = useAuth();
  const productService = new ProductService();
  const lastFetchTimeRef = useRef<number>(0);
  const cachedProductsRef = useRef<UserProduct[]>([]);

  const fetchProducts = useCallback(async (force: boolean = false) => {
    // 未登录时返回空数组
    if (!user?.id) {
      return [];
    }

    const now = Date.now();
    if (!force && lastFetchTimeRef.current > 0 && 
        (now - lastFetchTimeRef.current) < CACHE_DURATION && 
        cachedProductsRef.current.length > 0) {
      return cachedProductsRef.current;
    }

    const products = await productService.getAllUserProducts(user.id);
    lastFetchTimeRef.current = now;
    cachedProductsRef.current = products;
    return products;
  }, [user?.id, productService]);

  const invalidateCache = useCallback(() => {
    lastFetchTimeRef.current = 0;
    cachedProductsRef.current = [];
  }, []);

  return {
    fetchProducts,
    invalidateCache,
    isAuthenticated: !!user?.id
  };
} 