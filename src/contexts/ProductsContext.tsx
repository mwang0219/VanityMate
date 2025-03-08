import React, { createContext, useContext, ReactNode } from 'react';
import { ProductCategory } from '@/types/products';
import { UserProduct } from '@/lib/supabase/types';
import { useProductList } from '@/hooks/products';

interface ProductsContextValue {
  products: UserProduct[];
  isLoading: boolean;
  error: Error | null;
  selectedCategory: ProductCategory | 'MAKEUP' | null;
  setSelectedCategory: (category: ProductCategory | 'MAKEUP' | null) => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  initialCategory?: ProductCategory | 'MAKEUP' | null;
}

export function ProductsProvider({ children, initialCategory = null }: ProductsProviderProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | 'MAKEUP' | null>(initialCategory);
  const { products, isLoading, error } = useProductList(selectedCategory || 'MAKEUP');

  const value = React.useMemo(() => ({
    products,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
  }), [products, isLoading, error, selectedCategory]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
} 