import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';
import { TestResult as TestResultComponent } from '@/components/TestResult';
import { getProductTests } from '@/utils/product-tests';
import { TestResult } from '@/types/test';

export default function ScanScreen() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const productTests = getProductTests();

  const runAllTests = async () => {
    setTestResults([]); // 清空之前的测试结果
    for (const test of productTests) {
      const result = await test.run();
      setTestResults(prev => [...prev, result]);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <SupabaseConnectionTest />
      
      <View style={styles.testControls}>
        <Button title="运行所有测试" onPress={runAllTests} />
        <View style={styles.buttonSpacer} />
        <Button title="清除结果" onPress={clearResults} />
      </View>

      <View style={styles.results}>
        {testResults.map((result, index) => (
          <TestResultComponent key={index} result={result} />
        ))}
      </View>
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