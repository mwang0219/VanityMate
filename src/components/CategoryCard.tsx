import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

type CategoryCardProps = {
  name: string;
  count: number;
  colors: string[];
  icon: string;
  onPress?: () => void;
}

export function CategoryCard({ name, count, colors, icon, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.categoryItem}
      >
        <View style={styles.bubbleTopRight} />
        <View style={styles.bubbleBottomLeft} />
        
        <View style={styles.categoryIcon}>
          <MaterialIcons name={icon as any} size={32} color="white" />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{name}</Text>
          <View style={styles.categoryCount}>
            <Text style={styles.categoryCountText}>{count}件产品</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    width: (375 - 42) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bubbleTopRight: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bubbleBottomLeft: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  categoryInfo: {
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  categoryCount: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  categoryCountText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
}); 