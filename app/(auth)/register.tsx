import { View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useAuthContext } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuthContext();

  const handleRegister = async () => {
    if (loading) return;
    
    try {
      // 基本验证
      if (!username.trim()) {
        throw new Error('请输入用户名');
      }
      if (!email.trim()) {
        throw new Error('请输入邮箱');
      }
      if (!password) {
        throw new Error('请输入密码');
      }
      if (password.length < 6) {
        throw new Error('密码长度至少为6位');
      }
      if (password !== confirmPassword) {
        throw new Error('两次输入的密码不一致');
      }
      
      setLoading(true);
      setError(null);
      
      await signUp(email, password, username);
    } catch (err) {
      console.error('注册错误:', err);
      if (err instanceof Error) {
        // 处理常见的 Supabase 错误消息
        const errorMessage = err.message;
        if (errorMessage.includes('User already registered')) {
          setError('该邮箱已注册，请直接登录或使用其他邮箱');
        } else if (errorMessage.includes('Email already registered')) {
          setError('该邮箱已被注册');
        } else if (errorMessage.includes('Invalid email')) {
          setError('邮箱格式不正确');
        } else if (errorMessage.includes('Password')) {
          setError('密码不符合要求：至少6位');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('注册失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <ThemedText type="title" style={styles.title}>加入 VanityMate</ThemedText>
        <ThemedText style={styles.subtitle}>开启您的美妆之旅</ThemedText>
        
        <TextInput
          style={styles.input}
          placeholder="👤 用户名"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="📧 邮箱"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="🔒 密码（至少6位）"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="🔒 确认密码"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        {error && (
          <ThemedText style={styles.error}>{error}</ThemedText>
        )}
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <ThemedText style={styles.buttonText}>
            {loading ? '注册中...' : '注册'}
          </ThemedText>
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkContainer}>
            <ThemedText style={styles.link}>已有账号？立即登录</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
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
    marginTop: 8,
  },
  linkContainer: {
    marginTop: 16,
  },
  link: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
}); 