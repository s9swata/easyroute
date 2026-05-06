import React, { useState, useRef, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Card } from '@/components/ui/card';

type FlowState = 'idle' | 'enter' | 'confirm' | 'success';

export default function TpinSettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [hasPin, setHasPin] = useState(true);
  const [flow, setFlow] = useState<FlowState>('idle');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const enterRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const startChange = useCallback(() => {
    setFlow('enter');
    setPin('');
    setConfirmPin('');
    setError('');
    setTimeout(() => enterRef.current?.focus(), 200);
  }, []);

  const startSet = useCallback(() => {
    setFlow('enter');
    setPin('');
    setConfirmPin('');
    setError('');
    setTimeout(() => enterRef.current?.focus(), 200);
  }, []);

  const handlePinChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/\D/g, '').slice(0, 4);
      setPin(cleaned);
      setError('');
      if (cleaned.length === 4) {
        setTimeout(() => {
          setFlow('confirm');
          setTimeout(() => confirmRef.current?.focus(), 200);
        }, 150);
      }
    },
    []
  );

  const handleConfirmChange = useCallback(
    (text: string) => {
      const cleaned = text.replace(/\D/g, '').slice(0, 4);
      setConfirmPin(cleaned);
      setError('');
      if (cleaned.length === 4) {
        if (cleaned === pin) {
          setFlow('success');
          setHasPin(true);
          Keyboard.dismiss();
        } else {
          setError('PINs do not match. Please try again.');
          setConfirmPin('');
        }
      }
    },
    [pin]
  );

  const resetFlow = useCallback(() => {
    setFlow('idle');
    setPin('');
    setConfirmPin('');
    setError('');
    Keyboard.dismiss();
  }, []);

  const removePin = useCallback(() => {
    setHasPin(false);
    setFlow('idle');
    setPin('');
    setConfirmPin('');
    setError('');
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chev" size={16} color={T.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Trip security</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      {/* Status card */}
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        {hasPin && flow !== 'success' ? (
          <Card>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIcon, { backgroundColor: T.successSoft }]}>
                <Icon name="check" size={20} color={T.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>Your T-PIN is active</Text>
                <Text style={styles.statusSub}>Protected with a 4-digit PIN</Text>
              </View>
            </View>
            <View style={styles.maskedRow}>
              <Text style={styles.maskedDots}>••••</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
              <Btn variant="primary" full onPress={startChange}>
                Change PIN
              </Btn>
              <Btn variant="outline" full onPress={removePin}>
                Remove
              </Btn>
            </View>
          </Card>
        ) : !hasPin && flow === 'idle' ? (
          <Card>
            <View style={styles.statusHeader}>
              <View style={[styles.statusIcon, { backgroundColor: T.warningSoft }]}>
                <Icon name="info" size={20} color={T.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusTitle}>Set up T-PIN</Text>
                <Text style={styles.statusSub}>
                  Add a 4-digit PIN to secure your trips
                </Text>
              </View>
            </View>
            <Btn variant="primary" full onPress={startSet} icon="lock">
              Set PIN
            </Btn>
          </Card>
        ) : flow === 'success' ? (
          <Card>
            <View style={styles.successCenter}>
              <View style={[styles.statusIconLarge, { backgroundColor: T.successSoft }]}>
                <Icon name="check" size={32} color={T.success} />
              </View>
              <Text style={styles.successTitle}>PIN updated</Text>
              <Text style={styles.successSub}>Your T-PIN has been changed successfully.</Text>
              <Btn variant="primary" full onPress={resetFlow} style={{ marginTop: 8 }}>
                Done
              </Btn>
            </View>
          </Card>
        ) : null}
      </View>

      {/* PIN entry flow */}
      {flow === 'enter' && (
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={styles.flowTitle}>Enter new PIN</Text>
          <Text style={styles.flowSub}>Choose a 4-digit code you will remember</Text>
          <Pressable onPress={() => enterRef.current?.focus()} style={styles.digitBoxRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.digitBox,
                  pin.length === i && styles.digitBoxActive,
                ]}
              >
                <Text style={styles.digitText}>
                  {pin[i] ? '•' : ''}
                </Text>
              </View>
            ))}
          </Pressable>
          <TextInput
            ref={enterRef}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.hiddenInput}
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Btn variant="ghost" size="sm" onPress={resetFlow} style={{ alignSelf: 'center', marginTop: 8 }}>
            Cancel
          </Btn>
        </View>
      )}

      {flow === 'confirm' && (
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={styles.flowTitle}>Confirm new PIN</Text>
          <Text style={styles.flowSub}>Re-enter the same 4-digit code</Text>
          <Pressable onPress={() => confirmRef.current?.focus()} style={styles.digitBoxRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.digitBox,
                  confirmPin.length === i && styles.digitBoxActive,
                ]}
              >
                <Text style={styles.digitText}>
                  {confirmPin[i] ? '•' : ''}
                </Text>
              </View>
            ))}
          </Pressable>
          <TextInput
            ref={confirmRef}
            value={confirmPin}
            onChangeText={handleConfirmChange}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.hiddenInput}
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Btn variant="ghost" size="sm" onPress={resetFlow} style={{ alignSelf: 'center', marginTop: 8 }}>
            Cancel
          </Btn>
        </View>
      )}

      {/* Security info */}
      <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
        <Text style={styles.sectionLabel}>SECURITY</Text>
        <Card>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <View style={[styles.statusIcon, { backgroundColor: T.brandSoft }]}>
              <Icon name="shield" size={18} color={T.brand} />
            </View>
            <Text style={styles.infoTitle}>Why T-PIN matters</Text>
          </View>
          <Text style={styles.infoBody}>
            Your T-PIN is required to start and end trips. Never share it with anyone except the verified driver after checking the plate number.
          </Text>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Always verify the vehicle plate before sharing your PIN.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Do not write the PIN down where others can see it.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Change your PIN immediately if you suspect someone knows it.</Text>
          </View>
          <View style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Report suspicious drivers through the SOS button.</Text>
          </View>
        </Card>
      </View>

      {/* Biometric toggle */}
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <Card>
          <Pressable
            onPress={() => setBiometricEnabled((v) => !v)}
            style={styles.toggleRow}
            accessibilityRole="switch"
            accessibilityState={{ checked: biometricEnabled }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Use Face ID / fingerprint instead</Text>
              <Text style={styles.toggleSub}>Skip typing your PIN when biometrics are available</Text>
            </View>
            <View
              style={[
                styles.toggleTrack,
                biometricEnabled && { backgroundColor: T.brand },
              ]}
            >
              <View
                style={[
                  styles.toggleKnob,
                  biometricEnabled && { transform: [{ translateX: 18 }] },
                ]}
              />
            </View>
          </Pressable>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '180deg' }],
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },

  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statusTitle: { fontSize: 16, fontWeight: '700', color: T.text, letterSpacing: -0.3 },
  statusSub: { fontSize: 13, color: T.textSub, marginTop: 1 },

  maskedRow: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 18, marginTop: 8,
    backgroundColor: T.cardAlt, borderRadius: T.radius,
  },
  maskedDots: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: 6, fontFamily: 'monospace' },

  successCenter: { alignItems: 'center', paddingVertical: 12 },
  statusIconLarge: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 18, fontWeight: '700', color: T.text, marginTop: 14 },
  successSub: { fontSize: 13, color: T.textSub, marginTop: 4, textAlign: 'center' },

  flowTitle: { fontSize: 18, fontWeight: '700', color: T.text, textAlign: 'center' },
  flowSub: { fontSize: 13, color: T.textSub, textAlign: 'center', marginTop: 4 },

  digitBoxRow: {
    flexDirection: 'row', gap: 14, justifyContent: 'center', marginTop: 24,
  },
  digitBox: {
    width: 64, height: 72, borderRadius: T.radius,
    backgroundColor: T.card,
    borderWidth: 1.5, borderColor: T.line,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  digitBoxActive: {
    borderColor: T.brand,
    shadowColor: T.brand,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  digitText: { fontSize: 28, fontWeight: '700', color: T.ink },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  errorText: { fontSize: 13, color: T.danger, textAlign: 'center', marginTop: 14, fontWeight: '600' },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: T.textMute, letterSpacing: 0.4, marginBottom: 8, marginLeft: 4 },
  infoTitle: { fontSize: 15, fontWeight: '700', color: T.text, alignSelf: 'center' },
  infoBody: { fontSize: 13, color: T.textSub, lineHeight: 20, marginBottom: 10 },
  bulletRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  bulletDot: { fontSize: 13, color: T.brand, fontWeight: '700', lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 12.5, color: T.textSub, lineHeight: 20 },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: T.text },
  toggleSub: { fontSize: 12, color: T.textSub, marginTop: 2 },
  toggleTrack: {
    width: 44, height: 26, borderRadius: 13,
    backgroundColor: T.lineSoft, justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleKnob: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
