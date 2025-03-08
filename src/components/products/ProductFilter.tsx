import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useProducts } from '@/contexts/ProductsContext';

export function ProductFilter() {
  const { sortBy, setSortBy, statusFilter, setStatusFilter } = useProducts();

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* TODO: 实现排序选择 */}}
        >
          <MaterialIcons name="sort" size={20} color="#666" />
          <ThemedText style={styles.filterText}>
            {sortBy === 'purchase_date' ? '购入时间' :
             sortBy === 'expiry_date' ? '到期时间' :
             sortBy === 'last_used' ? '使用时间' : '名称'}
          </ThemedText>
          <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => {/* TODO: 实现状态筛选 */}}
        >
          <MaterialIcons name="filter-list" size={20} color="#666" />
          <ThemedText style={styles.filterText}>
            {statusFilter === 'all' ? '全部状态' :
             statusFilter === 'unopened' ? '未开封' :
             statusFilter === 'in_use' ? '使用中' : '已用完'}
          </ThemedText>
          <MaterialIcons name="arrow-drop-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
}); 