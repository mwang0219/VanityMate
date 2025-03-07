import { Redirect } from 'expo-router';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuthContext();

  // 如果正在加载，返回 null
  if (loading) return null;

  // 如果用户已登录，重定向到主页面
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // 如果用户未登录，重定向到登录页面
  return <Redirect href="/(auth)/login" />;
} 