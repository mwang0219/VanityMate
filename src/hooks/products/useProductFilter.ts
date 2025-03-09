import { useMemo } from 'react';
import { UserProduct } from '@/types/products';
import { applyFilters, ProductFilterOptions } from '@/utils/products/filters';

export function useProductFilter(
  products: UserProduct[],
  options: ProductFilterOptions
) {
  const filteredProducts = useMemo(() => {
    return applyFilters(products, options);
  }, [products, options]);

  return {
    filteredProducts
  };
} 