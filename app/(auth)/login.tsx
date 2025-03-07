import { View, Text, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
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
        <View style={styles.logoContainer}>
          <Text style={styles.title}>VanityMate</Text>
          <Text style={styles.subtitle}>您的智能美妆助手</Text>
        </View>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
}); 