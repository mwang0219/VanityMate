import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useProducts } from '@/contexts/ProductsContext';
import { ProductCard } from '@/components/products/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import { UserProduct } from '@/types/products';
import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export function ProductList() {
  const { user } = useAuthContext();
  const { category, sortBy, statusFilter, searchQuery } = useProducts();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (isRefreshing = false) => {
    try {
      if (!user) {
        throw new Error('用户未登录');
      }

      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);

      let query = supabase
        .from('user_products')
        .select(`
          *,
          product:products!inner (
            id,
            name,
            brand,
            category_id,
            subcategory_id,
            description,
            image_url,
            pao,
            created_at
          )
        `)
        .eq('user_id', user.id);

      // 应用分类筛选
      if (category === 'MAKEUP') {
        // 如果是彩妆类别，筛选所有相关子类别
        query = query.in('product.category_id', ['BASE', 'EYE', 'LIP']);
      } else if (category !== 'all') {
        // 其他类别保持不变
        query = query.eq('product.category_id', category);
      }

      // 应用状态筛选
      if (statusFilter !== 'all') {
        const statusMap = {
          unopened: 1,
          in_use: 2,
          finished: 3,
        };
        query = query.eq('status', statusMap[statusFilter]);
      }

      // 应用排序
      switch (sortBy) {
        case 'purchase_date':
          query = query.order('purchase_date', { ascending: false });
          break;
        case 'expiry_date':
          query = query.order('expiry_date', { ascending: true });
          break;
        case 'last_used':
          query = query.order('last_used_at', { ascending: false });
          break;
        case 'name':
          query = query.order('product(name)', { ascending: true });
          break;
      }

      // 应用搜索
      if (searchQuery) {
        query = query.textSearch('product.name', searchQuery);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      return data as UserProduct[];
    } catch (err) {
      throw err;
    }
  }, [user, category, sortBy, statusFilter, searchQuery]);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        if (mounted) {
          setProducts(data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : '获取产品列表失败');
          console.error('获取产品列表错误:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchProducts(true);
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '刷新产品列表失败');
    } finally {
      setRefreshing(false);
    }
  }, [fetchProducts]);

  const handleProductPress = useCallback((productId: string) => {
    router.push(`/product/${productId}`);
  }, []);

  const handleToggleFavorite = useCallback(async (productId: string) => {
    try {
      if (!user) return;

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const { error: updateError } = await supabase
        .from('user_products')
        .update({ 
          is_favorite: !product.is_favorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (updateError) throw updateError;
      
      // 只更新特定产品的状态，而不是重新获取所有数据
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productId 
            ? { ...p, is_favorite: !p.is_favorite }
            : p
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新收藏状态失败');
    }
  }, [user, products]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>
          暂无产品，快去添加吧！
        </ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          userProduct={item}
          onPress={() => handleProductPress(item.id)}
          onFavoritePress={() => handleToggleFavorite(item.id)}
          showLastUsed
        />
      )}
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#FF6B6B']}
          tintColor="#FF6B6B"
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
}); 