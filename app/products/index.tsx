import React from 'react';
import { Stack } from 'expo-router';
import { ProductList } from '@/components/products/ProductList';
import { useLocalSearchParams } from 'expo-router';
import { ProductCategory } from '@/types/products';

export default function ProductsScreen() {
  const { category } = useLocalSearchParams<{ category: ProductCategory | 'MAKEUP' }>();

  return (
    <>
      <Stack.Screen
        options={{
          title: '我的产品',
          headerShadowVisible: false,
        }}
      />
      <ProductList />
    </>
  );
} 