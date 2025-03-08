import { useState, useEffect, useCallback } from 'react';
import { ProductRepository } from '../lib/supabase/repositories/products';
import { Product } from '../lib/supabase/types';
import { SupabaseError } from '../lib/supabase/errors';

export function useProducts(userId: string, categoryId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const productRepo = new ProductRepository();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = categoryId 
        ? await productRepo.findByUserAndCategory(userId, categoryId)
        : await productRepo.findByUser(userId);
      
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [userId, categoryId]);

  const addProduct = async (productData: Partial<Product>) => {
    try {
      const newProduct = await productRepo.create({
        ...productData,
        user_id: userId
      });
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      throw err instanceof SupabaseError ? err : new Error('Failed to add product');
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const updated = await productRepo.update(id, data);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      throw err instanceof SupabaseError ? err : new Error('Failed to update product');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productRepo.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw err instanceof SupabaseError ? err : new Error('Failed to delete product');
    }
  };

  const updateProductStatus = async (id: string, status: Product['status']) => {
    try {
      const updated = await productRepo.updateStatus(id, status);
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (err) {
      throw err instanceof SupabaseError ? err : new Error('Failed to update product status');
    }
  };

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refresh: loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus
  };
} 