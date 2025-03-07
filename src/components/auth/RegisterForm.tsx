import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { signUp } = useAuthContext();

  const handleRegister = async () => {
    if (!username.trim()) {
      setErrorMessage('请输入用户名');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('请输入邮箱');
      return;
    }
    if (!password) {
      setErrorMessage('请输入密码');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('密码长度至少为6位');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('两次输入的密码不一致');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await signUp(email, password, username);
      router.replace('/');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('注册失败，请稍后重试');
      }
      console.error('注册错误:', error);
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
        placeholder="👤 用户名"
        placeholderTextColor="#666666"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!isLoading}
      />

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

      <TextInput
        style={styles.input}
        placeholder="🔒 确认密码"
        placeholderTextColor="#666666"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>注册</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/login')}
        disabled={isLoading}
        style={styles.linkContainer}
      >
        <Text style={styles.link}>已有账号？立即登录</Text>
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