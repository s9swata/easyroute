import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

function Row({ label, value, icon, last, onPress }: { label: string; value: string; icon?: string; last?: boolean; onPress?: () => void }) {
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
      <Icon name="chev" size={16} color={T.textMute} />
    </Pressable>
  );
}

export default function ProfileScreen() {
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
          <Pressable><Text style={styles.editBtn}>Edit</Text></Pressable>
        </View>
      </View>

      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PM</Text>
        </View>
        <Text style={styles.name}>Priya Menon</Text>
        <Text style={styles.role}>Senior Product Engineer · Helix</Text>
        <View style={styles.eligibleBadge}>
          <View style={styles.eligibleDot} />
          <Text style={styles.eligibleText}>ELIGIBLE · NIGHT ESCORT</Text>
        </View>
      </View>

      <Section label="EMPLOYEE DETAILS">
        <Row icon="user" label="Employee ID" value="HLX-4821" />
        <Row icon="phone" label="Phone" value="+91 98765 43210" />
        <Row icon="building" label="Cost centre" value="ENG-Platform · BLR-03" last />
      </Section>

      <Section label="LOCATIONS">
        <Row icon="building" label="Office" value="Helix HQ · Bellandur" />
        <Row icon="home" label="Default pickup" value="Prestige Lake Ridge, Uttarahalli" />
        <Row icon="pin" label="Saved stops" value="2 places" last onPress={() => router.push('/saved-locations')} />
      </Section>

      <Section label="SECURITY">
        <Pressable
          style={[styles.row, styles.rowBorder]}
          onPress={() => router.push('/tpin-settings')}
          accessibilityRole="button"
          accessibilityLabel="T-PIN Trip security, Set"
        >
          <View style={[styles.rowIcon, { backgroundColor: T.ink }]}>
            <Icon name="lock" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>T-PIN · Trip security</Text>
            <Text style={[styles.rowValue, { letterSpacing: 2, fontFamily: 'monospace' }]}>• • • •</Text>
          </View>
          <Chip tone="success" icon="check">Set</Chip>
          <Icon name="chev" size={16} color={T.textMute} />
        </Pressable>
        <Row icon="shield" label="Emergency contact" value="Arjun Menon · +91 99876 54321" />
        <Row icon="users" label="Trusted co-riders" value="4 teammates" last />
      </Section>

      <Section label="PREFERENCES">
        <Row icon="bell" label="Notifications" value="Allocation, OTP & driver" />
        <Row icon="calendar" label="Default roster" value="Mon–Thu · 9 AM / 6:30 PM" last />
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
  eligibleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: T.successSoft, borderRadius: 999, marginTop: 10,
  },
  eligibleDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.success },
  eligibleText: { fontSize: 11, fontWeight: '700', color: T.success, letterSpacing: 0.2 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: T.textMute, letterSpacing: 0.4, marginBottom: 8, marginLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: T.lineSoft },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 12, color: T.textSub, fontWeight: '500' },
  rowValue: { fontSize: 15, fontWeight: '600', marginTop: 2, letterSpacing: -0.2, color: T.text },
  version: { textAlign: 'center', fontSize: 11, color: T.textMute, marginTop: 16 },
});
