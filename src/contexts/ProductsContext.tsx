import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { ProductCategory } from '@/types/products';
import { UserProduct } from '@/lib/supabase/types';
import { useProductData } from '@/hooks/products/useProductData';

interface ProductsContextValue {
  // 数据状态
  products: UserProduct[];
  filteredProducts: UserProduct[];
  isLoading: boolean;
  error: Error | null;
  
  // 分类状态
  selectedCategory: ProductCategory | 'MAKEUP' | null;
  setSelectedCategory: (category: ProductCategory | 'MAKEUP' | null) => void;
  
  // 操作方法
  refreshProducts: () => Promise<void>;
  invalidateCache: () => void;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  initialCategory?: ProductCategory | 'MAKEUP' | null;
}

export function ProductsProvider({ children, initialCategory = null }: ProductsProviderProps) {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = React.useState<ProductCategory | 'MAKEUP' | null>(initialCategory);
  const [allProducts, setAllProducts] = React.useState<UserProduct[]>([]);
  
  // 使用新的 useProductData hook
  const { 
    fetchProducts, 
    invalidateCache, 
    isLoading, 
    error 
  } = useProductData();

  // 获取所有产品
  const refreshProducts = useCallback(async () => {
    const products = await fetchProducts(true);
    if (products) {
      setAllProducts(products);
    }
  }, [fetchProducts]);

  // 根据分类筛选产品
  const filteredProducts = React.useMemo(() => {
    if (!selectedCategory) return allProducts;
    
    if (selectedCategory === 'MAKEUP') {
      return allProducts.filter(item => 
        item.product && ['BASE', 'EYE', 'LIP'].includes(item.product.category_id)
      );
    }
    
    return allProducts.filter(item => 
      item.product && item.product.category_id === selectedCategory
    );
  }, [allProducts, selectedCategory]);

  // 初始加载
  useEffect(() => {
    const loadProducts = async () => {
      const products = await fetchProducts();
      if (products) {
        setAllProducts(products);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  const value = React.useMemo(() => ({
    products: allProducts,
    filteredProducts,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    refreshProducts,
    invalidateCache
  }), [
    allProducts,
    filteredProducts,
    isLoading,
    error,
    selectedCategory,
    refreshProducts,
    invalidateCache
  ]);

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