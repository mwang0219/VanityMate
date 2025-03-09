import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { ProductList } from '@/components/products/ProductList';
import { useLocalSearchParams } from 'expo-router';
import { ProductCategory } from '@/types/products';
import { useProducts } from '@/contexts/ProductsContext';
import { useEffect } from 'react';

export default function ProductsScreen() {
  const { category } = useLocalSearchParams<{ category: ProductCategory | 'MAKEUP' }>();
  const { setFilterOptions } = useProducts();

  // 当 category 改变时更新过滤器
  useEffect(() => {
    // 确保 category 是有效值或 null
    const validCategory = category ? (category as ProductCategory | 'MAKEUP') : null;
    setFilterOptions({ category: validCategory });
  }, [category, setFilterOptions]);

  return (
    <>
      <Stack.Screen
        options={{
          title: '我的产品',
          headerShadowVisible: false,
        }}
      />
      <View style={{ flex: 1 }}>
        <ProductList />
      </View>
    </>
  );
} 