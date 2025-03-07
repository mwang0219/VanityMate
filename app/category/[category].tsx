import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ProductCard } from '@/components/products/ProductCard';
import { supabase } from '@/lib/supabase';
import { UserProduct, ProductCategory } from '@/types/products';
import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';

const CATEGORY_TITLES = {
  [ProductCategory.EYE]: '眼部彩妆',
  [ProductCategory.BASE]: '底妆',
  [ProductCategory.SKINCARE]: '护肤',
  [ProductCategory.LIP]: '唇妆',
};

export default function CategoryScreen() {
  const { category } = useLocalSearchParams();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error('用户未登录');
      }

      const { data, error: fetchError } = await supabase
        .from('user_products')
        .select(`
          *,
          product:product_products(*)
        `)
        .eq('user_id', user.id)
        .eq('product.category', category);

      if (fetchError) throw fetchError;
      setProducts(data as UserProduct[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取产品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      if (!user) return;

      const product = products.find(p => p.productId === productId);
      if (!product) return;

      const { error: updateError } = await supabase
        .from('user_products')
        .update({ 
          is_favorite: !product.isFavorite,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (updateError) throw updateError;
      await fetchCategoryProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新收藏状态失败');
    }
  };

  const renderItem = ({ item }: { item: UserProduct }) => (
    <ProductCard
      userProduct={item}
      onPress={() => handleProductPress(item.productId)}
      onFavoritePress={() => handleToggleFavorite(item.productId)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          {CATEGORY_TITLES[category as ProductCategory] || '全部产品'}
        </ThemedText>
        <ThemedText style={styles.count}>
          共 {products.length} 件产品
        </ThemedText>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            暂无产品，快去添加吧！
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    opacity: 0.6,
  },
  listContent: {
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
}); 