import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useVanityTable } from '@/hooks/useVanityTable';
import { ProductCard } from '@/components/products/ProductCard';
import { router } from 'expo-router';
import { ProductCategory } from '@/types/products';
import { PageHeader } from '@/components/PageHeader';

export default function VanityTableScreen() {
  const colorScheme = useColorScheme();
  const { 
    loading, 
    error, 
    recentProducts, 
    favoriteProducts, 
    markAsUsed, 
    toggleFavorite 
  } = useVanityTable();

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleCategoryPress = (categoryId: number) => {
    router.push(`/category/${categoryId}`);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <PageHeader 
        title="我的美妆桌" 
        subtitle="共收录28件产品" 
      />
      <ScrollView style={styles.scrollView}>
        {/* 顶部欢迎区域 */}
        <View style={styles.header}>
          <ThemedText style={styles.welcomeText}>我的美妆桌</ThemedText>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <FontAwesome 
              name="cog" 
              size={24} 
              color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} 
            />
          </TouchableOpacity>
        </View>

        {/* 美妆产品分类区域 */}
        <View style={styles.categoriesContainer}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(ProductCategory.MAKEUP)}
          >
            <BlurView 
              intensity={80} 
              tint={colorScheme === 'dark' ? 'dark' : 'light'} 
              style={styles.categoryCardBlur}
            >
              <FontAwesome name="paint-brush" size={24} color="#FF6B6B" />
              <ThemedText style={styles.categoryText}>彩妆</ThemedText>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(ProductCategory.SKINCARE)}
          >
            <BlurView 
              intensity={80} 
              tint={colorScheme === 'dark' ? 'dark' : 'light'} 
              style={styles.categoryCardBlur}
            >
              <FontAwesome name="tint" size={24} color="#FF6B6B" />
              <ThemedText style={styles.categoryText}>护肤</ThemedText>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(ProductCategory.FRAGRANCE)}
          >
            <BlurView 
              intensity={80} 
              tint={colorScheme === 'dark' ? 'dark' : 'light'} 
              style={styles.categoryCardBlur}
            >
              <FontAwesome name="magic" size={24} color="#FF6B6B" />
              <ThemedText style={styles.categoryText}>香水</ThemedText>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(ProductCategory.TOOLS)}
          >
            <BlurView 
              intensity={80} 
              tint={colorScheme === 'dark' ? 'dark' : 'light'} 
              style={styles.categoryCardBlur}
            >
              <FontAwesome name="wrench" size={24} color="#FF6B6B" />
              <ThemedText style={styles.categoryText}>工具</ThemedText>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* 最近使用区域 */}
        <View style={styles.recentSection}>
          <ThemedText style={styles.sectionTitle}>最近使用</ThemedText>
          <View style={styles.recentItemsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF6B6B" />
            ) : error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : recentProducts.length === 0 ? (
              <ThemedText style={styles.emptyText}>暂无最近使用的产品</ThemedText>
            ) : (
              recentProducts.map((userProduct) => (
                <ProductCard
                  key={userProduct.id}
                  userProduct={userProduct}
                  onPress={() => handleProductPress(userProduct.product_id)}
                  onFavoritePress={() => toggleFavorite(userProduct.product_id)}
                  showLastUsed
                />
              ))
            )}
          </View>
        </View>

        {/* 收藏夹区域 */}
        <View style={styles.favoritesSection}>
          <ThemedText style={styles.sectionTitle}>收藏夹</ThemedText>
          <View style={styles.favoritesContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF6B6B" />
            ) : error ? (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            ) : favoriteProducts.length === 0 ? (
              <ThemedText style={styles.emptyText}>暂无收藏的产品</ThemedText>
            ) : (
              favoriteProducts.map((userProduct) => (
                <ProductCard
                  key={userProduct.id}
                  userProduct={userProduct}
                  onPress={() => handleProductPress(userProduct.product_id)}
                  onFavoritePress={() => toggleFavorite(userProduct.product_id)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* 添加新产品按钮 */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/product/add')}
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    aspectRatio: 1.5,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryCardBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  categoryText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recentItemsContainer: {
    minHeight: 100,
  },
  favoritesSection: {
    padding: 20,
  },
  favoritesContainer: {
    minHeight: 100,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 