import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PageHeader } from '@/components/PageHeader';

export default function VanityTableScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PageHeader 
        title="我的美妆桌" 
        subtitle="共收录28件产品" 
      />
      <View style={styles.content}>
        {/* 这里可以添加新的内容 */}
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
    padding: 20,
  }
}); 