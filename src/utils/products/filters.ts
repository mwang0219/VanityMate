import { UserProduct } from '@/lib/supabase/types';
import { ProductCategory } from '@/types/products';

export interface ProductFilterOptions {
  category?: ProductCategory | 'MAKEUP' | null;
  searchQuery?: string;
  isExpired?: boolean;
  isExpiring?: boolean;
  status?: 'unopened' | 'in_use' | 'finished';
}

/**
 * 按分类过滤产品
 */
export function filterByCategory(
  products: UserProduct[],
  category: ProductCategory | 'MAKEUP' | null
): UserProduct[] {
  console.log('[filterByCategory] 开始过滤:', {
    totalProducts: products.length,
    category,
    sampleProduct: products[0]?.product
  });

  if (!category) {
    console.log('[filterByCategory] 没有分类，返回所有产品');
    return products;
  }

  const filtered = products.filter(product => {
    if (!product.product) {
      console.log('[filterByCategory] 警告: 产品缺少 product 属性:', product);
      return false;
    }

    if (category === 'MAKEUP') {
      // MAKEUP 类别包括 BASE, EYE, LIP
      const isMakeup = ['BASE', 'EYE', 'LIP'].includes(product.product.category_id);
      console.log('[filterByCategory] MAKEUP 过滤:', {
        productId: product.id,
        categoryId: product.product.category_id,
        isMakeup
      });
      return isMakeup;
    }

    const matches = product.product.category_id === category;
    console.log('[filterByCategory] 分类匹配:', {
      productId: product.id,
      productCategory: product.product.category_id,
      targetCategory: category,
      matches
    });
    return matches;
  });

  console.log('[filterByCategory] 过滤结果:', {
    totalProducts: products.length,
    filteredCount: filtered.length,
    category
  });

  return filtered;
}

/**
 * 按搜索关键词过滤产品
 */
export function filterBySearch(
  products: UserProduct[],
  searchQuery: string
): UserProduct[] {
  if (!searchQuery.trim()) return products;
  
  const query = searchQuery.toLowerCase().trim();
  return products.filter(product => 
    product.product.name.toLowerCase().includes(query) ||
    product.product.brand?.toLowerCase().includes(query) ||
    product.product.description?.toLowerCase().includes(query) ||
    product.notes?.toLowerCase().includes(query)
  );
}

/**
 * 按过期状态过滤产品
 */
export function filterByExpiration(
  products: UserProduct[],
  options: { isExpired?: boolean; isExpiring?: boolean }
): UserProduct[] {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return products.filter(product => {
    if (!product.expiry_date) return true;
    
    const expirationDate = new Date(product.expiry_date);
    const isExpired = expirationDate < now;
    const isExpiring = !isExpired && expirationDate <= thirtyDaysFromNow;

    if (options.isExpired) return isExpired;
    if (options.isExpiring) return isExpiring;
    return true;
  });
}

/**
 * 按使用状态过滤产品
 */
export function filterByStatus(
  products: UserProduct[],
  status: 'unopened' | 'in_use' | 'finished'
): UserProduct[] {
  if (!status) return products;
  const statusMap = {
    'unopened': 1,
    'in_use': 2,
    'finished': 3
  };
  return products.filter(product => product.status === statusMap[status]);
}

/**
 * 应用所有过滤条件
 */
export function applyFilters(
  products: UserProduct[],
  options: ProductFilterOptions
): UserProduct[] {
  console.log('[applyFilters] 开始应用过滤条件:', {
    totalProducts: products.length,
    options,
    sampleProduct: products[0]
  });

  let filtered = [...products];

  if (options.category) {
    console.log('[applyFilters] 应用分类过滤:', options.category);
    filtered = filterByCategory(filtered, options.category);
  }

  if (options.searchQuery) {
    filtered = filterBySearch(filtered, options.searchQuery);
  }

  if (options.isExpired || options.isExpiring) {
    filtered = filterByExpiration(filtered, {
      isExpired: options.isExpired,
      isExpiring: options.isExpiring
    });
  }

  if (options.status) {
    filtered = filterByStatus(filtered, options.status);
  }

  console.log('[applyFilters] 过滤完成:', {
    originalCount: products.length,
    filteredCount: filtered.length,
    appliedOptions: Object.keys(options).filter(key => options[key] !== undefined)
  });

  return filtered;
} 