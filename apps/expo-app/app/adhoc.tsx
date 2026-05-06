import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

const REASONS = [
  { id: 'medical', label: 'Medical emergency' },
  { id: 'client', label: 'Client / offsite' },
  { id: 'ot', label: 'Overtime / late night' },
  { id: 'other', label: 'Other' },
];

const WHEN_OPTS = [
  { id: 'now', label: 'Leave now', sub: 'ETA 6 min', icon: 'bolt' },
  { id: 'sched', label: 'Schedule', sub: 'Pick time', icon: 'clock' },
];

export default function AdhocScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [when, setWhen] = useState('now');
  const [reason, setReason] = useState('medical');

  function handleSwap() {
    /* TODO: swap pickup and drop locations */
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16 }}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="chev" size={16} color={T.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Ad-hoc cab</Text>
            <View style={{ width: 36 }} />
          </View>
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <Icon name="bolt" size={22} color={T.danger} />
            </View>
            <View>
              <Text style={styles.heroTitle}>Full cab for you</Text>
              <Text style={styles.heroSub}>No shared route · billed to your cost centre</Text>
            </View>
          </View>
        </View>

        {/* Pickup / Drop */}
        <View style={{ paddingHorizontal: 16 }}>
          <Card padded={false}>
            <View style={styles.routeBlock}>
              <View style={styles.routeLine}>
                <View style={styles.dotBlue} />
                <View style={styles.dashedLine} />
                <View style={styles.dotDark} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 14, borderBottomWidth: 0.5, borderBottomColor: T.lineSoft }}>
                  <Text style={styles.locationLabel}>PICKUP</Text>
                  <Text style={styles.locationValue}>Helix HQ, Gate 3</Text>
                  <Text style={styles.locationSub}>Bellandur · Use default</Text>
                </View>
                <View style={{ paddingTop: 12 }}>
                  <Text style={styles.locationLabel}>DROP</Text>
                  <Text style={styles.locationValue}>Prestige Lake Ridge</Text>
                  <Text style={styles.locationSub}>Uttarahalli · ~19.2 km</Text>
                </View>
              </View>
              <Pressable style={styles.swapBtn} onPress={handleSwap} accessibilityRole="button" accessibilityLabel="Swap pickup and drop">
                <Icon name="refresh" size={16} color={T.textSub} />
              </Pressable>
            </View>
          </Card>
        </View>

        {/* When */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          <Text style={styles.sectionLabel}>WHEN</Text>
          <View style={styles.whenGrid}>
            {WHEN_OPTS.map(o => (
              <Pressable
                key={o.id}
                onPress={() => setWhen(o.id)}
                style={[styles.whenCard, when === o.id && styles.whenCardActive]}
              >
                <Icon name={o.icon} size={20} color={when === o.id ? T.brand : T.text} />
                <Text style={[styles.whenLabel, when === o.id && { color: T.brand }]}>{o.label}</Text>
                <Text style={styles.whenSub}>{o.sub}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Reason */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
          <Text style={styles.sectionLabel}>REASON · REQUIRED</Text>
          <Card padded={false}>
            {REASONS.map((r, i) => (
              <Pressable
                key={r.id}
                onPress={() => setReason(r.id)}
                style={[styles.reasonRow, i < REASONS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: T.lineSoft }]}
              >
                <View style={[styles.radioOuter, reason === r.id && styles.radioOuterActive]}>
                  {reason === r.id && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.reasonLabel}>{r.label}</Text>
              </Pressable>
            ))}
          </Card>
        </View>

        {/* Approval note */}
        <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
          <View style={styles.approvalNote}>
            <Icon name="info" size={18} color={T.brand} />
            <Text style={styles.approvalText}>
              Requires your manager's approval.{' '}
              <Text style={{ color: T.text, fontWeight: '700' }}>Savita R.</Text> will be notified.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Btn variant="primary" size="lg" full onPress={() => router.push('/status/waiting')}>Request cab</Btn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, color: T.text },
  heroSub: { fontSize: 12, color: T.textSub, marginTop: 1 },

  routeBlock: { padding: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  routeLine: { alignItems: 'center', paddingTop: 6 },
  dotBlue: { width: 10, height: 10, borderRadius: 5, borderWidth: 2.5, borderColor: T.brand },
  dashedLine: { width: 2, height: 28, backgroundColor: T.line, marginVertical: 3 },
  dotDark: { width: 10, height: 10, backgroundColor: T.ink },
  locationLabel: { fontSize: 10, color: T.textMute, fontWeight: '700', letterSpacing: 0.3 },
  locationValue: { fontSize: 15, fontWeight: '600', color: T.text, marginTop: 2 },
  locationSub: { fontSize: 12, color: T.textSub, marginTop: 2 },
  swapBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: T.lineSoft,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
  },

  sectionLabel: { fontSize: 12, fontWeight: '700', color: T.textSub, letterSpacing: 0.3, marginBottom: 8, marginLeft: 4 },
  whenGrid: { flexDirection: 'row', gap: 8 },
  whenCard: {
    flex: 1, padding: 14, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 1, borderColor: T.line,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  whenCardActive: { borderWidth: 2, borderColor: T.brand },
  whenLabel: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2, color: T.text, marginTop: 20 },
  whenSub: { fontSize: 12, color: T.textSub, marginTop: 2 },

  reasonRow: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16, gap: 12 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: T.line, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive: { borderColor: T.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: T.brand },
  reasonLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: T.text },

  approvalNote: {
    flexDirection: 'row', gap: 10, padding: 12, paddingHorizontal: 14,
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: T.line,
    alignItems: 'flex-start',
  },
  approvalText: { flex: 1, fontSize: 12, color: T.textSub, lineHeight: 18 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: T.line,
    paddingHorizontal: 16, paddingTop: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
});
