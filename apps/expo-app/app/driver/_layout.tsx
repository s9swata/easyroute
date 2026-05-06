import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';

export default function DriverLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: T.bg },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="otp-verify" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trip/active" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
