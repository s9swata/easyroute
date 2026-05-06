import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { StaticMap } from '@/components/static-map';

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleCallPress() {
    /* TODO: replace with actual driver phone from trip state */
    Linking.openURL('tel:+919876543210');
  }

  function handleShieldPress() {
    router.push('/sos');
  }

  function handleRecenterPress() {
    /* TODO: call mapRef.current?.animateToRegion(...) to recenter map */
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Full-bleed map */}
      <View style={StyleSheet.absoluteFillObject}>
        <StaticMap height={900} />
      </View>

      {/* Top controls */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.mapBtn, styles.mapBtnBack]}>
          <Icon name="chev" size={16} color={T.text} />
        </Pressable>
        <View style={styles.etaPill}>
          <View style={styles.etaDot} />
          <Text style={styles.etaText}>Driver 8 min away</Text>
        </View>
        <Pressable style={styles.mapBtn} onPress={handleShieldPress} accessibilityRole="button" accessibilityLabel="SOS safety">
          <Icon name="shield" size={18} color={T.danger} />
        </Pressable>
      </View>

      {/* Right: recenter */}
      <View style={[styles.rightStack, { top: insets.top + 90 }]}>
        <Pressable style={styles.mapBtn} onPress={handleRecenterPress} accessibilityRole="button" accessibilityLabel="Recenter map">
          <Icon name="pin" size={18} color={T.brand} />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.handle} />

        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverInitials}>RK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.driverName}>Ramesh Kumar</Text>
              <Text style={styles.driverRating}>· 4.9 ★</Text>
            </View>
            <Text style={styles.driverPlate}>Toyota Innova · KA-01-HG-4821</Text>
          </View>
          <Pressable style={styles.callBtn} onPress={handleCallPress} accessibilityRole="button" accessibilityLabel="Call driver">
            <Icon name="phone" size={20} color={T.brand} />
          </Pressable>
        </View>

        {/* OTP row */}
        <View style={styles.otpGrid}>
          <Pressable onPress={() => router.push('/otp/login')} style={styles.loginOtp}>
            <Text style={styles.otpTitle}>LOGIN OTP</Text>
            <View style={styles.otpDigits}>
              {['4', '8', '2', '7'].map((n, i) => (
                <Text key={i} style={styles.otpDigit}>{n}</Text>
              ))}
            </View>
            <Text style={styles.otpHint}>Share when driver arrives</Text>
          </Pressable>
          <View style={styles.logoutOtp}>
            <Text style={styles.otpTitleMuted}>LOGOUT OTP</Text>
            <View style={styles.otpDigits}>
              {['•', '•', '•', '•'].map((n, i) => (
                <Text key={i} style={[styles.otpDigit, { color: T.textMute }]}>{n}</Text>
              ))}
            </View>
            <Text style={styles.otpHintMuted}>Unlocks after boarding</Text>
          </View>
        </View>

        <Btn variant="dark" size="lg" icon="lock" full onPress={() => router.push('/otp/login')}>
          Show login OTP to driver
        </Btn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute', left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    zIndex: 2,
  },
  mapBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  mapBtnBack: {
    transform: [{ rotate: '180deg' }],
  },
  etaPill: {
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  etaDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.success },
  etaText: { fontSize: 13, fontWeight: '600', color: T.text },
  rightStack: { position: 'absolute', right: 16, zIndex: 2, gap: 8 },

  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopLeftRadius: 26, borderTopRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    padding: 16, zIndex: 3,
  },
  handle: { width: 36, height: 5, borderRadius: 3, backgroundColor: T.line, alignSelf: 'center', marginBottom: 14 },

  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  driverAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  driverInitials: { color: '#fff', fontWeight: '700', fontSize: 16 },
  driverName: { fontSize: 16, fontWeight: '700', color: T.text },
  driverRating: { fontSize: 12, color: T.textSub },
  driverPlate: { fontSize: 12, color: T.textSub, marginTop: 1 },
  callBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
  },

  otpGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  loginOtp: {
    flex: 1, padding: 12, borderRadius: 14, backgroundColor: T.ink,
  },
  logoutOtp: {
    flex: 1, padding: 12, borderRadius: 14, backgroundColor: T.cardAlt,
    borderWidth: 1, borderColor: T.line, borderStyle: 'dashed',
  },
  otpTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4, color: 'rgba(255,255,255,0.6)' },
  otpTitleMuted: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4, color: T.textMute },
  otpDigits: { flexDirection: 'row', gap: 6, marginTop: 8 },
  otpDigit: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: -0.5, fontVariant: ['tabular-nums'] },
  otpHint: { fontSize: 10.5, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  otpHintMuted: { fontSize: 10.5, color: T.textMute, marginTop: 4 },
});
