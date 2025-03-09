import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useProducts } from '@/contexts/ProductsContext';
import { ProductCard } from '@/components/products/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { UserProduct } from '@/types/products';

export function ProductList() {
  const { filteredProducts: products, isLoading, error, selectedCategory, refreshProducts } = useProducts();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  }, [refreshProducts]);

  const handleProductPress = useCallback((productId: string) => {
    router.push(`/product/${productId}`);
  }, []);

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>{error.message}</ThemedText>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>
          {selectedCategory ? '该分类下暂无产品' : '暂无产品，快去添加吧！'}
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
          userProduct={item as UserProduct}
          onPress={() => handleProductPress(item.id)}
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