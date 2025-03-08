import React, { useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { ProductFilter } from '@/components/products/ProductFilter';
import { ProductList } from '@/components/products/ProductList';
import { PageHeader } from '@/components/PageHeader';
import { useProducts } from '@/contexts/ProductsContext';
import { useLocalSearchParams, router } from 'expo-router';
import { ProductCategory } from '@/types/products';
import { MaterialIcons } from '@expo/vector-icons';

function ProductsContent() {
  const { category } = useLocalSearchParams<{ category: ProductCategory | 'all' }>();
  const { setCategory } = useProducts();

  useEffect(() => {
    if (category) {
      setCategory(category);
    }
  }, [category]);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader 
        title="我的产品" 
        subtitle="管理你的美妆产品"
        leftButton={{
          icon: <MaterialIcons name="arrow-back" size={24} color="#333" />,
          onPress: () => router.back(),
        }}
      />
      <ProductFilter />
      <View style={styles.content}>
        <ProductList />
      </View>
    </SafeAreaView>
  );
}

export default function ProductsScreen() {
  return (
    <ProductsProvider>
      <ProductsContent />
    </ProductsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
}); 