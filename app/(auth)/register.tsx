import { View, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
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
        <RegisterForm />
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