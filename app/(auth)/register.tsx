import { View, SafeAreaView, StatusBar } from 'react-native';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ThemedText } from '@/components/ThemedText';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ marginBottom: 32 }}>
            <ThemedText type="title" style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
              加入 VanityMate
            </ThemedText>
            <ThemedText style={{ fontSize: 16, textAlign: 'center', color: '#666666' }}>
              开启您的美妆之旅
            </ThemedText>
          </View>
          <RegisterForm />
        </View>
      </View>
    </SafeAreaView>
  );
} 