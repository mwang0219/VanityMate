import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BaseHeaderProps {
  variant?: 'default' | 'profile';
}

interface DefaultHeaderProps extends BaseHeaderProps {
  variant?: 'default';
  title: string;
  subtitle?: string;
}

interface ProfileHeaderProps extends BaseHeaderProps {
  variant: 'profile';
  username: string;
  signature?: string;
}

type PageHeaderProps = DefaultHeaderProps | ProfileHeaderProps;

export function PageHeader(props: PageHeaderProps) {
  return (
    <LinearGradient
      colors={['#FF9A9E', '#FAD0C4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}>
      {props.variant === 'profile' ? (
        <View style={styles.profileContainer}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{props.username}</Text>
            {props.signature && (
              <Text style={styles.profileSignature}>{props.signature}</Text>
            )}
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.title}>{props.title}</Text>
          {props.subtitle && <Text style={styles.subtitle}>{props.subtitle}</Text>}
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f8f9fa',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileSignature: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
}); 