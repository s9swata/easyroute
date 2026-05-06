import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

export default function DriverLoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);

  const isValid = phone.length >= 10;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: T.bg }}
    >
      <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        {/* Brand */}
        <View style={styles.brand}>
          <View style={styles.logoRing}>
            <Icon name="car" size={32} color={T.brand} />
          </View>
          <Text style={styles.title}>EasyRoute Driver</Text>
          <Text style={styles.sub}>Corporate Mobility Partner</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Phone number</Text>
          <View style={[styles.inputWrap, focused && styles.inputFocused]}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="98765 43210"
              placeholderTextColor={T.textMute}
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </View>

          <Btn
            variant="primary"
            size="lg"
            full
            disabled={!isValid}
            onPress={() => router.push('/driver/otp-verify')}
          >
            Continue
          </Btn>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to the{' '}
            <Text style={{ color: T.brand, fontWeight: '600' }}>Driver Terms</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  brand: { alignItems: 'center', marginTop: 20 },
  logoRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: '700', color: T.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: T.textSub, marginTop: 4 },

  form: { gap: 16 },
  label: { fontSize: 13, fontWeight: '600', color: T.textSub, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: T.line,
    paddingHorizontal: 14, height: 56,
    gap: 10,
  },
  inputFocused: { borderColor: T.brand },
  countryCode: { fontSize: 16, fontWeight: '600', color: T.text },
  input: { flex: 1, fontSize: 16, color: T.text, fontWeight: '500' },

  footer: { alignItems: 'center' },
  footerText: { fontSize: 12, color: T.textMute, textAlign: 'center' },
});
