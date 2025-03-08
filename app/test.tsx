import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SupabaseConnectionTest } from '../src/components/SupabaseConnectionTest';

export default function TestPage() {
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