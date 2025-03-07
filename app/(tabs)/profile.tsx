import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { PageHeader } from '@/components/PageHeader';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PageHeader 
        variant="profile"
        username="Sarah"
        signature="分享美丽，热爱生活 ✨"
      />
      <ThemedText style={styles.text}>个人中心 - 开发中</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
  },
}); 