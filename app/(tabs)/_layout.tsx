import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
  size?: number;
}) {
  return <MaterialIcons size={props.size || 24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { loading, user } = useAuthContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Tabs
      initialRouteName="vanity-table"
      screenOptions={{
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#999999',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          height: 49,
          backgroundColor: '#FFFFFF',
        },
        tabBarItemStyle: {
          height: 49,
          paddingTop: 0,
          paddingBottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '400',
          position: 'absolute',
          top: 0,
          bottom: 0,
          height: 49,
          lineHeight: 49,
          textAlignVertical: 'center',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="vanity-table"
        options={{
          title: '美妆桌',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={styles.scanButton}>
              <TabBarIcon 
                name="add"
                color="#FFFFFF"
                size={32}
              />
            </View>
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              style={styles.scanButtonContainer}
              onPress={() => {
                router.push('/(tabs)/scan');
              }}
            >
              {props.children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});
