import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';

export default function RootLayout() {
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
        <Stack.Screen name="roster" options={{ presentation: 'modal' }} />
        <Stack.Screen name="adhoc" options={{ presentation: 'modal' }} />
        <Stack.Screen name="map" />
        <Stack.Screen name="otp/[mode]" />
        <Stack.Screen name="status/[variant]" />
        <Stack.Screen name="cancel-trip" options={{ presentation: 'modal' }} />
        <Stack.Screen name="rate-trip" options={{ presentation: 'modal' }} />
        <Stack.Screen name="sos" options={{ presentation: 'modal' }} />
        <Stack.Screen name="saved-locations" />
        <Stack.Screen name="tpin-settings" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="help" />
        <Stack.Screen name="sidebar" options={{ presentation: 'modal' }} />

        {/* Driver routes */}
        <Stack.Screen name="driver/login" />
        <Stack.Screen name="driver/otp-verify" />
        <Stack.Screen name="driver/(tabs)" />
        <Stack.Screen name="driver/trip/active" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
