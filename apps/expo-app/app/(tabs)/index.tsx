import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hasActiveTrip = false; // TODO: replace with real state

  function handleCallDriver() {
    /* TODO: replace with actual driver phone number from trip state */
    Linking.openURL('tel:+919876543210');
  }

  function handleShieldPress() {
    router.push('/sos');
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.headerPad, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>Priya Menon</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => router.push('/notifications')} style={styles.iconBtn}>
              <Icon name="bell" size={20} color={T.text} />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable onPress={() => router.push('/sidebar')} style={styles.avatar}>
              <Text style={styles.avatarText}>PM</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Next trip card */}
      <View style={styles.section}>
        {hasActiveTrip ? (
          <Card padded={false} style={{ overflow: 'hidden' }}>
            <View style={styles.tripCardHeader}>
              <View style={styles.liveRow}>
                <View style={styles.greenDot} />
                <Text style={styles.liveText}>On the way</Text>
              </View>
              <Chip tone="brand" icon="users">Shared · 3</Chip>
            </View>

            <View style={styles.tripCardBody}>
              <View style={styles.tripTimeRow}>
                <View>
                  <Text style={styles.tripLabel}>Evening drop · Today</Text>
                  <Text style={styles.tripTime}>6:30 PM</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.tripLabel}>ETA to pickup</Text>
                  <Text style={styles.etaTime}>8 min</Text>
                </View>
              </View>

              <View style={styles.routeRow}>
                <View style={styles.routeLine}>
                  <View style={styles.dotBlue} />
                  <View style={styles.dashedLine} />
                  <View style={styles.dotDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ paddingBottom: 14 }}>
                    <Text style={styles.routeLabel}>PICKUP</Text>
                    <Text style={styles.routeValue}>Helix HQ, Gate 3 · Bellandur</Text>
                  </View>
                  <View>
                    <Text style={styles.routeLabel}>DROP</Text>
                    <Text style={styles.routeValue}>Prestige Lake Ridge · Uttarahalli</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Vehicle strip */}
            <View style={styles.vehicleStrip}>
              <View style={styles.vehicleIcon}>
                <Icon name="car" size={24} color={T.text} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleName}>Toyota Innova · White</Text>
                <Text style={styles.vehicleSub}>KA-01-HG-4821 · Ramesh K.</Text>
              </View>
              <Pressable style={styles.callBtn} onPress={handleCallDriver} accessibilityRole="button" accessibilityLabel="Call driver">
                <Icon name="phone" size={18} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.ctaRow}>
              <Btn icon="map" variant="dark" full onPress={() => router.push('/map')}>Track on map</Btn>
              <Pressable style={styles.shieldBtn} onPress={handleShieldPress} accessibilityRole="button" accessibilityLabel="SOS safety">
                <Icon name="shield" size={20} color={T.text} />
              </Pressable>
            </View>
          </Card>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Icon name="car" size={28} color={T.brand} />
            </View>
            <Text style={styles.emptyTitle}>No upcoming trips</Text>
            <Text style={styles.emptySub}>Book your weekly roster or request an ad-hoc cab</Text>
            <View style={styles.emptyActions}>
              <Btn icon="calendar" variant="primary" full onPress={() => router.push('/roster')}>Book roster</Btn>
              <Btn icon="bolt" variant="outline" full onPress={() => router.push('/adhoc')}>Ad-hoc cab</Btn>
            </View>
          </View>
        )}
      </View>

      {/* Quick book */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick book</Text>
      </View>
      <View style={styles.quickGrid}>
        <Pressable onPress={() => router.push('/roster')} style={styles.bookRoster}>
          <Icon name="calendar" size={22} color="#fff" />
          <Text style={styles.bookRosterTitle}>Book roster</Text>
          <Text style={styles.bookRosterSub}>Plan your week · opens Sunday</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/adhoc')} style={styles.bookAdhoc}>
          <View style={styles.boltIcon}>
            <Icon name="bolt" size={18} color={T.danger} />
          </View>
          <Text style={styles.bookAdhocTitle}>Ad-hoc cab</Text>
          <Text style={styles.bookAdhocSub}>Single full cab · now</Text>
        </Pressable>
      </View>

      {/* This week */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This week</Text>
        <Pressable onPress={() => router.push('/trips')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>
      <View style={styles.section}>
        <Card padded={false}>
          {WEEK_ROWS.map((r, i) => (
            <View key={i} style={[styles.weekRow, i < WEEK_ROWS.length - 1 && styles.weekRowBorder]}>
              <View style={styles.weekDay}>
                <Text style={styles.weekDayLabel}>{r.day.toUpperCase()}</Text>
                <Text style={styles.weekDayNum}>{r.d}</Text>
              </View>
              <View style={styles.weekChips}>
                {r.status === 'wfh' ? (
                  <Chip tone="neutral">Work from home</Chip>
                ) : (
                  <>
                    {r.am && r.am !== '—' && <Chip tone="brand">↑ {r.am}</Chip>}
                    {r.pm && r.pm !== '—' && (
                      <Chip tone={r.night ? 'dark' : 'warn'} icon={r.night ? 'shield' : undefined}>
                        ↓ {r.pm}
                      </Chip>
                    )}
                  </>
                )}
              </View>
              {r.status === 'confirmed' && <Icon name="check" size={16} color={T.success} />}
              {r.status === 'allocated' && <Text style={[styles.statusLabel, { color: T.brand }]}>Allocated</Text>}
              {r.status === 'waiting' && <Text style={[styles.statusLabel, { color: T.warning }]}>Waiting</Text>}
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const WEEK_ROWS = [
  { day: 'Tue', d: '22', am: '9:00 AM', pm: '6:30 PM', status: 'confirmed' },
  { day: 'Wed', d: '23', am: '—', pm: '9:00 PM', status: 'allocated', night: true },
  { day: 'Thu', d: '24', am: '9:00 AM', pm: '6:30 PM', status: 'waiting' },
  { day: 'Fri', d: '25', am: 'WFH', pm: 'WFH', status: 'wfh' },
];

const styles = StyleSheet.create({
  headerPad: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 13, color: T.textSub, fontWeight: '500' },
  name: { fontSize: 26, fontWeight: '700', color: T.text, letterSpacing: -0.6, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  notifDot: {
    position: 'absolute', top: 9, right: 11, width: 8, height: 8,
    borderRadius: 4, backgroundColor: T.danger, borderWidth: 2, borderColor: '#fff',
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  section: { paddingHorizontal: 16, marginBottom: 4 },
  tripCardHeader: {
    padding: 14, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 0.5, borderBottomColor: T.lineSoft,
  },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  greenDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: T.success,
  },
  liveText: { fontSize: 13, fontWeight: '600', color: T.success },

  tripCardBody: { padding: 14, paddingHorizontal: 16, paddingBottom: 8 },
  tripTimeRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  tripLabel: { fontSize: 12, color: T.textSub, fontWeight: '500' },
  tripTime: { fontSize: 28, fontWeight: '700', letterSpacing: -0.6, color: T.text, marginTop: 2 },
  etaTime: { fontSize: 20, fontWeight: '700', color: T.brand, letterSpacing: -0.3, marginTop: 2 },

  routeRow: { marginTop: 14, flexDirection: 'row', gap: 10 },
  routeLine: { alignItems: 'center', paddingTop: 4 },
  dotBlue: { width: 10, height: 10, borderRadius: 5, borderWidth: 2.5, borderColor: T.brand },
  dashedLine: { width: 2, flex: 1, backgroundColor: T.line, marginVertical: 3 },
  dotDark: { width: 10, height: 10, backgroundColor: T.ink },
  routeLabel: { fontSize: 10, color: T.textMute, fontWeight: '600', letterSpacing: 0.3 },
  routeValue: { fontSize: 14, fontWeight: '600', color: T.text, marginTop: 2 },

  vehicleStrip: {
    margin: 12, marginTop: 4, backgroundColor: T.cardAlt, borderRadius: 14,
    padding: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  vehicleIcon: {
    width: 44, height: 44, borderRadius: 10, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.line,
  },
  vehicleName: { fontSize: 13, fontWeight: '600', color: T.text },
  vehicleSub: { fontSize: 12, color: T.textSub, marginTop: 1 },
  callBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  ctaRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 12 },
  shieldBtn: {
    width: 54, height: 48, borderRadius: 24, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.line,
  },

  sectionHeader: {
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2, color: T.text },
  seeAll: { fontSize: 13, color: T.brand, fontWeight: '600' },

  quickGrid: { paddingHorizontal: 16, flexDirection: 'row', gap: 10 },
  bookRoster: {
    flex: 1, padding: 14, borderRadius: T.radiusLg, backgroundColor: T.brand,
  },
  bookRosterTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 28, letterSpacing: -0.2 },
  bookRosterSub: { fontSize: 11.5, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  bookAdhoc: {
    flex: 1, padding: 14, borderRadius: T.radiusLg, backgroundColor: '#fff',
    borderWidth: 1, borderColor: T.line,
  },
  boltIcon: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: T.dangerSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  bookAdhocTitle: { fontSize: 15, fontWeight: '700', color: T.text, marginTop: 20, letterSpacing: -0.2 },
  bookAdhocSub: { fontSize: 11.5, color: T.textSub, marginTop: 2 },

  weekRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
    paddingVertical: 12, gap: 12,
  },
  weekRowBorder: { borderBottomWidth: 0.5, borderBottomColor: T.lineSoft },
  weekDay: { width: 40, alignItems: 'center' },
  weekDayLabel: { fontSize: 10, fontWeight: '600', color: T.textMute, letterSpacing: 0.3 },
  weekDayNum: { fontSize: 18, fontWeight: '700', letterSpacing: -0.4, color: T.text },
  weekChips: { flex: 1, flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  statusLabel: { fontSize: 11, fontWeight: '600' },

  emptyState: {
    alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: T.brandSoft,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18, fontWeight: '700', color: T.text, letterSpacing: -0.3,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13, color: T.textSub, textAlign: 'center', lineHeight: 18,
    marginBottom: 20,
  },
  emptyActions: {
    width: '100%', gap: 10,
  },
});
