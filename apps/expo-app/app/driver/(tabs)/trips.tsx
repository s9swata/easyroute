import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';

type TripType = 'shared' | 'full';
type TripStatus = 'completed' | 'cancelled';
type FilterTab = 'all' | 'shared' | 'full';

interface Trip {
  id: number;
  time: string;
  date: string;
  type: TripType;
  riders: number;
  route: string;
  employee: string;
  distance: string;
  status: TripStatus;
  night?: boolean;
}

const TRIPS: Trip[] = [
  { id: 1, time: '6:30 PM', date: 'Mon, Apr 21', type: 'shared', riders: 3, route: 'Helix HQ → Uttarahalli', employee: 'Priya Menon', distance: '19.2 km', status: 'completed' },
  { id: 2, time: '9:00 AM', date: 'Mon, Apr 21', type: 'shared', riders: 2, route: 'Uttarahalli → Helix HQ', employee: 'Arjun Menon', distance: '19.2 km', status: 'completed' },
  { id: 3, time: '11:00 PM', date: 'Wed, Apr 23', type: 'shared', riders: 1, route: 'Helix HQ → Uttarahalli', employee: 'Priya Menon', distance: '19.2 km', status: 'completed', night: true },
  { id: 4, time: '8:15 PM', date: 'Fri, Apr 18', type: 'full', riders: 0, route: 'Helix HQ → Bangalore Hospital', employee: 'Savita R.', distance: '12.4 km', status: 'completed' },
  { id: 5, time: '6:30 PM', date: 'Thu, Apr 17', type: 'shared', riders: 4, route: 'Helix HQ → HSR Layout', employee: 'Vinay K.', distance: '8.5 km', status: 'completed' },
];

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'shared', label: 'Shared' },
  { key: 'full', label: 'Full cab' },
];

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filteredTrips = useMemo(() => {
    if (activeTab === 'all') return TRIPS;
    return TRIPS.filter((t) => t.type === activeTab);
  }, [activeTab]);

  const stats = useMemo(() => {
    const total = TRIPS.length;
    const shared = TRIPS.filter((t) => t.type === 'shared').length;
    const full = TRIPS.filter((t) => t.type === 'full').length;
    return { total, shared, full };
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trip history</Text>
          <Text style={styles.subtitle}>Week of Apr 21 – Apr 27</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Card padded style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total trips</Text>
          </Card>
          <Card padded style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.shared}</Text>
            <Text style={styles.statLabel}>Shared</Text>
          </Card>
          <Card padded style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.full}</Text>
            <Text style={styles.statLabel}>Full cab</Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <Card
                key={tab.key}
                padded={false}
                onPress={() => setActiveTab(tab.key)}
                style={isActive ? { ...styles.tabPill, ...styles.tabPillActive } : styles.tabPill}
              >
                <Text
                  style={isActive ? { ...styles.tabLabel, ...styles.tabLabelActive } : styles.tabLabel}
                >
                  {tab.label}
                </Text>
              </Card>
            );
          })}
        </View>

        {/* Trip List */}
        {filteredTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="clock" size={48} color={T.textMute} />
            <Text style={styles.emptyText}>No trips yet</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredTrips.map((trip) => (
              <Card key={trip.id} padded style={styles.tripCard}>
                {/* Top row: time + date + status */}
                <View style={styles.tripTopRow}>
                  <View style={styles.tripMeta}>
                    <Text style={styles.tripTime}>{trip.time}</Text>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                  </View>
                  <Chip tone="success" icon="check">
                    Completed
                  </Chip>
                </View>

                {/* Type chip */}
                <View style={styles.typeRow}>
                  {trip.type === 'shared' ? (
                    <Chip tone="brand" icon="users">
                      Shared · {trip.riders} riders
                    </Chip>
                  ) : (
                    <Chip tone="neutral" icon="car">
                      Full cab
                    </Chip>
                  )}
                  {trip.night && (
                    <Chip tone="dark" icon="clock" style={styles.nightChip}>
                      Night
                    </Chip>
                  )}
                </View>

                {/* Route */}
                <View style={styles.routeRow}>
                  <Icon name="pin" size={16} color={T.brand} />
                  <Text style={styles.routeText}>{trip.route}</Text>
                </View>

                {/* Bottom row: employee + distance */}
                <View style={styles.tripBottomRow}>
                  <View style={styles.employeeRow}>
                    <Icon name="user" size={14} color={T.textMute} />
                    <Text style={styles.employeeText}>{trip.employee}</Text>
                  </View>
                  <View style={styles.distanceRow}>
                    <Icon name="map" size={14} color={T.textMute} />
                    <Text style={styles.distanceText}>{trip.distance}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: T.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: T.textSub,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: T.ink,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: T.textSub,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: T.card,
    borderWidth: 1,
    borderColor: T.line,
  },
  tabPillActive: {
    backgroundColor: T.ink,
    borderColor: T.ink,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: T.textSub,
  },
  tabLabelActive: {
    color: '#fff',
  },
  list: {
    gap: 12,
  },
  tripCard: {
    gap: 10,
  },
  tripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tripMeta: {
    gap: 2,
  },
  tripTime: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  tripDate: {
    fontSize: 13,
    color: T.textSub,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  nightChip: {
    marginLeft: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    color: T.text,
    flex: 1,
  },
  tripBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.lineSoft,
    marginTop: 2,
  },
  employeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  employeeText: {
    fontSize: 13,
    color: T.textSub,
    fontWeight: '500',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: T.textMute,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: T.textMute,
  },
});
