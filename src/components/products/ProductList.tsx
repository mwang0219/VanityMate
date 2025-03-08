import React, { useEffect, useState } from 'react';
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

  const fetchProducts = async (isRefreshing = false) => {
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
      if (category !== 'all') {
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

      // 验证数据完整性（现在应该不会有无效数据了）
      const validProducts = (data as UserProduct[]);

      setProducts(validProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取产品列表失败');
      console.error('获取产品列表错误:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      await fetchProducts();
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [category, sortBy, statusFilter, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(true);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleToggleFavorite = async (productId: string) => {
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
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新收藏状态失败');
    }
  };

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
        item.product ? (
          <ProductCard
            userProduct={item}
            onPress={() => handleProductPress(item.id)}
            onFavoritePress={() => handleToggleFavorite(item.id)}
            showLastUsed
          />
        ) : null
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