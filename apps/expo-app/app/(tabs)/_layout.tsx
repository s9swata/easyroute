import { Tabs } from 'expo-router';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: T.brand,
        tabBarInactiveTintColor: T.textMute,
        tabBarStyle: {
          backgroundColor: T.tabBarBg,
          borderTopColor: T.line,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarIcon: ({ color }) => <Icon name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color }) => <Icon name="history" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
