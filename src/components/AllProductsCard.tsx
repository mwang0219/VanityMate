import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

type AllProductsCardProps = {
  count: number;
  onPress?: () => void;
}

export function AllProductsCard({ count, onPress }: AllProductsCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={['#3D4E68', '#2D3A4F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.leftContent}>
          <BlurView intensity={20} tint="light" style={styles.iconContainer}>
            <MaterialIcons name="apps" size={32} color="white" />
          </BlurView>
          <View style={styles.textContainer}>
            <Text style={styles.title}>全部产品</Text>
            <BlurView intensity={20} tint="light" style={styles.countContainer}>
              <Text style={styles.count}>{count}件产品</Text>
            </BlurView>
          </View>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={26} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
    borderRadius: 20,
    overflow: 'hidden',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  textContainer: {
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  countContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  count: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
}); 