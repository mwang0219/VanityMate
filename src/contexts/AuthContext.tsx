import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, error: authError } = useAuth();

  const handleAuthError = (error: AuthError) => {
    console.error('认证错误:', error);
    
    // 处理常见的 Supabase 错误
    switch (error.message) {
      case 'Invalid login credentials':
        throw new Error('邮箱或密码错误');
      case 'Email not confirmed':
        throw new Error('请先验证邮箱');
      case 'Invalid email':
        throw new Error('邮箱格式不正确');
      case 'Incorrect password':
        throw new Error('密码错误');
      case 'Email already registered':
        throw new Error('该邮箱已注册');
      default:
        if (error.message.includes('Password')) {
          throw new Error('密码不符合要求：至少6位');
        }
        throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('尝试登录:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        handleAuthError(error);
      }
      
      console.log('登录成功:', email);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log('尝试注册:', email);
      
      // 1. 检查用户是否已存在
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 是"没有找到记录"的错误
        console.error('检查用户存在性错误:', checkError);
        throw checkError;
      }

      if (existingUser) {
        throw new Error('该邮箱已注册，请直接登录');
      }

      // 2. 注册新用户
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) {
        handleAuthError(signUpError);
      }

      if (!authData.user) {
        throw new Error('注册成功但未返回用户数据');
      }

      console.log('用户注册成功，创建用户配置文件');

      // 3. 创建用户配置文件
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id,
          username, 
          email 
        }]);
      
      if (profileError) {
        console.error('创建用户配置文件错误:', profileError);
        // 如果创建配置文件失败，回滚注册
        await supabase.auth.signOut();
        throw new Error('创建用户配置文件失败');
      }

      console.log('注册完成:', email);
    } catch (error) {
      console.error('注册过程错误:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('尝试登出');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('登出成功');
    } catch (error) {
      console.error('登出失败:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error: authError, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 