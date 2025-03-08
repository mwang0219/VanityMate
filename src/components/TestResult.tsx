import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TestResult as TestResultType } from '@/types/test';

type Props = {
  result: TestResultType;
};

export const TestResult: React.FC<Props> = ({ result }) => {
  return (
    <View style={[styles.container, result.success ? styles.success : styles.error]}>
      <Text style={styles.message}>{result.message}</Text>
      {result.error && (
        <Text style={styles.errorText}>错误: {result.error.message}</Text>
      )}
      {result.data && (
        <Text style={styles.data}>
          数据: {JSON.stringify(result.data, null, 2)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  success: {
    backgroundColor: '#e6ffe6',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#ffe6e6',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#f44336',
    marginTop: 5,
  },
  data: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
}); 