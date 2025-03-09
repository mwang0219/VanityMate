import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { ProductCategory } from '@/types/products';
import { UserProduct } from '@/lib/supabase/types';
import { ProductService } from '@/services/product.service';
import { useAuth } from '@/hooks/useAuth';

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
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = React.useState<number>(0);
  
  const { user } = useAuth();
  const productService = React.useMemo(() => new ProductService(), []);

  // 获取所有产品
  const fetchAllProducts = useCallback(async (force: boolean = false) => {
    console.log('[fetchAllProducts] 开始获取产品:', {
      force,
      hasUser: !!user?.id,
      currentProductsCount: allProducts.length,
      lastFetchTime,
    });

    if (!user?.id) {
      setError(new Error('用户未登录'));
      setIsLoading(false);
      return;
    }

    // 如果数据已存在且未超时，直接返回
    const now = Date.now();
    if (!force && allProducts.length > 0 && (now - lastFetchTime) < 5 * 60 * 1000) {
      console.log('[fetchAllProducts] 使用缓存数据');
      return;
    }

    try {
      console.log('[fetchAllProducts] 开始加载数据...');
      setIsLoading(true);
      setError(null);
      const products = await productService.getAllUserProducts(user.id);
      console.log('[fetchAllProducts] 数据加载完成:', {
        productsCount: products.length,
      });
      setAllProducts(products);
      setLastFetchTime(now);
    } catch (err) {
      console.error('[fetchAllProducts] 加载失败:', err);
      setError(err instanceof Error ? err : new Error('获取产品列表失败'));
    } finally {
      setIsLoading(false);
    }
  }, [productService, lastFetchTime, allProducts.length, user?.id]);

  // 根据分类筛选产品
  const filteredProducts = React.useMemo(() => {
    console.log('[filteredProducts] 开始过滤:', {
      selectedCategory,
      allProductsCount: allProducts.length,
      isLoading,
    });

    // 如果数据还在加载或没有数据，直接返回空数组
    if (isLoading || allProducts.length === 0) {
      console.log('[filteredProducts] 数据未就绪，返回空数组');
      return [];
    }

    if (!selectedCategory) {
      console.log('[filteredProducts] 没有选择分类，返回所有产品');
      return allProducts;
    }
    
    if (selectedCategory === 'MAKEUP') {
      const makeupProducts = allProducts.filter(item => 
        item.product && ['BASE', 'EYE', 'LIP'].includes(item.product.category_id)
      );
      console.log('[filteredProducts] 彩妆产品过滤结果:', {
        count: makeupProducts.length,
        categories: makeupProducts.map(p => p.product?.category_id),
      });
      return makeupProducts;
    }
    
    const categoryProducts = allProducts.filter(item => 
      item.product && item.product.category_id === selectedCategory
    );
    console.log('[filteredProducts] 分类产品过滤结果:', {
      category: selectedCategory,
      count: categoryProducts.length,
      matchedIds: categoryProducts.map(p => p.product?.category_id),
    });
    return categoryProducts;
  }, [allProducts, selectedCategory]);

  // 初始加载
  React.useEffect(() => {
    // 只在 allProducts 为空时才加载数据
    if (allProducts.length === 0) {
      console.log('[ProductsContext] 首次加载，开始初始化');
      fetchAllProducts();
    } else {
      console.log('[ProductsContext] 已有数据，跳过初始化');
    }
    
    return () => {
      // 不要在组件卸载时清除数据，保持数据持久化
      console.log('[ProductsContext] 组件卸载，保持数据状态');
    };
  }, [fetchAllProducts, allProducts.length]);

  // 监听分类变化
  React.useEffect(() => {
    console.log('[ProductsContext] 分类变化:', selectedCategory);
  }, [selectedCategory]);

  // 初始加载和刷新方法
  const refreshProducts = useCallback(async () => {
    await fetchAllProducts(true);
  }, [fetchAllProducts]);

  // 缓存失效方法
  const invalidateCache = useCallback(() => {
    setLastFetchTime(0);
  }, []);

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