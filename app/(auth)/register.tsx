import { View, SafeAreaView, StatusBar } from 'react-native';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  return (
    <LinearGradient
      colors={['#FEE5E5', '#FFD4D4', '#FFC0C0']}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FEE5E5" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ marginBottom: 32 }}>
              <ThemedText type="title" style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#FF6B6B' }}>
                加入 VanityMate
              </ThemedText>
              <ThemedText style={{ fontSize: 18, textAlign: 'center', color: '#666666' }}>
                开启您的美妆之旅
              </ThemedText>
            </View>
            <RegisterForm />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
} 