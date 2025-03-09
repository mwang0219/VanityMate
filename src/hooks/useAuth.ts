import { useEffect, useState, useRef } from 'react';
import { supabase, User, Session } from '@/lib/supabase/client';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastEventRef = useRef<string | null>(null);

  useEffect(() => {
    // 获取当前会话
    const initAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('获取会话错误:', sessionError);
          setError(sessionError);
        }
        setSession(session);
      } catch (err) {
        console.error('初始化认证错误:', err);
        setError(err instanceof Error ? err : new Error('认证初始化失败'));
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 只在状态真正发生变化时才打印日志
      if (event !== lastEventRef.current) {
        if (event !== 'INITIAL_SESSION') {
          console.log('认证状态变化:', event, session?.user?.email);
        }
        lastEventRef.current = event;
      }
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('登录错误:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('登出错误:', error);
      throw error;
    }
  };

  return {
    session,
    loading,
    error,
    user: session?.user ?? null,
    signIn,
    signOut,
  };
} 