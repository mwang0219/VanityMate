import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { UserProduct } from '@/types/products';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ProductCardProps {
  userProduct: UserProduct;
  onPress?: () => void;
  onFavoritePress?: () => void;
  showLastUsed?: boolean;
}

export function ProductCard({ 
  userProduct, 
  onPress, 
  onFavoritePress,
  showLastUsed = false,
}: ProductCardProps) {
  const colorScheme = useColorScheme();
  const { product } = userProduct;

  if (!product) {
    console.warn('[ProductCard] Product is null for userProduct:', userProduct);
    return null;
  }

  const lastUsedText = userProduct.last_used_at
    ? `上次使用: ${formatDistanceToNow(new Date(userProduct.last_used_at), { 
        addSuffix: true,
        locale: zhCN,
      })}`
    : '尚未使用';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <BlurView
        intensity={80}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.content}
      >
        <Image
          source={{ uri: product.image_url || 'https://via.placeholder.com/80' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <View style={styles.header}>
            <ThemedText style={styles.brand}>{product.brand}</ThemedText>
            {onFavoritePress && (
              <TouchableOpacity onPress={onFavoritePress} style={styles.favoriteButton}>
                <FontAwesome
                  name={userProduct.is_favorite ? 'heart' : 'heart-o'}
                  size={20}
                  color="#FF6B6B"
                />
              </TouchableOpacity>
            )}
          </View>
          <ThemedText style={styles.name}>{product.name}</ThemedText>
          {showLastUsed && (
            <ThemedText style={styles.lastUsed}>{lastUsedText}</ThemedText>
          )}
          {userProduct.expiry_date && (
            <View style={styles.expirationContainer}>
              <FontAwesome name="clock-o" size={14} color="#FF6B6B" />
              <ThemedText style={styles.expiration}>
                到期: {new Date(userProduct.expiry_date).toLocaleDateString()}
              </ThemedText>
            </View>
          )}
          {userProduct.status === 2 && (
            <View style={styles.statusContainer}>
              <FontAwesome name="check-circle" size={14} color="#4CAF50" />
              <ThemedText style={styles.status}>使用中</ThemedText>
            </View>
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: 14,
    opacity: 0.8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  lastUsed: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  expiration: {
    fontSize: 12,
    opacity: 0.6,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    marginLeft: 4,
    color: '#4CAF50',
  },
  favoriteButton: {
    padding: 4,
  },
}); 