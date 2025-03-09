import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { TestResult } from '@/types/test';

export default function ScanScreen() {


  return (
    <ScrollView style={styles.container}>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  testControls: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonSpacer: {
    width: 10,
  },
  results: {
    padding: 10,
  },
}); 