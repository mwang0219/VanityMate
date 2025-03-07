import { View, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#FEE5E5', '#FFD4D4', '#FFC0C0']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LoginForm />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
}); 