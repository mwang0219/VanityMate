import { useMemo } from 'react';
import { UserProduct } from '@/types/products';
import { ProductCategory, ProductStatus } from '@/types/products';

export interface ProductStats {
  // 基础统计
  totalCount: number;
  filteredCount: number;
  
  // 状态统计
  unopenedCount: number;
  inUseCount: number;
  finishedCount: number;
  
  // 分类统计
  categoryStats: {
    [key in ProductCategory]: number;
  };
  makeupCount: number; // 添加彩妆总数
  
  // 到期提醒
  expiringCount: number;  // 30天内到期
  expiredCount: number;   // 已过期
}

// 计算分类统计
function calculateCategoryStats(products: UserProduct[]): { 
  stats: { [key in ProductCategory]: number };
  makeupCount: number;
} {
  const stats = {
    [ProductCategory.BASE]: 0,
    [ProductCategory.EYE]: 0,
    [ProductCategory.LIP]: 0,
    [ProductCategory.SKINCARE]: 0,
    [ProductCategory.FRAGRANCE]: 0,
    [ProductCategory.TOOLS]: 0,
  };

  products.forEach(product => {
    if (product.product?.category_id) {
      stats[product.product.category_id as ProductCategory] += 1;
    }
  });

  // 计算彩妆总数（BASE + EYE + LIP）
  const makeupCount = stats[ProductCategory.BASE] + 
                     stats[ProductCategory.EYE] + 
                     stats[ProductCategory.LIP];

  return { stats, makeupCount };
}

// 计算即将到期的产品数量（30天内）
function calculateExpiringCount(products: UserProduct[]): number {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  return products.filter(product => {
    if (!product.expiry_date) return false;
    const expiryDate = new Date(product.expiry_date);
    return expiryDate > new Date() && expiryDate <= thirtyDaysFromNow;
  }).length;
}

// 计算已过期的产品数量
function calculateExpiredCount(products: UserProduct[]): number {
  const now = new Date();
  return products.filter(product => {
    if (!product.expiry_date) return false;
    return new Date(product.expiry_date) < now;
  }).length;
}

export function useProductStats(
  products: UserProduct[], 
  filteredProducts: UserProduct[]
): ProductStats {
  return useMemo(() => {
    const { stats: categoryStats, makeupCount } = calculateCategoryStats(products);

    return {
      // 基础统计
      totalCount: products.length,
      filteredCount: filteredProducts.length,
      
      // 状态统计
      unopenedCount: products.filter(p => p.status === ProductStatus.UNOPENED).length,
      inUseCount: products.filter(p => p.status === ProductStatus.IN_USE).length,
      finishedCount: products.filter(p => p.status === ProductStatus.FINISHED).length,
      
      // 分类统计
      categoryStats,
      makeupCount,
      
      // 到期情况
      expiringCount: calculateExpiringCount(products),
      expiredCount: calculateExpiredCount(products),
    };
  }, [products, filteredProducts]);
} 