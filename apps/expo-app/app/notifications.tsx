import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';

const TABS = ['All', 'Trips', 'Alerts'];

type Tone = 'brand' | 'success' | 'warn' | 'danger' | 'neutral';
type Category = 'trips' | 'alerts' | 'general';
type Group = 'today' | 'earlier';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: T.brandSoft, fg: T.brand },
  success: { bg: T.successSoft, fg: T.success },
  warn: { bg: T.warningSoft, fg: '#A06F00' },
  danger: { bg: T.dangerSoft, fg: T.danger },
  neutral: { bg: T.lineSoft, fg: T.textSub },
};

type NotifItem = {
  id: number;
  icon: string;
  tone: Tone;
  title: string;
  body: string;
  time: string;
  read: boolean;
  category: Category;
  group: Group;
  cta?: Array<{ label: string; primary?: boolean; onPress?: () => void }>;
};

const INITIAL_NOTIFICATIONS: NotifItem[] = [
  { id: 1, icon: 'car', tone: 'success', title: 'Driver on the way', body: 'Ramesh K. is 8 min away from Gate 3. Innova · KA‑01‑HG‑4821.', time: '2m', read: false, category: 'trips', group: 'today', cta: [{ label: 'Track live', primary: true }, { label: 'Call' }] },
  { id: 2, icon: 'lock', tone: 'brand', title: 'Login OTP ready', body: 'Your trip pin is 4827. Share only after verifying the plate number.', time: '4m', read: false, category: 'trips', group: 'today' },
  { id: 3, icon: 'shield', tone: 'warn', title: 'Night escort confirmed', body: 'Security escort assigned for your Wed 11:00 PM drop.', time: '1h', read: false, category: 'alerts', group: 'today' },
  { id: 4, icon: 'calendar', tone: 'brand', title: 'Roster window opens Sunday', body: 'Set your Apr 28 – May 4 shifts. Closes Sun 8 PM.', time: 'Sun', read: true, category: 'general', group: 'earlier', cta: [{ label: 'Set roster', primary: true }] },
  { id: 5, icon: 'check', tone: 'success', title: 'Trip completed', body: 'Drop to Uttarahalli · ₹0 · shared with 2 riders.', time: 'Mon', read: true, category: 'trips', group: 'earlier' },
  { id: 6, icon: 'info', tone: 'neutral', title: 'Cost centre updated', body: 'Your rides now bill to ENG‑Platform · BLR‑03.', time: 'Mon', read: true, category: 'alerts', group: 'earlier' },
  { id: 7, icon: 'bolt', tone: 'danger', title: 'Ad‑hoc approved', body: 'Savita R. approved your Fri 8:15 PM medical cab.', time: 'Fri', read: true, category: 'trips', group: 'earlier' },
];

function NotifRow({ item, onCtaPress }: { item: NotifItem; onCtaPress?: (label: string) => void }) {
  const t = TONES[item.tone];
  return (
    <View style={[styles.notifRow, !item.read && { backgroundColor: T.brandFaint }]}>
      {!item.read && <View style={styles.unreadDot} />}
      <View style={[styles.notifIcon, { backgroundColor: t.bg }]}>
        <Icon name={item.icon} size={19} color={t.fg} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.notifTitleRow}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
        <Text style={styles.notifBody}>{item.body}</Text>
        {item.cta && (
          <View style={styles.ctaRow}>
            {item.cta.map((c, i) => (
              <Pressable
                key={i}
                onPress={c.onPress ?? (() => onCtaPress?.(c.label))}
                style={[styles.ctaBtn, c.primary && styles.ctaBtnPrimary]}
                accessibilityRole="button"
              >
                <Text style={[styles.ctaText, c.primary && styles.ctaTextPrimary]}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState<NotifItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  function handleMarkRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    /* TODO: also call API to persist read state */
  }

  const tabCategories: (Category | null)[] = [null, 'trips', 'alerts'];
  const filtered = tab === 0
    ? notifications
    : notifications.filter(n => n.category === tabCategories[tab]);

  const todayItems = filtered.filter(n => n.group === 'today');
  const earlierItems = filtered.filter(n => n.group === 'earlier');

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
          <Text style={styles.headerTitle}>Notifications</Text>
          <Pressable onPress={handleMarkRead}>
            <Text style={styles.markRead}>Mark read</Text>
          </Pressable>
        </View>
        <Text style={styles.pageTitle}>Inbox</Text>
        <Text style={styles.pageSub}>{unreadCount} unread · cleared automatically after 30 days</Text>
      </View>

      <View style={styles.tabBar}>
        <View style={styles.tabContainer}>
          {TABS.map((t, i) => (
            <Pressable key={t} onPress={() => setTab(i)} style={[styles.tabItem, tab === i && styles.tabItemActive]}>
              <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {todayItems.length > 0 && (
        <>
          <Text style={styles.groupLabel}>TODAY</Text>
          <View style={styles.group}>
            {todayItems.map(item => (
              <NotifRow key={item.id} item={item} />
            ))}
          </View>
        </>
      )}

      {earlierItems.length > 0 && (
        <>
          <Text style={[styles.groupLabel, { marginTop: 16 }]}>EARLIER THIS WEEK</Text>
          <View style={styles.group}>
            {earlierItems.map(item => (
              <NotifRow key={item.id} item={item} />
            ))}
          </View>
        </>
      )}
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
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  markRead: { fontSize: 13, color: T.brand, fontWeight: '600' },
  pageTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6, color: T.text, marginTop: 16 },
  pageSub: { fontSize: 13, color: T.textSub, marginTop: 2 },

  tabBar: { paddingHorizontal: 16, paddingBottom: 12 },
  tabContainer: { flexDirection: 'row', gap: 4, padding: 4, backgroundColor: T.lineSoft, borderRadius: 12 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  tabItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: { fontSize: 13, fontWeight: '600', color: T.textSub },
  tabTextActive: { color: T.text },

  groupLabel: { fontSize: 11, fontWeight: '700', color: T.textMute, letterSpacing: 0.4, paddingHorizontal: 20, paddingBottom: 8 },
  group: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  notifRow: {
    flexDirection: 'row', gap: 12, padding: 14, paddingHorizontal: 16,
    borderBottomWidth: 0.5, borderBottomColor: T.lineSoft, position: 'relative',
    alignItems: 'flex-start',
  },
  unreadDot: {
    position: 'absolute', left: 6, top: 22,
    width: 6, height: 6, borderRadius: 3, backgroundColor: T.brand,
  },
  notifIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  notifTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2, color: T.text, flex: 1 },
  notifTime: { fontSize: 11, color: T.textMute, fontWeight: '500', flexShrink: 0 },
  notifBody: { fontSize: 12.5, color: T.textSub, lineHeight: 18, marginTop: 3 },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  ctaBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
    backgroundColor: '#fff', borderWidth: 1, borderColor: T.line,
  },
  ctaBtnPrimary: { backgroundColor: T.brand, borderColor: T.brand },
  ctaText: { fontSize: 12, fontWeight: '600', color: T.text },
  ctaTextPrimary: { color: '#fff' },
});
