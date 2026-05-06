import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';

const NAV = [
  { icon: 'home', label: 'Home', active: true },
  { icon: 'calendar', label: 'Book a cab', badge: 'Roster open' },
  { icon: 'history', label: 'My trips' },
  { icon: 'map', label: 'Live tracking' },
  { icon: 'users', label: 'Co-riders & teams' },
];

const SECONDARY = [
  { icon: 'bell', label: 'Notifications', count: 3, route: '/notifications' },
  { icon: 'shield', label: 'SOS & safety' },
  { icon: 'info', label: 'Help desk', route: '/help' },
  { icon: 'lock', label: 'T‑PIN & security' },
];

export default function SidebarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(15,20,40,0.35)', flexDirection: 'row' }}>
      {/* Drawer */}
      <View style={[styles.drawer, { paddingTop: insets.top }]}>
        {/* Account header */}
        <View style={styles.accountHeader}>
          <View style={styles.accountRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>PM</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accountName}>Priya Menon</Text>
              <Text style={styles.accountId}>HLX‑4821 · ENG‑Platform</Text>
            </View>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <Icon name="close" size={16} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>THIS WEEK</Text>
              <Text style={styles.statValue}>6 rides</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>CO2 SAVED</Text>
              <Text style={styles.statValue}>24.1 kg</Text>
            </View>
          </View>
        </View>

        {/* Nav */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 8, paddingTop: 12 }} showsVerticalScrollIndicator={false}>
          {NAV.map(n => (
            <Pressable
              key={n.label}
              onPress={() => router.back()}
              style={[styles.navItem, n.active && styles.navItemActive]}
            >
              <Icon name={n.icon} size={22} color={n.active ? T.brand : T.textSub} />
              <Text style={[styles.navLabel, n.active && styles.navLabelActive]}>{n.label}</Text>
              {n.badge && <Chip tone="warn">{n.badge}</Chip>}
              {n.active && <View style={styles.activeIndicator} />}
            </Pressable>
          ))}

          <View style={styles.divider} />

          {SECONDARY.map(n => (
            <Pressable
              key={n.label}
              onPress={() => n.route && router.push(n.route as any)}
              style={styles.navItem}
            >
              <Icon name={n.icon} size={22} color={T.textSub} />
              <Text style={styles.navLabel}>{n.label}</Text>
              {n.count != null && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{n.count}</Text>
                </View>
              )}
            </Pressable>
          ))}

          {/* Night escort toggle */}
          <View style={styles.toggle}>
            <View style={styles.toggleRow}>
              <Icon name="shield" size={18} color={T.brand} />
              <View style={{ flex: 1 }}>
                <Text style={styles.toggleTitle}>Night escort</Text>
                <Text style={styles.toggleSub}>Auto-enabled after 9 PM</Text>
              </View>
              <View style={styles.switch}>
                <View style={styles.switchThumb} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
          <Text style={styles.version}>EasyRoute v4.8</Text>
          <Pressable onPress={() => { /* TODO: call signOut() from auth context, then navigate to login */ }}>
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </View>
      </View>

      {/* Dimmed right side tap to dismiss */}
      <Pressable style={{ flex: 1 }} onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    width: '87%', backgroundColor: '#fff', flexDirection: 'column',
  },
  accountHeader: { backgroundColor: T.ink, paddingHorizontal: 20, paddingBottom: 18 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 16 },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  accountName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2, color: '#fff' },
  accountId: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  stat: { flex: 1, padding: 10, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10 },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: '600', letterSpacing: 0.3 },
  statValue: { fontSize: 14, fontWeight: '700', color: '#fff', marginTop: 2 },

  navItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 13, paddingHorizontal: 14, borderRadius: 12, marginBottom: 2 },
  navItemActive: { backgroundColor: T.brandSoft },
  navLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: T.text, letterSpacing: -0.2 },
  navLabelActive: { fontWeight: '700', color: T.brand },
  activeIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.brand },
  divider: { height: 1, backgroundColor: T.lineSoft, marginHorizontal: 12, marginVertical: 12 },
  badge: {
    minWidth: 20, height: 20, paddingHorizontal: 6, borderRadius: 10,
    backgroundColor: T.danger, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  toggle: { padding: 12, borderRadius: 14, backgroundColor: T.brandFaint, borderWidth: 1, borderColor: T.brandSoft, marginHorizontal: 6, marginBottom: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleTitle: { fontSize: 13, fontWeight: '700', color: T.text },
  toggleSub: { fontSize: 11, color: T.textSub, marginTop: 1 },
  switch: { width: 42, height: 26, borderRadius: 13, backgroundColor: T.brand, padding: 2, justifyContent: 'center', alignItems: 'flex-end' },
  switchThumb: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  footer: {
    paddingHorizontal: 20, paddingTop: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 0.5, borderTopColor: T.lineSoft,
  },
  version: { fontSize: 11, color: T.textMute },
  signOut: { fontSize: 12, color: T.danger, fontWeight: '600' },
});
