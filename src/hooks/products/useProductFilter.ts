import { useMemo } from 'react';
import { UserProduct } from '@/lib/supabase/types';
import { ProductCategory } from '@/types/products';

export interface ProductFilterOptions {
  category: ProductCategory | 'MAKEUP' | null;
}

export function useProductFilter(products: UserProduct[], options: ProductFilterOptions) {
  const { category } = options;

  const filteredProducts = useMemo(() => {
    if (!category) return products;
    
    if (category === 'MAKEUP') {
      return products.filter(item => 
        item.product && ['BASE', 'EYE', 'LIP'].includes(item.product.category_id)
      );
    }
    
    return products.filter(item => 
      item.product && item.product.category_id === category
    );
  }, [products, category]);

  return { filteredProducts };
} 