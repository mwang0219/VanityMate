import { View, SafeAreaView, StatusBar } from 'react-native';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemedText } from '@/components/ThemedText';

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ marginBottom: 32 }}>
            <ThemedText type="title" style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
              VanityMate
            </ThemedText>
            <ThemedText style={{ fontSize: 16, textAlign: 'center', color: '#666666' }}>
              您的智能美妆助手
            </ThemedText>
          </View>
          <LoginForm />
        </View>
      </View>
    </SafeAreaView>
  );
} 