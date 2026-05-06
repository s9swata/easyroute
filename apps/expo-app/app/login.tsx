import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [employeeId, setEmployeeId] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const canContinue = employeeId.trim().length >= 3;

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    router.push('/otp-verify');
  }, [canContinue, router]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 32, paddingHorizontal: 24 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Branding */}
          <View style={styles.brand}>
            <View style={styles.logoRing}>
              <Icon name="car" size={32} color={T.brand} />
            </View>
            <Text style={styles.title}>EasyRoute</Text>
            <Text style={styles.subtitle}>Corporate Mobility</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Employee ID</Text>
            <View
              style={[
                styles.inputWrap,
                isFocused && styles.inputWrapFocused,
              ]}
            >
              <Icon
                name="user"
                size={20}
                color={isFocused ? T.brand : T.textMute}
              />
              <TextInput
                value={employeeId}
                onChangeText={setEmployeeId}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your employee ID"
                placeholderTextColor={T.textMute}
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={handleContinue}
              />
            </View>
            <Text style={styles.hint}>
              We’ll send a one-time password to your registered mobile number.
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          {/* CTA */}
          <View style={styles.cta}>
            <Btn onPress={handleContinue} variant="primary" size="lg" full>
              Continue
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
    backgroundColor: T.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: T.lineSoft,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: T.textSub,
    marginTop: 4,
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSub,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 56,
    backgroundColor: T.card,
    borderRadius: T.radius,
    borderWidth: 1,
    borderColor: T.line,
    paddingHorizontal: 16,
  },
  inputWrapFocused: {
    borderColor: T.brand,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: T.text,
    letterSpacing: 0.3,
  },
  hint: {
    fontSize: 13,
    color: T.textMute,
    lineHeight: 18,
    marginTop: 4,
  },
  cta: {
    marginTop: 24,
  },
});
