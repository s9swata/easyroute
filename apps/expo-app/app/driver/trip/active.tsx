import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

type Stage =
  | 'navigate_pickup'
  | 'arrived_pickup'
  | 'verify_login_otp'
  | 'in_progress'
  | 'navigate_drop'
  | 'arrived_drop'
  | 'verify_logout_otp'
  | 'completed';

const STAGE_TITLES: Record<Stage, string> = {
  navigate_pickup: 'Navigate to pickup',
  arrived_pickup: 'Verify OTP',
  verify_login_otp: 'Verifying…',
  in_progress: 'Trip in progress',
  navigate_drop: 'Navigate to drop',
  arrived_drop: 'Verify OTP',
  verify_logout_otp: 'Verifying…',
  completed: 'Trip completed',
};

const PROGRESS_STEPS = ['Pickup', 'OTP', 'Drop', 'OTP', 'Done'];

function activeStepIndex(stage: Stage): number {
  switch (stage) {
    case 'navigate_pickup':
      return 0;
    case 'arrived_pickup':
    case 'verify_login_otp':
      return 1;
    case 'in_progress':
    case 'navigate_drop':
      return 2;
    case 'arrived_drop':
    case 'verify_logout_otp':
      return 3;
    case 'completed':
      return 4;
  }
}

export default function ActiveTripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('navigate_pickup');
  const [otp, setOtp] = useState('');
  const otpRef = useRef<TextInput>(null);

  const stepIndex = activeStepIndex(stage);

  const clearOtp = useCallback(() => setOtp(''), []);

  const go = useCallback((next: Stage) => {
    clearOtp();
    setStage(next);
  }, [clearOtp]);

  const onOtpChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    setOtp(digits);
  };

  const verifyLogin = useCallback(() => {
    if (otp !== '4827') return;
    setStage('verify_login_otp');
    setTimeout(() => {
      clearOtp();
      setStage('in_progress');
    }, 900);
  }, [otp, clearOtp]);

  const verifyLogout = useCallback(() => {
    if (otp !== '9163') return;
    setStage('verify_logout_otp');
    setTimeout(() => {
      clearOtp();
      setStage('completed');
    }, 900);
  }, [otp, clearOtp]);

  const progressBar = (
    <View style={styles.progressTrack}>
      {PROGRESS_STEPS.map((step, index) => {
        const isLast = index === PROGRESS_STEPS.length - 1;
        const isActive = index === stepIndex;
        const isDone = index < stepIndex;
        return (
          <View key={step} style={styles.progressSegment}>
            <View style={styles.progressTopRow}>
              <View
                style={[
                  styles.progressDot,
                  isActive && styles.progressDotActive,
                  isDone && styles.progressDotDone,
                ]}
              />
              {!isLast && (
                <View
                  style={[
                    styles.progressLine,
                    isDone && styles.progressLineDone,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.progressLabel,
                isActive && styles.progressLabelActive,
                isDone && styles.progressLabelDone,
              ]}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const otpSection = (label: string, onVerify: () => void, mock: string) => (
    <View style={styles.otpSection}>
      <Text style={styles.otpLabel}>{label}</Text>

      <Pressable
        onPress={() => otpRef.current?.focus()}
        style={styles.otpBoxesWrap}
      >
        <View style={styles.otpBoxesRow}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                otp.length === i && styles.otpBoxFocused,
              ]}
            >
              <Text style={styles.otpBoxText}>{otp[i] ?? ''}</Text>
            </View>
          ))}
        </View>
        <TextInput
          ref={otpRef}
          value={otp}
          onChangeText={onOtpChange}
          keyboardType="number-pad"
          maxLength={4}
          style={styles.hiddenInput}
          autoFocus
        />
      </Pressable>

      <Btn size="lg" full onPress={onVerify} disabled={otp.length !== 4}>
        Verify
      </Btn>
      <Text style={styles.mockHint}>Mock OTP: {mock}</Text>
    </View>
  );

  const verifyingView = (
    <View style={styles.centeredContent}>
      <ActivityIndicator size="large" color={T.brand} />
      <Text style={styles.verifyingText}>Verifying OTP…</Text>
    </View>
  );

  const bottomContent = (() => {
    switch (stage) {
      case 'navigate_pickup':
        return (
          <View style={styles.gap12}>
            <Card>
              <View style={styles.tripRow}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: T.brandSoft },
                  ]}
                >
                  <Icon name="pin" size={18} color={T.brand} />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Pickup</Text>
                  <Text style={styles.tripAddress}>
                    12B, Cyber Tower 1, Hitec City
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.employeeRow}>
                <View style={styles.employeeLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: T.lineSoft },
                    ]}
                  >
                    <Icon name="user" size={18} color={T.textSub} />
                  </View>
                  <View>
                    <Text style={styles.employeeName}>Priya Menon</Text>
                    <Text style={styles.employeePhone}>+91 98765 43210</Text>
                  </View>
                </View>
                <Pressable style={styles.phoneBtn}>
                  <Icon name="phone" size={20} color={T.brand} />
                </Pressable>
              </View>
            </Card>

            <View style={styles.distanceChip}>
              <Chip icon="map" tone="dark">
                2.4 km · 8 min
              </Chip>
            </View>

            <Btn size="lg" full onPress={() => go('arrived_pickup')}>
              I've arrived at pickup
            </Btn>
            <Btn size="lg" full variant="outline" icon="phone" onPress={() => {}}>
              Call employee
            </Btn>
          </View>
        );

      case 'arrived_pickup':
        return otpSection(
          "Enter employee's trip start OTP",
          verifyLogin,
          '4827'
        );

      case 'verify_login_otp':
        return verifyingView;

      case 'in_progress':
        return (
          <View style={styles.gap12}>
            <Card>
              <View style={styles.tripRow}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: T.successSoft },
                  ]}
                >
                  <Icon name="pin" size={18} color={T.success} />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Drop</Text>
                  <Text style={styles.tripAddress}>
                    DLF Cyber City, Gachibowli
                  </Text>
                </View>
              </View>
            </Card>

            <View style={styles.distanceChip}>
              <Chip icon="clock" tone="dark">
                Trip time: 12 min
              </Chip>
            </View>

            <Btn size="lg" full onPress={() => go('navigate_drop')}>
              Navigate to drop
            </Btn>
          </View>
        );

      case 'navigate_drop':
        return (
          <View style={styles.gap12}>
            <Card>
              <View style={styles.tripRow}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: T.successSoft },
                  ]}
                >
                  <Icon name="pin" size={18} color={T.success} />
                </View>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripLabel}>Drop</Text>
                  <Text style={styles.tripAddress}>
                    DLF Cyber City, Gachibowli
                  </Text>
                </View>
              </View>
            </Card>

            <View style={styles.distanceChip}>
              <Chip icon="map" tone="dark">
                4.2 km · 15 min
              </Chip>
            </View>

            <Btn size="lg" full onPress={() => go('arrived_drop')}>
              I've arrived at drop
            </Btn>
          </View>
        );

      case 'arrived_drop':
        return otpSection(
          "Enter employee's trip end OTP",
          verifyLogout,
          '9163'
        );

      case 'verify_logout_otp':
        return verifyingView;

      case 'completed':
        return (
          <View style={[styles.gap12, styles.completedCenter]}>
            <View style={styles.successCircle}>
              <Icon name="check" size={48} color="#fff" />
            </View>
            <Text style={styles.completedTitle}>Trip completed!</Text>

            <Card style={styles.summaryCard} padded>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>6.6 km</Text>
                  <Text style={styles.summaryLabel}>Distance</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>28 min</Text>
                  <Text style={styles.summaryLabel}>Duration</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>1</Text>
                  <Text style={styles.summaryLabel}>Riders</Text>
                </View>
              </View>
            </Card>

            <Btn size="lg" full onPress={() => router.push('/driver/(tabs)')}>
              Back to home
            </Btn>
          </View>
        );
    }
  })();

  return (
    <View style={styles.container}>
      {/* Map Area */}
      <View style={styles.mapArea}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View</Text>
        </View>

        {/* Recenter */}
        <Pressable style={styles.recenterBtn}>
          <Icon name="pin" size={20} color={T.text} />
        </Pressable>

        {/* Top Bar */}
        <View
          style={[
            styles.topBar,
            { paddingTop: insets.top + 12 },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <View style={{ transform: [{ rotate: '180deg' }] }}>
              <Icon name="chev" size={20} color={T.text} />
            </View>
          </Pressable>

          <Text style={styles.topBarTitle}>{STAGE_TITLES[stage]}</Text>

          <Pressable
            style={[styles.backBtn, { backgroundColor: T.dangerSoft }]}
          >
            <Icon name="shield" size={20} color={T.danger} />
          </Pressable>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.progressWrapper}>{progressBar}</View>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {bottomContent}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.ink,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: T.lineSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: T.textMute,
    fontWeight: '500',
  },
  recenterBtn: {
    position: 'absolute',
    top: 96,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.2,
  },
  bottomSheet: {
    flex: 1.15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  progressWrapper: {
    marginBottom: 12,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  progressSegment: {
    flex: 1,
    alignItems: 'center',
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: T.line,
  },
  progressDotActive: {
    backgroundColor: T.brand,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressDotDone: {
    backgroundColor: T.success,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: T.line,
    marginHorizontal: 2,
  },
  progressLineDone: {
    backgroundColor: T.success,
  },
  progressLabel: {
    fontSize: 11,
    color: T.textMute,
    fontWeight: '500',
  },
  progressLabelActive: {
    color: T.brand,
    fontWeight: '700',
  },
  progressLabelDone: {
    color: T.success,
  },
  gap12: {
    gap: 12,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfo: {
    flex: 1,
  },
  tripLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textMute,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tripAddress: {
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: T.lineSoft,
    marginVertical: 14,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  employeeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
  },
  employeePhone: {
    fontSize: 13,
    color: T.textSub,
    marginTop: 2,
  },
  phoneBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: T.brandSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceChip: {
    alignSelf: 'center',
  },
  otpSection: {
    gap: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: T.text,
  },
  otpBoxesWrap: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  otpBoxesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  otpBox: {
    width: 64,
    height: 72,
    borderRadius: 14,
    backgroundColor: T.cardAlt,
    borderWidth: 2,
    borderColor: T.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBoxFocused: {
    borderColor: T.brand,
    backgroundColor: T.brandFaint,
  },
  otpBoxText: {
    fontSize: 28,
    fontWeight: '700',
    color: T.text,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  mockHint: {
    fontSize: 13,
    color: T.textMute,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 16,
  },
  verifyingText: {
    fontSize: 16,
    fontWeight: '600',
    color: T.brand,
  },
  completedCenter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: T.text,
  },
  summaryCard: {
    width: '100%',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: T.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: T.textMute,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: T.lineSoft,
  },
});
