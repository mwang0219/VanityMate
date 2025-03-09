import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProductService } from '@/services/product.service';
import { UserProduct } from '@/lib/supabase/types';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProductData() {
  const { user } = useAuth();
  const productService = new ProductService();

  const fetchProducts = useCallback(async () => {
    if (!user?.id) {
      throw new Error('用户未登录');
    }

    const products = await productService.getAllUserProducts(user.id);
    return products;
  }, [user?.id, productService]);

  return {
    fetchProducts
  };
} 