import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

function Row({
  label,
  value,
  icon,
  last,
  onPress,
  extra,
}: {
  label: string;
  value: string;
  icon?: string;
  last?: boolean;
  onPress?: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <Pressable
      style={[styles.row, !last && styles.rowBorder]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      {icon && (
        <View style={styles.rowIcon}>
          <Icon name={icon} size={18} color={T.brand} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {extra}
      <Icon name="chev" size={16} color={T.textMute} />
    </Pressable>
  );
}

export default function DriverProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 16 }}>
        <View style={styles.headerRow}>
          <View style={{ width: 36 }} />
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable>
            <Text style={styles.editBtn}>Edit</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>RK</Text>
        </View>
        <Text style={styles.name}>Ramesh Kumar</Text>
        <Text style={styles.role}>Driver ID · DRV-2841</Text>
        <View style={styles.badgeRow}>
          <Chip tone="dark" icon="star">
            4.9
          </Chip>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
      </View>

      <Section label="VEHICLE DETAILS">
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleIcon}>
            <Icon name="car" size={20} color={T.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.vehicleTitle}>Toyota Innova · White</Text>
            <Text style={styles.vehicleMeta}>SUV · 6 seater</Text>
          </View>
        </View>
        <View style={[styles.vehicleRow, styles.rowBorder]}>
          <Text style={styles.vehicleRowLabel}>Registration</Text>
          <Text style={styles.vehicleRowValue}>KA-01-HG-4821</Text>
        </View>
        <View style={styles.vehicleRow}>
          <Text style={styles.vehicleRowLabel}>Last inspected</Text>
          <Text style={styles.vehicleRowValue}>Apr 15, 2026</Text>
        </View>
      </Section>

      <Section label="CONTACT">
        <Row icon="phone" label="Phone" value="+91 98765 12340" />
        <Row icon="shield" label="Emergency contact" value="Suresh Kumar · +91 99876 54321" last />
      </Section>

      <Section label="DOCUMENTS">
        <Row
          icon="check"
          label="Driver's license"
          value="Valid"
          extra={<Chip tone="success" icon="check">Valid</Chip>}
        />
        <Row
          icon="check"
          label="Vehicle permit"
          value="Valid"
          extra={<Chip tone="success" icon="check">Valid</Chip>}
        />
        <Row
          icon="info"
          label="Insurance"
          value="Expires May 15"
          last
          extra={<Chip tone="warn" icon="info">Expires soon</Chip>}
        />
      </Section>

      <Section label="STATS">
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,247</Text>
            <Text style={styles.statLabel}>Total trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Mar 2023</Text>
            <Text style={styles.statLabel}>Member since</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>94%</Text>
            <Text style={styles.statLabel}>Acceptance rate</Text>
          </View>
        </View>
      </Section>

      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Btn variant="outline" full style={{ borderColor: T.dangerSoft }}>
          <Text style={{ color: T.danger, fontSize: 16, fontWeight: '600' }}>Sign out</Text>
        </Btn>
        <Text style={styles.version}>EasyRoute v4.8 · Helix Mobility</Text>
      </View>
    </ScrollView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Card padded={false}>{children}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  editBtn: { fontSize: 13, color: T.brand, fontWeight: '600' },

  identity: { alignItems: 'center', paddingVertical: 4, paddingHorizontal: 16 },
  avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 6,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 30 },
  name: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5, color: T.text, marginTop: 12 },
  role: { fontSize: 13, color: T.textSub, marginTop: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: T.successSoft, borderRadius: 999,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.success },
  statusText: { fontSize: 11, fontWeight: '700', color: T.success, letterSpacing: 0.2 },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: T.textMute, letterSpacing: 0.4, marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: T.lineSoft },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 12, color: T.textSub, fontWeight: '500' },
  rowValue: { fontSize: 15, fontWeight: '600', marginTop: 2, letterSpacing: -0.2, color: T.text },

  vehicleHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16, borderBottomWidth: 0.5, borderBottomColor: T.lineSoft },
  vehicleIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  vehicleTitle: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2, color: T.text },
  vehicleMeta: { fontSize: 12, color: T.textSub, fontWeight: '500', marginTop: 2 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, paddingHorizontal: 16 },
  vehicleRowLabel: { fontSize: 12, color: T.textSub, fontWeight: '500' },
  vehicleRowValue: { fontSize: 15, fontWeight: '600', letterSpacing: -0.2, color: T.text },

  statsGrid: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 17, fontWeight: '700', color: T.text, letterSpacing: -0.3 },
  statLabel: { fontSize: 12, color: T.textSub, fontWeight: '500', marginTop: 4 },
  statDivider: { width: 0.5, height: 32, backgroundColor: T.lineSoft },

  version: { textAlign: 'center', fontSize: 11, color: T.textMute, marginTop: 16 },
});
