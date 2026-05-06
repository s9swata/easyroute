import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

const MOCK_OTP = '4827';
const OTP_LENGTH = 4;

export default function OTPVerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      if (error) setError(false);
      const digit = text.replace(/\D/g, '').slice(-1);
      const next = [...otp];
      next[index] = digit;
      setOtp(next);

      if (digit && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    },
    [otp, error]
  );

  const handleKeyPress = useCallback(
    (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleVerify = useCallback(() => {
    const entered = otp.join('');
    if (entered === MOCK_OTP) {
      router.replace('/(tabs)');
    } else {
      setError(true);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
    }
  }, [otp, router]);

  const handleResend = useCallback(() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    setError(false);
    setTimer(30);
    inputsRef.current[0]?.focus();
  }, []);

  const isComplete = otp.every((d) => d !== '');

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 16, paddingHorizontal: 20 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Icon name="chev" size={16} color="#fff" />
            </Pressable>
            <Text style={styles.headerTitle}>Verify OTP</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Center info */}
          <View style={styles.center}>
            <View style={styles.badge}>
              <Icon name="lock" size={14} color="#fff" />
              <Text style={styles.badgeText}>LOGIN OTP</Text>
            </View>

            <Text style={styles.instruction}>
              Enter the 4-digit code
            </Text>
            <Text style={styles.subInstruction}>
              Sent to your registered mobile number
            </Text>
          </View>

          {/* Digits */}
          <View style={styles.digitsRow}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                style={[
                  styles.digitBox,
                  error && styles.digitBoxError,
                  digit !== '' && styles.digitBoxFilled,
                ]}
                textAlign="center"
                caretHidden
              />
            ))}
          </View>

          {error && (
            <Text style={styles.errorText}>Incorrect OTP. Please try again.</Text>
          )}

          <View style={{ flex: 1 }} />

          {/* Resend */}
          <View style={styles.resendRow}>
            {timer > 0 ? (
              <Text style={styles.resendMute}>
                Resend in {timer}s
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </Pressable>
            )}
          </View>

          {/* CTA */}
          <View style={styles.cta}>
            <Btn
              onPress={handleVerify}
              variant="primary"
              size="lg"
              full
              icon={isComplete ? 'check' : undefined}
            >
              Verify
            </Btn>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.ink,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  center: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },
  instruction: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 32,
  },
  subInstruction: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },
  digitsRow: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 36,
  },
  digitBox: {
    width: 64,
    height: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 40,
    textAlignVertical: 'center',
  },
  digitBoxFilled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  digitBoxError: {
    borderColor: T.danger,
    backgroundColor: 'rgba(212,53,43,0.12)',
  },
  errorText: {
    marginTop: 16,
    fontSize: 13,
    fontWeight: '500',
    color: T.dangerSoft,
    textAlign: 'center',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendMute: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: T.brandSoft,
  },
  cta: {
    marginBottom: 8,
  },
});
