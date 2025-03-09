import React, { createContext, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { ProductCategory } from '@/types/products';
import { UserProduct } from '@/types/products';
import { useProductData } from '@/hooks/products/useProductData';
import { useProductFilter } from '@/hooks/products/useProductFilter';
import { useProductStats, ProductStats } from '@/hooks/products/useProductStats';
import { useProductState, ProductLoadingState, ProductError } from '@/hooks/products/useProductState';
import { ProductFilterOptions } from '@/utils/products/filters';

interface CacheStatus {
  exists: boolean;
  isValid: boolean;
  isExpired: boolean;
  age: number;
}

interface ProductsContextValue extends ProductStats {
  // 产品数据
  products: UserProduct[];
  filteredProducts: UserProduct[];
  
  // 过滤器状态
  filterOptions: ProductFilterOptions;
  setFilterOptions: (options: Partial<ProductFilterOptions>) => void;
  selectedCategory: ProductCategory | 'MAKEUP' | 'all' | null;
  
  // 加载状态
  isLoading: boolean;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isFetching: boolean;
  error: ProductError | null;
  clearError: () => void;
  
  // 操作方法
  refreshProducts: () => Promise<void>;
  invalidateCache: () => void;
  cacheStatus: CacheStatus;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  initialCategory?: ProductCategory | 'MAKEUP' | null;
}

export function ProductsProvider({ children, initialCategory = null }: ProductsProviderProps) {
  // 状态管理
  const [filterOptions, setFilterOptionsState] = React.useState<ProductFilterOptions>({
    category: initialCategory,
    searchQuery: '',
    isExpired: false,
    isExpiring: false,
    status: undefined
  });
  const [allProducts, setAllProducts] = React.useState<UserProduct[]>([]);
  
  // 使用状态管理 hook
  const {
    isLoading,
    isInitialLoading,
    isRefreshing,
    isFetching,
    error,
    startLoading,
    stopLoading,
    handleError,
    clearError
  } = useProductState();

  // 使用其他 hooks
  const { fetchProducts, invalidateCache, getCacheStatus, isAuthenticated } = useProductData();

  const { filteredProducts } = useProductFilter(allProducts, filterOptions);

  const stats = useProductStats(allProducts, filteredProducts);

  // 更新过滤选项
  const setFilterOptions = useCallback((options: Partial<ProductFilterOptions>) => {
    setFilterOptionsState(prev => ({
      ...prev,
      ...options
    }));
  }, []);

  // 获取所有产品
  const refreshProducts = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      startLoading('isRefreshing');
      const products = await fetchProducts({ skipCache: true });
      setAllProducts(products);
    } catch (err) {
      handleError(err);
    } finally {
      stopLoading('isRefreshing');
    }
  }, [fetchProducts, startLoading, stopLoading, handleError, isAuthenticated]);

  // 初始加载
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      // 未登录时不加载数据
      if (!isAuthenticated) {
        if (allProducts.length > 0) {
          setAllProducts([]);
        }
        return;
      }

      try {
        // 只有在没有数据时才显示加载状态
        if (allProducts.length === 0) {
          startLoading('isInitialLoading');
        }
        
        const products = await fetchProducts();
        if (isMounted && products.length > 0) {
          setAllProducts(products);
        }
      } catch (err) {
        if (isMounted) {
          handleError(err);
        }
      } finally {
        if (isMounted) {
          stopLoading('isInitialLoading');
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const value = useMemo(() => ({
    products: allProducts,
    filteredProducts,
    filterOptions,
    setFilterOptions,
    selectedCategory: filterOptions.category || null,
    isLoading,
    isInitialLoading,
    isRefreshing,
    isFetching,
    error,
    clearError,
    refreshProducts,
    invalidateCache,
    cacheStatus: getCacheStatus(),
    ...stats
  }), [
    allProducts,
    filteredProducts,
    filterOptions,
    isLoading,
    isInitialLoading,
    isRefreshing,
    isFetching,
    error,
    stats,
    getCacheStatus
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