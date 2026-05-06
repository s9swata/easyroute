import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';

// Development-only mock OTPs. Never ship to production.
// Set EXPO_PUBLIC_USE_MOCK_OTP=true in .env.development only.
const USE_MOCK_OTP = process.env.EXPO_PUBLIC_USE_MOCK_OTP === 'true';
const MOCK_LOGIN_CODE = ['4', '8', '2', '7'];
const MOCK_LOGOUT_CODE = ['9', '1', '6', '3'];

function useTripOTP(mode: string): string[] {
  // TODO: replace with real API call — GET /api/trip/current/otp?mode=login|logout
  if (USE_MOCK_OTP) {
    return mode === 'login' ? MOCK_LOGIN_CODE : MOCK_LOGOUT_CODE;
  }
  return ['—', '—', '—', '—'];
}

export default function OTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode = 'login' } = useLocalSearchParams<{ mode: string }>();
  const isLogin = mode === 'login';
  const code = useTripOTP(mode);
  const bg = isLogin ? T.ink : T.brand;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chev" size={16} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>{isLogin ? 'Trip start' : 'Trip end'}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Badge */}
      <View style={styles.center}>
        <View style={styles.badge}>
          <Icon name={isLogin ? 'lock' : 'check'} size={14} color="#fff" />
          <Text style={styles.badgeText}>{isLogin ? 'LOGIN OTP' : 'LOGOUT OTP'}</Text>
        </View>

        <Text style={styles.instruction}>
          {isLogin ? 'Read this to your driver' : 'Ask driver for this pin'}
        </Text>
        <Text style={styles.subInstruction}>
          {isLogin
            ? 'The driver will enter this pin in their app to start the trip.'
            : 'Once you reach your drop, the driver will share this pin to complete the trip.'}
        </Text>
      </View>

      {/* Giant digits */}
      <View style={styles.digitsRow}>
        {code.map((n, i) => (
          <View key={i} style={styles.digitBox}>
            <Text style={styles.digit}>{n}</Text>
          </View>
        ))}
      </View>

      {/* Trip info */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <View style={styles.tripInfo}>
          <Icon name="car" size={22} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.tripInfoTitle}>Innova · KA-01-HG-4821</Text>
            <Text style={styles.tripInfoSub}>Ramesh Kumar · Trip HLX-284-0422</Text>
          </View>
        </View>
      </View>

      {/* Safety note */}
      <View style={[styles.safetyNote, { marginBottom: insets.bottom + 16 }]}>
        <Icon name="info" size={18} color={isLogin ? T.ink : T.brand} />
        <Text style={styles.safetyText}>
          {isLogin
            ? 'Never share your OTP before boarding. Verify the plate number first.'
            : "Only share once you've reached your drop. Confirm odometer if prompted."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  headerTitle: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  center: { paddingHorizontal: 24, alignItems: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 100,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#fff', letterSpacing: 0.3 },
  instruction: {
    fontSize: 30, fontWeight: '700', letterSpacing: -0.7, color: '#fff',
    textAlign: 'center', marginTop: 20, lineHeight: 36,
  },
  subInstruction: {
    fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center',
    marginTop: 8, lineHeight: 20, maxWidth: 300,
  },
  digitsRow: {
    flexDirection: 'row', gap: 14, paddingHorizontal: 20,
    justifyContent: 'center', flex: 1, alignItems: 'center',
  },
  digitBox: {
    width: 72, height: 96, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  digit: {
    fontSize: 56, fontWeight: '700', letterSpacing: -2, color: '#fff',
  },
  tripInfo: {
    padding: 14, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  tripInfoTitle: { fontSize: 13, fontWeight: '600', color: '#fff' },
  tripInfoSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  safetyNote: {
    marginHorizontal: 16, padding: 14, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16,
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
  },
  safetyText: { flex: 1, fontSize: 12, color: T.textSub, lineHeight: 18 },
});
