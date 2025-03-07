import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { cn } from '@/lib/utils';

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
    <View className="w-full space-y-4">
      {errorMessage ? (
        <View className="bg-red-50 p-3 rounded-lg">
          <Text className="text-red-500 text-sm">{errorMessage}</Text>
        </View>
      ) : null}
      
      <View className="space-y-2">
        <Text className="text-gray-700 text-sm font-medium">邮箱</Text>
        <TextInput
          className="w-full h-12 px-4 border border-gray-300 rounded-lg"
          placeholder="请输入邮箱"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
      </View>

      <View className="space-y-2">
        <Text className="text-gray-700 text-sm font-medium">密码</Text>
        <TextInput
          className="w-full h-12 px-4 border border-gray-300 rounded-lg"
          placeholder="请输入密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        className={cn(
          "w-full h-12 rounded-lg flex items-center justify-center",
          isLoading ? "bg-blue-400" : "bg-blue-500 active:bg-blue-600"
        )}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-medium">登录</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/register')}
        disabled={isLoading}
        className="mt-4"
      >
        <Text className="text-blue-500 text-center">还没有账号？立即注册</Text>
      </TouchableOpacity>
    </View>
  );
} 