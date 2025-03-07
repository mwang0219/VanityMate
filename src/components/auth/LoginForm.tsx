import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('请输入邮箱和密码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      // 等待用户状态初始化
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Text style={styles.logoTitle}>VanityMate</Text>
        <Text style={styles.logoSubtitle}>您的智能美妆助手</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#999999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="邮箱"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#999999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="密码"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={16} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>登录</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>还没有账号？立即注册</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 100,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#333333',
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerText: {
    color: '#666666',
    fontSize: 14,
  },
}); 