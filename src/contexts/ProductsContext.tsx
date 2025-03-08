import React, { createContext, useContext, useState, useCallback } from 'react';
import { ProductCategory } from '@/types/products';

type SortOption = 'purchase_date' | 'expiry_date' | 'last_used' | 'name';
type StatusFilter = 'all' | 'unopened' | 'in_use' | 'finished';
type CategoryType = ProductCategory | 'all' | 'MAKEUP';

interface ProductsContextType {
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<CategoryType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('purchase_date');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resetFilters = useCallback(() => {
    setCategory('all');
    setSortBy('purchase_date');
    setStatusFilter('all');
    setSearchQuery('');
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        category,
        setCategory,
        sortBy,
        setSortBy,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        resetFilters,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
} 