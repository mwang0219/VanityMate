import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase/client';

export const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // 尝试从 products 表中获取一条记录
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

      if (error) {
        throw error;
      }

      console.log('Supabase connection test result:', { data });
      setStatus('success');
    } catch (error) {
      console.error('Supabase connection error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '未知错误');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase 连接测试</Text>
      {status === 'testing' && (
        <Text style={styles.testing}>正在测试连接...</Text>
      )}
      {status === 'success' && (
        <Text style={styles.success}>连接成功！✅</Text>
      )}
      {status === 'error' && (
        <View>
          <Text style={styles.error}>连接失败 ❌</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  testing: {
    color: '#666',
  },
  success: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  error: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#f44336',
    marginTop: 5,
    fontSize: 12,
  },
}); 