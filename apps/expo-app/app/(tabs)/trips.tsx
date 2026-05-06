import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';

const TABS = ['Upcoming', 'Past', 'Cancelled'];

const UPCOMING = [
  { id: 1, date: 'Today', time: '6:30 PM', type: 'Drop · Shared', status: 'confirmed', statusLabel: 'Confirmed', driver: 'Ramesh K.', plate: 'KA-01-HG-4821', dest: 'Uttarahalli', variant: 'confirmed' },
  { id: 2, date: 'Wed, Apr 23', time: '11:00 PM', type: 'Drop · Night escort', status: 'allocated', statusLabel: 'Allocated', driver: 'Suresh P.', plate: 'KA-05-MB-2210', dest: 'Uttarahalli', night: true, variant: 'allocated' },
  { id: 3, date: 'Thu, Apr 24', time: '9:00 AM', type: 'Pickup · Shared', status: 'waiting', statusLabel: 'Waiting', driver: '—', plate: 'Pending allocation', dest: 'Helix HQ', variant: 'waiting' },
];

const PAST = [
  { id: 4, date: 'Mon, Apr 21', time: '6:30 PM', type: 'Drop · Shared', status: 'done', statusLabel: 'Completed', driver: 'Imran A.', plate: 'KA-03-FF-9044', dest: 'Uttarahalli', variant: 'confirmed' },
  { id: 5, date: 'Mon, Apr 21', time: '9:00 AM', type: 'Pickup · Shared', status: 'done', statusLabel: 'Completed', driver: 'Imran A.', plate: 'KA-03-FF-9044', dest: 'Helix HQ', variant: 'confirmed' },
  { id: 6, date: 'Fri, Apr 18', time: '8:15 PM', type: 'Ad-hoc · Full cab', status: 'done', statusLabel: 'Completed', driver: 'Vinay R.', plate: 'KA-02-TG-7781', dest: 'Bangalore Hospital', variant: 'confirmed' },
];

function toneFor(status: string) {
  if (status === 'confirmed' || status === 'done') return 'success';
  if (status === 'allocated') return 'brand';
  if (status === 'waiting') return 'warn';
  return 'neutral';
}

export default function TripsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);
  const rows = tab === 0 ? UPCOMING : tab === 1 ? PAST : [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={styles.title}>My trips</Text>
        <Text style={styles.sub}>Week of Apr 21 – Apr 27</Text>
      </View>

      <View style={styles.tabBar}>
        <View style={styles.tabContainer}>
          {TABS.map((t, i) => (
            <Pressable key={t} onPress={() => setTab(i)} style={[styles.tab, tab === i && styles.tabActive]}>
              <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {rows.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🎟️</Text>
          <Text style={styles.emptyText}>No cancelled trips</Text>
        </View>
      )}

      <View style={styles.list}>
        {rows.map(r => (
          <Card key={r.id} padded={false} onPress={() => router.push(`/status/${r.variant}`)}>
            <View style={styles.tripHeader}>
              <View>
                <Text style={styles.tripDate}>{r.date}</Text>
                <Text style={styles.tripTime}>{r.time}</Text>
                <Text style={styles.tripType}>{r.type}</Text>
              </View>
              <Chip
                tone={toneFor(r.status) as any}
                icon={r.status === 'confirmed' || r.status === 'done' ? 'check' : r.status === 'allocated' ? 'car' : r.status === 'waiting' ? 'clock' : undefined}
              >
                {r.statusLabel}
              </Chip>
            </View>
            <View style={styles.tripVehicle}>
              <View style={styles.vehicleIcon}>
                <Icon name={(r as any).night ? 'shield' : 'car'} size={18} color={T.text} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.vehicleDest} numberOfLines={1}>→ {r.dest}</Text>
                <Text style={styles.vehicleInfo}>{r.driver} · {r.plate}</Text>
              </View>
              <Icon name="chev" size={16} color={T.textMute} />
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', color: T.text, letterSpacing: -0.6 },
  sub: { fontSize: 13, color: T.textSub, marginTop: 4 },
  tabBar: { paddingHorizontal: 16, paddingBottom: 14 },
  tabContainer: {
    flexDirection: 'row', gap: 4, padding: 4,
    backgroundColor: T.lineSoft, borderRadius: 12,
  },
  tab: {
    flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: T.textSub },
  tabTextActive: { color: T.text },
  empty: { padding: 60, alignItems: 'center' },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 15, fontWeight: '600', color: T.textSub, marginTop: 4 },
  list: { paddingHorizontal: 16, gap: 10 },
  tripHeader: {
    padding: 14, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'flex-start', justifyContent: 'space-between',
  },
  tripDate: { fontSize: 12, color: T.textSub, fontWeight: '500' },
  tripTime: { fontSize: 20, fontWeight: '700', letterSpacing: -0.4, color: T.text, marginTop: 2 },
  tripType: { fontSize: 12, color: T.textSub, marginTop: 2 },
  tripVehicle: {
    marginHorizontal: 12, marginBottom: 12, backgroundColor: T.cardAlt,
    borderRadius: 12, padding: 10, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  vehicleIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.line,
  },
  vehicleDest: { fontSize: 13, fontWeight: '600', color: T.text },
  vehicleInfo: { fontSize: 11.5, color: T.textSub, marginTop: 1 },
});
