import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

const MOCK_OTP = '4827';

export default function DriverOTPVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) text = text[text.length - 1];
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError(false);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const entered = code.join('');
    if (entered === MOCK_OTP) {
      router.replace('/driver/(tabs)');
    } else {
      setError(true);
      setCode(['', '', '', '']);
      inputs.current[0]?.focus();
    }
  };

  const isComplete = code.every(c => c !== '');

  return (
    <View style={{ flex: 1, backgroundColor: T.ink }}>
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        {/* Header */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chev" size={16} color="#fff" />
        </Pressable>

        <View style={styles.center}>
          <View style={styles.badge}>
            <Icon name="lock" size={14} color="#fff" />
            <Text style={styles.badgeText}>VERIFY OTP</Text>
          </View>

          <Text style={styles.instruction}>Enter the 4-digit code</Text>
          <Text style={styles.subInstruction}>
            Sent to +91 98765 43210
          </Text>
        </View>

        {/* Digit boxes */}
        <View style={styles.digitsRow}>
          {code.map((digit, i) => (
            <View
              key={i}
              style={[
                styles.digitBox,
                error && styles.digitBoxError,
                digit && styles.digitBoxActive,
              ]}
            >
              <TextInput
                ref={ref => { inputs.current[i] = ref; }}
                value={digit}
                onChangeText={text => handleChange(text, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.digitInput}
                selectionColor={T.brand}
              />
            </View>
          ))}
        </View>

        {error && (
          <Text style={styles.errorText}>Incorrect code. Please try again.</Text>
        )}

        {/* Resend */}
        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.resendText}>Resend in {timer}s</Text>
          ) : (
            <Pressable onPress={() => setTimer(30)}>
              <Text style={[styles.resendText, { color: T.brand, fontWeight: '600' }]}>Resend OTP</Text>
            </Pressable>
          )}
        </View>

        <View style={{ flex: 1 }} />

        <Btn variant="primary" size="lg" full disabled={!isComplete} onPress={handleVerify}>
          Verify & continue
        </Btn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  center: { paddingTop: 40, alignItems: 'center' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 100,
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#fff', letterSpacing: 0.3 },
  instruction: {
    fontSize: 28, fontWeight: '700', letterSpacing: -0.7, color: '#fff',
    textAlign: 'center', marginTop: 20,
  },
  subInstruction: {
    fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center',
    marginTop: 8, lineHeight: 20,
  },
  digitsRow: {
    flexDirection: 'row', gap: 14, paddingTop: 40,
    justifyContent: 'center',
  },
  digitBox: {
    width: 72, height: 96, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  digitBoxActive: {
    borderColor: T.brand,
    backgroundColor: 'rgba(31,79,214,0.15)',
  },
  digitBoxError: {
    borderColor: T.danger,
    backgroundColor: 'rgba(212,53,43,0.15)',
  },
  digitInput: {
    fontSize: 40, fontWeight: '700', color: '#fff',
    textAlign: 'center', width: '100%', height: '100%',
  },
  errorText: {
    textAlign: 'center', color: T.dangerSoft,
    marginTop: 16, fontSize: 13, fontWeight: '600',
  },
  resendRow: { alignItems: 'center', marginTop: 24 },
  resendText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
});
