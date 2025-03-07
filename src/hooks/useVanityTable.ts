import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, UserProduct } from '@/types/products';
import { useAuthContext } from '@/contexts/AuthContext';

export function useVanityTable() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentProducts, setRecentProducts] = useState<UserProduct[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<UserProduct[]>([]);

  // 获取用户的产品数据
  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('用户未登录');
      }

      // 获取最近使用的产品
      const { data: recentData, error: recentError } = await supabase
        .from('user_products')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // 获取收藏的产品
      const { data: favoriteData, error: favoriteError } = await supabase
        .from('user_products')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .order('updated_at', { ascending: false });

      if (favoriteError) throw favoriteError;

      setRecentProducts(recentData as UserProduct[]);
      setFavoriteProducts(favoriteData as UserProduct[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 标记产品为最近使用
  const markAsUsed = async (productId: string) => {
    try {
      if (!user) throw new Error('用户未登录');

      const { error } = await supabase
        .from('user_products')
        .update({ 
          last_used_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      // 重新获取数据
      await fetchUserProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败');
    }
  };

  // 切换收藏状态
  const toggleFavorite = async (productId: string) => {
    try {
      if (!user) throw new Error('用户未登录');

      // 获取当前收藏状态
      const { data, error: fetchError } = await supabase
        .from('user_products')
        .select('is_favorite')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (fetchError) throw fetchError;

      // 更新收藏状态
      const { error: updateError } = await supabase
        .from('user_products')
        .update({ 
          is_favorite: !data.is_favorite,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (updateError) throw updateError;

      // 重新获取数据
      await fetchUserProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败');
    }
  };

  // 初始加载数据
  useEffect(() => {
    if (user) {
      fetchUserProducts();
    }
  }, [user]);

  return {
    loading,
    error,
    recentProducts,
    favoriteProducts,
    markAsUsed,
    toggleFavorite,
    refresh: fetchUserProducts,
  };
} 