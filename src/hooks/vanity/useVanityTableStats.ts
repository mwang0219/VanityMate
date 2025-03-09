import { useProducts } from '@/contexts/ProductsContext';
import { ProductCategory } from '@/types/products';
import { useMemo } from 'react';
import { useProductStats } from '@/hooks/products/useProductStats';

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  colors: string[];
  icon: string;
  subCategories?: ProductCategory[];
}

export interface VanityTableStats {
  categories: CategoryItem[];
  totalProducts: number;
}

export function useVanityTableStats(): VanityTableStats {
  const { products = [], filteredProducts = [] } = useProducts();
  const stats = useProductStats(products, filteredProducts);

  // 使用 useMemo 缓存分类配置
  const categories = useMemo(() => [
    {
      id: 'MAKEUP',
      name: '彩妆',
      count: stats.makeupCount,
      colors: ['#FFB6C1', '#FF69B4'],
      icon: 'palette',
      subCategories: [ProductCategory.BASE, ProductCategory.EYE, ProductCategory.LIP]
    },
    {
      id: ProductCategory.SKINCARE,
      name: '护肤',
      count: stats.categoryStats[ProductCategory.SKINCARE],
      colors: ['#E6E6FA', '#9370DB'],
      icon: 'spa',
    },
    {
      id: ProductCategory.FRAGRANCE,
      name: '香水',
      count: stats.categoryStats[ProductCategory.FRAGRANCE],
      colors: ['#98FB98', '#3CB371'],
      icon: 'opacity',
    },
    {
      id: ProductCategory.TOOLS,
      name: '工具',
      count: stats.categoryStats[ProductCategory.TOOLS],
      colors: ['#87CEEB', '#4169E1'],
      icon: 'brush',
    }
  ], [stats]);

  return {
    categories,
    totalProducts: stats.totalCount
  };
} 