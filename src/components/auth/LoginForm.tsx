import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { signIn } = useAuthContext();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('请填写邮箱和密码');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await signIn(email, password);
      router.replace('/');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('登录失败，请稍后重试');
      }
      console.error('登录错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}
      
      <TextInput
        style={styles.input}
        placeholder="📧 邮箱"
        placeholderTextColor="#666666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="🔒 密码"
        placeholderTextColor="#666666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>登录</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/register')}
        disabled={isLoading}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>还没有账号？立即注册</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
    height: 48,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  linkContainer: {
    marginTop: 16,
  },
  link: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontSize: 16,
  },
}); 