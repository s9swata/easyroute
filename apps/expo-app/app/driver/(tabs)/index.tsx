import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

const RECENT_TRIPS = [
  {
    id: '1',
    time: '5:45 PM',
    route: 'Infosys Phase 2 → Prestige Lake Ridge',
    status: 'completed',
  },
  {
    id: '2',
    time: '8:00 AM',
    route: 'Koramangala 5th Block → Helix HQ',
    status: 'completed',
  },
  {
    id: '3',
    time: 'Yesterday',
    route: 'HSR Layout → Embassy TechVillage',
    status: 'completed',
  },
];

export default function DriverHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 16 }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.driverName}>Ramesh Kumar</Text>
          <Text style={styles.driverMeta}>
            KA-01-HG-4821 · Innova White
          </Text>
        </View>

        <Pressable
          onPress={() => setIsOnline((v) => !v)}
          style={styles.toggleWrap}
          hitSlop={16}
        >
          <Text
            style={[
              styles.statusLabel,
              { color: isOnline ? T.success : T.textMute },
            ]}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Text>
          <View
            style={[
              styles.toggleTrack,
              { backgroundColor: isOnline ? T.success : T.line },
            ]}
          >
            <View
              style={[
                styles.toggleThumb,
                { transform: [{ translateX: isOnline ? 22 : 2 }] },
              ]}
            />
          </View>
        </Pressable>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Card style={styles.statCard} padded>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Today's trips</Text>
        </Card>
        <Card style={styles.statCard} padded>
          <Text style={[styles.statNumber, { color: T.success }]}>2</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card style={styles.statCard} padded>
          <Text style={[styles.statNumber, { color: T.warning }]}>2</Text>
          <Text style={styles.statLabel}>Upcoming</Text>
        </Card>
      </View>

      {/* Current / Next Trip or Offline State */}
      {isOnline ? (
        <Card style={styles.tripCard} padded>
          <View style={styles.tripHeader}>
            <Chip tone="brand" icon="users">
              Shared · 3 riders
            </Chip>
            <Text style={styles.tripTime}>6:30 PM</Text>
          </View>

          <View style={styles.routeRow}>
            <Icon name="pin" size={18} color={T.brand} />
            <Text style={styles.routeText}>
              Helix HQ, Gate 3 → Prestige Lake Ridge
            </Text>
          </View>

          <View style={styles.employeeRow}>
            <Icon name="user" size={16} color={T.textSub} />
            <Text style={styles.employeeName}>Priya Menon</Text>
          </View>

          <View style={styles.actionRow}>
            <Btn
              variant="primary"
              size="md"
              icon="map"
              full
              onPress={() => router.push('/driver/trip/active')}
            >
              Navigate to pickup
            </Btn>
            <Btn
              variant="outline"
              size="md"
              icon="phone"
              full
              onPress={() => {}}
            >
              Call employee
            </Btn>
          </View>
        </Card>
      ) : (
        <Card style={styles.emptyCard} padded>
          <View style={styles.emptyContent}>
            <View style={styles.emptyIconCircle}>
              <Icon name="car" size={32} color={T.textMute} />
            </View>
            <Text style={styles.emptyTitle}>You're offline</Text>
            <Text style={styles.emptySubtitle}>
              Toggle online to start receiving trip requests
            </Text>
          </View>
        </Card>
      )}

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent trips</Text>
          <Pressable
            onPress={() => router.push('/driver/(tabs)/trips')}
            hitSlop={8}
          >
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        {RECENT_TRIPS.map((trip) => (
          <View key={trip.id} style={styles.tripRow}>
            <View style={styles.tripRowLeft}>
              <Text style={styles.tripRowTime}>{trip.time}</Text>
              <Text style={styles.tripRowRoute}>{trip.route}</Text>
            </View>
            <Chip tone="success" icon="check">
              Done
            </Chip>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    flex: 1,
  },
  driverName: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.4,
  },
  driverMeta: {
    fontSize: 13,
    color: T.textSub,
    marginTop: 2,
  },
  toggleWrap: {
    alignItems: 'center',
    gap: 6,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 88,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.6,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: T.textSub,
    marginTop: 4,
    textAlign: 'center',
  },
  tripCard: {
    gap: 14,
  },
  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripTime: {
    fontSize: 14,
    fontWeight: '600',
    color: T.text,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
    lineHeight: 20,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  employeeName: {
    fontSize: 14,
    color: T.textSub,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: T.lineSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: T.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: T.textMute,
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.3,
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: T.brand,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: T.card,
    borderRadius: T.radiusLg,
    padding: 14,
    borderWidth: 1,
    borderColor: T.lineSoft,
  },
  tripRowLeft: {
    flex: 1,
    gap: 2,
  },
  tripRowTime: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textMute,
  },
  tripRowRoute: {
    fontSize: 14,
    fontWeight: '500',
    color: T.text,
  },
});
