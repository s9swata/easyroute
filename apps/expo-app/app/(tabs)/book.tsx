import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

export default function BookScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={styles.title}>Book a cab</Text>
        <Text style={styles.sub}>Choose booking type</Text>
      </View>

      <View style={styles.cards}>
        <Pressable onPress={() => router.push('/roster')} style={styles.bigCard}>
          <View style={[styles.bigCardIcon, { backgroundColor: T.brandSoft }]}>
            <Icon name="calendar" size={32} color={T.brand} />
          </View>
          <Text style={styles.bigCardTitle}>Weekly roster</Text>
          <Text style={styles.bigCardSub}>
            Book for the whole week. Opens every Sunday — plan pickups and drops for Mon–Fri.
          </Text>
          <View style={styles.bigCardFooter}>
            <Text style={styles.bigCardBadge}>Shared cab · cost-effective</Text>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push('/adhoc')} style={styles.bigCard}>
          <View style={[styles.bigCardIcon, { backgroundColor: T.dangerSoft }]}>
            <Icon name="bolt" size={32} color={T.danger} />
          </View>
          <Text style={styles.bigCardTitle}>Ad-hoc cab</Text>
          <Text style={styles.bigCardSub}>
            Emergency or unplanned trip. Full cab for you only — requires manager approval.
          </Text>
          <View style={styles.bigCardFooter}>
            <Text style={[styles.bigCardBadge, { color: T.danger, backgroundColor: T.dangerSoft }]}>
              Full cab · billed to cost centre
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 }}>
        <Text style={styles.sectionTitle}>This week's roster</Text>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <Card padded={false}>
          {WEEK_SUMMARY.map((r, i) => (
            <View key={i} style={[styles.rosterRow, i < WEEK_SUMMARY.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: T.lineSoft }]}>
              <View style={{ width: 44 }}>
                <Text style={styles.dayLabel}>{r.day}</Text>
                <Text style={styles.dayNum}>{r.date}</Text>
              </View>
              <View style={{ flex: 1 }}>
                {r.wfh ? (
                  <Text style={{ fontSize: 13, color: T.textMute }}>Work from home</Text>
                ) : (
                  <View style={{ gap: 4 }}>
                    {r.pickup && <Text style={styles.rosterChip}>↑ {r.pickup}</Text>}
                    {r.drop && <Text style={[styles.rosterChip, { color: '#C45A16', backgroundColor: '#FFE9DD' }]}>↓ {r.drop}</Text>}
                  </View>
                )}
              </View>
              <Pressable onPress={() => router.push('/roster')}>
                <Icon name="edit" size={16} color={T.brand} />
              </Pressable>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const WEEK_SUMMARY = [
  { day: 'MON', date: '28', pickup: '9:00 AM', drop: '6:30 PM' },
  { day: 'TUE', date: '29', pickup: '9:00 AM', drop: '6:30 PM' },
  { day: 'WED', date: '30', drop: '11:00 PM' },
  { day: 'THU', date: '1', pickup: '9:00 AM', drop: '6:30 PM' },
  { day: 'FRI', date: '2', wfh: true },
];

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', color: T.text, letterSpacing: -0.6 },
  sub: { fontSize: 14, color: T.textSub, marginTop: 4 },
  cards: { paddingHorizontal: 16, gap: 12 },
  bigCard: {
    backgroundColor: '#fff', borderRadius: T.radiusLg, padding: 20,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  bigCardIcon: {
    width: 60, height: 60, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  bigCardTitle: { fontSize: 20, fontWeight: '700', color: T.text, letterSpacing: -0.4 },
  bigCardSub: { fontSize: 13, color: T.textSub, lineHeight: 19, marginTop: 6 },
  bigCardFooter: { marginTop: 16 },
  bigCardBadge: {
    fontSize: 12, fontWeight: '600', color: T.brand,
    backgroundColor: T.brandSoft, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 999, alignSelf: 'flex-start', overflow: 'hidden',
  } as any,
  sectionTitle: { fontSize: 15, fontWeight: '700', color: T.text, letterSpacing: -0.2 },
  rosterRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  dayLabel: { fontSize: 10, fontWeight: '600', color: T.textMute, letterSpacing: 0.3 },
  dayNum: { fontSize: 18, fontWeight: '700', color: T.text, letterSpacing: -0.4 },
  rosterChip: {
    fontSize: 12, fontWeight: '600', color: T.brand,
    backgroundColor: T.brandSoft, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 999, alignSelf: 'flex-start', overflow: 'hidden',
  } as any,
});
