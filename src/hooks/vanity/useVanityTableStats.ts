import { useProducts } from '@/contexts/ProductsContext';
import { ProductCategory } from '@/types/products';

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
  const { 
    totalCount = 0,
    makeupCount = 0,
    skincareCount = 0,
    fragranceCount = 0,
    toolsCount = 0
  } = useProducts();

  const categories: CategoryItem[] = [
    {
      id: 'MAKEUP',
      name: '彩妆',
      count: makeupCount,
      colors: ['#FFB6C1', '#FF69B4'],
      icon: 'palette',
      subCategories: [ProductCategory.BASE, ProductCategory.EYE, ProductCategory.LIP]
    },
    {
      id: ProductCategory.SKINCARE,
      name: '护肤',
      count: skincareCount,
      colors: ['#E6E6FA', '#9370DB'],
      icon: 'spa',
    },
    {
      id: ProductCategory.FRAGRANCE,
      name: '香水',
      count: fragranceCount,
      colors: ['#98FB98', '#3CB371'],
      icon: 'opacity',
    },
    {
      id: ProductCategory.TOOLS,
      name: '工具',
      count: toolsCount,
      colors: ['#87CEEB', '#4169E1'],
      icon: 'brush',
    }
  ];

  return {
    categories,
    totalProducts: totalCount
  };
} 