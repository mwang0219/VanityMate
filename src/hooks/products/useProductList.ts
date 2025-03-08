import { useState, useEffect } from 'react';
import { ProductService } from '@/services/product.service';
import { UserProduct } from '@/lib/supabase/types';
import { ProductCategory } from '@/types/products';
import { useAuth } from '@/hooks/useAuth';

interface UseProductListState {
  products: UserProduct[];
  isLoading: boolean;
  error: Error | null;
}

export function useProductList(category: ProductCategory | 'MAKEUP') {
  const [state, setState] = useState<UseProductListState>({
    products: [],
    isLoading: true,
    error: null,
  });

  const { user } = useAuth();
  const productService = new ProductService();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (!user?.id) return;

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const products = await productService.getUserProductsByCategory(user.id, category);
        
        if (isMounted) {
          setState({
            products,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            products: [],
            isLoading: false,
            error: error as Error,
          });
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [user?.id, category]);

  return state;
} 