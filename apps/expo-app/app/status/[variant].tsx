import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

type Variant = 'waiting' | 'allocated' | 'confirmed';

const STATUS_COPY: Record<Variant, { chip: string; title: string; sub: string }> = {
  waiting: { chip: 'Waiting for confirmation', title: 'Finding a vehicle', sub: 'We usually confirm within 10 minutes.' },
  allocated: { chip: 'Vehicle allocated', title: 'Cab assigned', sub: 'Driver is preparing to start your trip.' },
  confirmed: { chip: 'Confirmed · On the way', title: 'Driver on the way', sub: 'Arriving at Gate 3 in about 8 minutes.' },
};

function StatusStep({ label, state, index, last }: { label: string; state: 'done' | 'active' | 'pending'; index: number; last?: boolean }) {
  const colors = state === 'done'
    ? { bg: T.success, ring: T.successSoft }
    : state === 'active'
    ? { bg: T.brand, ring: T.brandSoft }
    : { bg: T.line, ring: 'transparent' };

  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, { backgroundColor: colors.bg }]}>
          {state === 'done' && <Icon name="check" size={14} color="#fff" />}
          {state === 'active' && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />}
          {state === 'pending' && <Text style={styles.stepNum}>{index}</Text>}
        </View>
        {!last && <View style={[styles.stepLine, { backgroundColor: state === 'done' ? T.success : T.line }]} />}
      </View>
      <Text style={[styles.stepLabel, state === 'pending' && { color: T.textMute }]}>{label}</Text>
    </View>
  );
}

export default function StatusScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { variant = 'waiting' } = useLocalSearchParams<{ variant: Variant }>();
  const v = (variant as Variant) in STATUS_COPY ? (variant as Variant) : 'waiting';
  const copy = STATUS_COPY[v];

  const spinAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 800, easing: Easing.linear, useNativeDriver: true })
    );
    anim.start();
    return () => anim.stop();
  }, [spinAnim]);
  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const heroStatusColor = v === 'waiting' ? T.warning : v === 'allocated' ? T.brand : T.success;
  const heroTextColor = v === 'waiting' ? '#A06F00' : v === 'allocated' ? T.brand : '#7EE3B3';

  const steps: Array<{ k: string; label: string; state: 'done' | 'active' | 'pending' }> = [
    { k: 'req', label: 'Request received', state: 'done' },
    { k: 'alloc', label: 'Vehicle allocated', state: v === 'waiting' ? 'active' : 'done' },
    { k: 'conf', label: 'Driver confirmed', state: v === 'waiting' ? 'pending' : v === 'allocated' ? 'active' : 'done' },
    { k: 'enrt', label: 'On the way to pickup', state: v === 'confirmed' ? 'active' : 'pending' },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chev" size={16} color={T.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Trip status</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {/* Hero card */}
        <Card padded={false} style={{
          padding: 18,
          backgroundColor: v === 'confirmed' ? T.ink : '#fff',
          overflow: 'hidden',
        }}>
          <View style={styles.heroStatus}>
            <View style={[styles.statusDot, { backgroundColor: heroStatusColor }]} />
            <Text style={[styles.statusChipText, { color: heroTextColor }]}>{copy.chip.toUpperCase()}</Text>
          </View>
          <Text style={[styles.heroTitle, v === 'confirmed' && { color: '#fff' }]}>{copy.title}</Text>
          <Text style={[styles.heroSub, v === 'confirmed' && { color: 'rgba(255,255,255,0.7)' }]}>{copy.sub}</Text>

          {v !== 'waiting' && (
            <View style={[styles.driverCard, v === 'confirmed' && { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]}>
              <View style={[styles.driverAvatar, v === 'confirmed' && { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
                <Icon name="user" size={22} color={v === 'confirmed' ? '#fff' : T.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.driverName, v === 'confirmed' && { color: '#fff' }]}>Ramesh Kumar</Text>
                <Text style={[styles.driverPlate, v === 'confirmed' && { color: 'rgba(255,255,255,0.6)' }]}>Innova · KA-01-HG-4821</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.etaLabel, v === 'confirmed' && { color: 'rgba(255,255,255,0.6)' }]}>ETA</Text>
                <Text style={[styles.etaValue, { color: v === 'confirmed' ? '#7EE3B3' : T.brand }]}>
                  {v === 'confirmed' ? '8 min' : '—'}
                </Text>
              </View>
            </View>
          )}

          {v === 'waiting' && (
            <View style={styles.driverCard}>
              <View style={[styles.driverAvatar, { alignItems: 'center', justifyContent: 'center' }]}>
                <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>Matching a cab in your cluster</Text>
                <Text style={styles.driverPlate}>Bellandur · 3 other riders routed</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Progress */}
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.cardSectionLabel}>PROGRESS</Text>
          {steps.map((s, i) => (
            <StatusStep key={s.k} index={i + 1} label={s.label} state={s.state} last={i === steps.length - 1} />
          ))}
        </Card>

        {/* Trip details */}
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.cardSectionLabel}>TRIP DETAILS</Text>
          {[
            ['Type', 'Shared · Drop'],
            ['Scheduled', 'Today · 6:30 PM'],
            ['Co-riders', '2 others · Route S-14'],
            ['Trip ID', 'HLX-284-0422'],
          ].map(([label, value]) => (
            <View key={label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{label}</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          ))}
        </Card>

        {v !== 'waiting' && (
          <View style={styles.actions}>
            <Btn variant="dark" icon="map" full onPress={() => router.push('/map')}>Track live</Btn>
            <Pressable
              style={styles.actionIcon}
              accessibilityRole="button"
              accessibilityLabel="Call driver"
              onPress={() => { /* TODO: Linking.openURL('tel:...') */ }}
            >
              <Icon name="phone" size={18} color={T.text} />
            </Pressable>
            <Pressable
              style={[styles.actionIcon, { borderColor: T.dangerSoft }]}
              accessibilityRole="button"
              accessibilityLabel="Cancel trip"
              onPress={() => router.push('/cancel-trip')}
            >
              <Icon name="close" size={18} color={T.danger} />
            </Pressable>
          </View>
        )}
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
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  heroStatus: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusChipText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  heroTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6, marginTop: 10, color: T.text },
  heroSub: { fontSize: 13, color: T.textSub, marginTop: 6, lineHeight: 19 },
  driverCard: {
    marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: T.cardAlt,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  driverAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.line,
  },
  driverName: { fontSize: 14, fontWeight: '600', color: T.text },
  driverPlate: { fontSize: 12, color: T.textSub, marginTop: 1 },
  etaLabel: { fontSize: 11, color: T.textMute, fontWeight: '600' },
  etaValue: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  spinner: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2.5, borderColor: T.line, borderTopColor: T.brand,
  },

  cardSectionLabel: { fontSize: 12, fontWeight: '700', color: T.textSub, letterSpacing: 0.3, marginBottom: 14 },
  stepRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepIndicator: { alignItems: 'center' },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepLine: { width: 2, height: 36, marginTop: 2 },
  stepLabel: { paddingTop: 4, fontSize: 14, fontWeight: '600', color: T.text, flex: 1 },
  stepNum: { fontSize: 12, fontWeight: '700', color: T.textMute },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  detailLabel: { fontSize: 13, color: T.textSub },
  detailValue: { fontSize: 13, fontWeight: '600', color: T.text },

  actions: { marginTop: 14, flexDirection: 'row', gap: 8 },
  actionIcon: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.line,
  },
});
