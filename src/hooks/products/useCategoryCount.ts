import { useState, useEffect } from 'react';
import { ProductService } from '@/services/product.service';
import { ProductCategory } from '@/types/products';
import { useAuth } from '@/hooks/useAuth';

interface UseCategoryCountState {
  count: number;
  isLoading: boolean;
  error: Error | null;
}

export function useCategoryCount(category: ProductCategory | 'MAKEUP') {
  const [state, setState] = useState<UseCategoryCountState>({
    count: 0,
    isLoading: true,
    error: null,
  });

  const { user } = useAuth();
  const productService = new ProductService();

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      if (!user?.id) return;

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const count = await productService.getCategoryProductCount(user.id, category);
        
        if (isMounted) {
          setState({
            count,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            count: 0,
            isLoading: false,
            error: error as Error,
          });
        }
      }
    };

    fetchCount();

    return () => {
      isMounted = false;
    };
  }, [user?.id, category]);

  return state;
} 