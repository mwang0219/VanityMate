import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <SupabaseConnectionTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
}); 