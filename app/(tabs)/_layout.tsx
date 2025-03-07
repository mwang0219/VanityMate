import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuthContext } from '@/contexts/AuthContext';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
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
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <BlurView
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: { borderTopWidth: 0 },
      }}>
      <Tabs.Screen
        name="market"
        options={{
          title: '商场',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="vanity-table"
        options={{
          title: '美妆桌',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
