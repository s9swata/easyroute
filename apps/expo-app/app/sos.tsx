import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

/* ------------------------------------------------------------------ */
//  Demo trip context — replace with real trip state in production
const TRIP_CONTEXT = {
  driverName: 'Ramesh Kumar',
  plate: 'KA-01-HG-4821',
  vehicle: 'Toyota Innova · White',
  lastLocation: 'Helix HQ, Gate 3 · Bellandur',
};

const SECURITY_HOTLINE = '+919876543210';
const EMERGENCY_CONTACT = '+919876543211';

/* ------------------------------------------------------------------ */

export default function SosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifiedAt] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  });

  /* Pulsing dot animation */
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, scaleAnim]);

  const handleCallSecurity = useCallback(() => {
    Linking.openURL(`tel:${SECURITY_HOTLINE}`);
  }, []);

  const handleCallEmergencyContact = useCallback(() => {
    Linking.openURL(`tel:${EMERGENCY_CONTACT}`);
  }, []);

  const handleDismiss = useCallback(() => {
    Alert.alert(
      'Dismiss emergency alert?',
      'Are you sure you want to dismiss the alert? Helix security will be notified that you marked yourself safe.',
      [
        { text: 'Keep alert active', style: 'cancel' },
        {
          text: 'I am safe',
          style: 'default',
          onPress: () => router.back(),
        },
      ],
      { cancelable: true }
    );
  }, [router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="chev" size={16} color="#fff" />
        </Pressable>
        <Text style={styles.topBarTitle}>Emergency</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status area */}
        <View style={styles.statusArea}>
          <View style={styles.dotWrapper}>
            <Animated.View
              style={[
                styles.dotRing,
                {
                  opacity: pulseAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />
            <View style={styles.dotCore} />
          </View>

          <Text style={styles.statusHeadline}>Alerting security…</Text>
          <Text style={styles.statusSub}>
            Your live location is being shared with Helix security and your emergency contact.
          </Text>

          <View style={styles.notifiedPill}>
            <Icon name="shield" size={14} color="#fff" />
            <Text style={styles.notifiedText}>
              Security notified at {notifiedAt}
            </Text>
          </View>
        </View>

        {/* Trip context card */}
        <Card padded={false} style={styles.tripCard}>
          <View style={styles.tripCardInner}>
            <View style={styles.tripIcon}>
              <Icon name="car" size={22} color={T.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripDriver}>{TRIP_CONTEXT.driverName}</Text>
              <Text style={styles.tripPlate}>{TRIP_CONTEXT.vehicle}</Text>
              <Text style={styles.tripPlate}>{TRIP_CONTEXT.plate}</Text>
            </View>
          </View>
          <View style={styles.locationRow}>
            <Icon name="pin" size={14} color={T.textMute} />
            <Text style={styles.locationText}>{TRIP_CONTEXT.lastLocation}</Text>
          </View>
        </Card>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleCallSecurity}
            style={styles.btnPrimary}
            accessibilityRole="button"
            accessibilityLabel="Call security hotline"
          >
            <Icon name="phone" size={20} color={T.danger} />
            <Text style={styles.btnPrimaryText}>Call security hotline</Text>
          </Pressable>

          <Pressable
            onPress={handleCallEmergencyContact}
            style={styles.btnSecondary}
            accessibilityRole="button"
            accessibilityLabel="Call emergency contact"
          >
            <Icon name="phone" size={20} color="#fff" />
            <Text style={styles.btnSecondaryText}>Call emergency contact</Text>
          </Pressable>

          <Pressable
            onPress={handleDismiss}
            style={styles.btnGhost}
            accessibilityRole="button"
            accessibilityLabel="Dismiss alert"
          >
            <Text style={styles.btnGhostText}>I am safe — dismiss alert</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.danger,
  },

  /* Top bar */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },

  /* Scroll content */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 24,
  },

  /* Status area */
  statusArea: {
    alignItems: 'center',
    paddingTop: 12,
    gap: 14,
  },
  dotWrapper: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotCore: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  statusHeadline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  statusSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  notifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.18)',
    marginTop: 4,
  },
  notifiedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },

  /* Trip card */
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: T.radiusLg,
    overflow: 'hidden',
  },
  tripCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    paddingBottom: 12,
  },
  tripIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: T.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripDriver: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
    letterSpacing: -0.2,
  },
  tripPlate: {
    fontSize: 13,
    color: T.textSub,
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  locationText: {
    fontSize: 13,
    color: T.textSub,
    flexShrink: 1,
  },

  /* Action buttons */
  actions: {
    gap: 12,
  },
  btnPrimary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: T.danger,
    letterSpacing: -0.2,
  },
  btnSecondary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  btnSecondaryText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.2,
  },
  btnGhost: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: -0.2,
  },
});
