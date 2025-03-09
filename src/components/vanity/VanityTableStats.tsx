import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PageHeader } from '@/components/PageHeader';
import { CategoryCard } from '@/components/vanity/CategoryCard';
import { AllProductsCard } from '@/components/vanity/AllProductsCard';
import { router } from 'expo-router';
import { ProductCategory } from '@/types/products';
import { useVanityTableStats } from '@/hooks/vanity/useVanityTableStats';

export function VanityTableStats() {
  const { categories, totalProducts } = useVanityTableStats();

  const handleCategoryPress = (categoryId: string) => {
    if (categoryId === 'MAKEUP') {
      router.push({
        pathname: '/products',
        params: { 
          category: 'MAKEUP',
          subCategories: JSON.stringify([ProductCategory.BASE, ProductCategory.EYE, ProductCategory.LIP])
        }
      });
    } else {
      router.push({
        pathname: '/products',
        params: { category: categoryId }
      });
    }
  };

  const handleAllProductsPress = () => {
    router.push({
      pathname: '/products',
      params: { category: 'all' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader 
        title="我的美妆桌" 
        subtitle={`共收录${totalProducts}件产品`} 
      />
      <View style={styles.content}>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              count={category.count}
              colors={category.colors}
              icon={category.icon}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </View>
        <AllProductsCard
          count={totalProducts}
          onPress={handleAllProductsPress}
        />
      </View>
    </SafeAreaView>
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
}); 