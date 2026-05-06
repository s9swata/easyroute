import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T, SHIFTS } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

const DAYS = [
  { key: 'mon', label: 'Mon', date: 28 },
  { key: 'tue', label: 'Tue', date: 29 },
  { key: 'wed', label: 'Wed', date: 30 },
  { key: 'thu', label: 'Thu', date: 1 },
  { key: 'fri', label: 'Fri', date: 2 },
  { key: 'sat', label: 'Sat', date: 3, weekend: true },
  { key: 'sun', label: 'Sun', date: 4, weekend: true },
];

const PICKUP_OPTS = [
  { id: 'p9', time: '9:00 AM', label: 'Standard', eta: '~45 min' },
  { id: 'p10', time: '10:30 AM', label: 'Flex', eta: '~50 min' },
];

const DROP_OPTS = [
  { id: 'd18', time: '6:30 PM', label: 'Standard', eta: '1h 10m' },
  { id: 'd21', time: '9:00 PM', label: 'Late', eta: '55 min' },
  { id: 'd23', time: '11:00 PM', label: 'Night · escort', eta: '45 min', safety: true },
];

type DayState = { pickup?: string | null; drop?: string | null; wfh?: boolean };

const INITIAL: Record<string, DayState> = {
  mon: { pickup: 'p9', drop: 'd18' },
  tue: { pickup: 'p9', drop: 'd18' },
  wed: { pickup: null, drop: 'd23' },
  thu: { pickup: 'p9', drop: 'd18' },
  fri: { wfh: true },
  sat: {}, sun: {},
};

export default function RosterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sel, setSel] = useState<Record<string, DayState>>(INITIAL);
  const [expandedDay, setExpandedDay] = useState<string | null>('wed');

  const shiftOf = (id: string) => SHIFTS.find(s => s.id === id);

  const totalRides = DAYS.reduce((acc, d) => {
    const s = sel[d.key] || {};
    if (s.wfh) return acc;
    return acc + (s.pickup ? 1 : 0) + (s.drop ? 1 : 0);
  }, 0);

  function updateDay(dayKey: string, patch: Partial<DayState>) {
    setSel(prev => ({
      ...prev,
      [dayKey]: { ...(prev[dayKey] || {}), ...patch },
    }));
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 12 }}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Icon name="chev" size={16} color={T.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Weekly roster</Text>
            <Pressable onPress={() => { /* TODO: fetch last week's roster and apply to sel */ }}>
              <Text style={styles.copyBtn}>Copy last week</Text>
            </Pressable>
          </View>
          <Text style={styles.weekLabel}>Week of Apr 28 – May 4</Text>
          <Text style={styles.bigTitle}>Set your shifts</Text>
          <Text style={styles.hint}>
            Tap a day to set pickup and drop times. Closes{' '}
            <Text style={{ color: T.text, fontWeight: '700' }}>Sun 8:00 PM</Text>.
          </Text>
        </View>

        {/* Day cards */}
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {DAYS.map(d => {
            const s = sel[d.key] || {};
            const isExpanded = expandedDay === d.key;
            const pickupShift = s.pickup ? shiftOf(s.pickup) : null;
            const dropShift = s.drop ? shiftOf(s.drop) : null;

            return (
              <Card key={d.key} padded={false} style={isExpanded ? styles.dayCardActive : undefined}>
                {/* Collapsed / header row */}
                <Pressable onPress={() => setExpandedDay(isExpanded ? null : d.key)}>
                  <View style={styles.dayHeader}>
                    <View style={{ width: 48 }}>
                      <Text style={styles.dayName}>{d.label}</Text>
                      <Text style={styles.dayNum}>{d.date}</Text>
                    </View>

                    {s.wfh ? (
                      <View style={styles.wfhBadge}>
                        <Icon name="home" size={14} color={T.textMute} />
                        <Text style={styles.wfhText}>Work from home</Text>
                      </View>
                    ) : (
                      <View style={{ flex: 1, gap: 5 }}>
                        {/* Pickup row */}
                        <View style={styles.legRow}>
                          <View style={[styles.legDot, { backgroundColor: T.brand }]} />
                          <Text style={styles.legLabel}>Pickup</Text>
                          {pickupShift ? (
                            <Text style={styles.legTime}>{pickupShift.time}</Text>
                          ) : (
                            <Text style={styles.legNotSet}>Not set</Text>
                          )}
                        </View>
                        {/* Drop row */}
                        <View style={styles.legRow}>
                          <View style={[styles.legDot, { backgroundColor: T.ink }]} />
                          <Text style={styles.legLabel}>Drop</Text>
                          {dropShift ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={styles.legTime}>{dropShift.time}</Text>
                              {(dropShift as any).nightSafety && (
                                <Chip tone="warn" icon="shield" style={{ paddingHorizontal: 6, paddingVertical: 1 }}>Escort</Chip>
                              )}
                            </View>
                          ) : (
                            <Text style={styles.legNotSet}>Not set</Text>
                          )}
                        </View>
                      </View>
                    )}

                    <View style={{ marginLeft: 8 }}>
                      <Icon name={isExpanded ? 'chevDown' : 'chev'} size={16} color={T.textMute} />
                    </View>
                  </View>
                </Pressable>

                {/* Expanded picker */}
                {isExpanded && (
                  <View style={styles.pickerBody}>
                    {/* WFH toggle */}
                    <View style={styles.wfhToggleRow}>
                      <Text style={styles.wfhToggleLabel}>Work from home</Text>
                      <Switch
                        value={!!s.wfh}
                        onValueChange={(v) => updateDay(d.key, { wfh: v, pickup: null, drop: null })}
                        trackColor={{ false: T.line, true: T.brand }}
                        thumbColor="#fff"
                      />
                    </View>

                    {!s.wfh && (
                      <>
                        {/* Pickup options */}
                        <Text style={styles.pickerSectionLabel}>Pickup time</Text>
                        <View style={styles.optionsList}>
                          <Pressable
                            onPress={() => updateDay(d.key, { pickup: null })}
                            style={[styles.optionRow, !s.pickup && styles.optionRowSelected]}
                          >
                            <Text style={[styles.optionTime, !s.pickup && styles.optionTimeSelected]}>—</Text>
                            <Text style={[styles.optionMeta, !s.pickup && styles.optionMetaSelected]}>No pickup</Text>
                          </Pressable>
                          {PICKUP_OPTS.map(o => {
                            const selected = s.pickup === o.id;
                            return (
                              <Pressable
                                key={o.id}
                                onPress={() => updateDay(d.key, { pickup: o.id })}
                                style={[styles.optionRow, selected && styles.optionRowSelected]}
                              >
                                <Text style={[styles.optionTime, selected && styles.optionTimeSelected]}>{o.time}</Text>
                                <Text style={[styles.optionMeta, selected && styles.optionMetaSelected]}>{o.label} · {o.eta}</Text>
                              </Pressable>
                            );
                          })}
                        </View>

                        {/* Drop options */}
                        <Text style={styles.pickerSectionLabel}>Drop time</Text>
                        <View style={styles.optionsList}>
                          <Pressable
                            onPress={() => updateDay(d.key, { drop: null })}
                            style={[styles.optionRow, !s.drop && styles.optionRowSelected]}
                          >
                            <Text style={[styles.optionTime, !s.drop && styles.optionTimeSelected]}>—</Text>
                            <Text style={[styles.optionMeta, !s.drop && styles.optionMetaSelected]}>No drop</Text>
                          </Pressable>
                          {DROP_OPTS.map(o => {
                            const selected = s.drop === o.id;
                            return (
                              <Pressable
                                key={o.id}
                                onPress={() => updateDay(d.key, { drop: o.id })}
                                style={[styles.optionRow, selected && styles.optionRowSelected]}
                              >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                  <Text style={[styles.optionTime, selected && styles.optionTimeSelected]}>{o.time}</Text>
                                  {o.safety && <Chip tone="warn" icon="shield" style={{ paddingHorizontal: 6, paddingVertical: 1 }}>Escort</Chip>}
                                </View>
                                <Text style={[styles.optionMeta, selected && styles.optionMetaSelected]}>{o.label} · {o.eta}</Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </>
                    )}
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* Night warning */}
        <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
          <View style={styles.nightWarn}>
            <Icon name="shield" size={18} color="#A06F00" />
            <Text style={styles.nightWarnText}>
              Drops after 9 PM include a mandatory security escort for female employees.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>WEEK TOTAL</Text>
          <Text style={styles.totalValue}>{totalRides} rides · Shared</Text>
        </View>
        <Btn variant="primary" size="lg" onPress={() => {
          /* TODO: call saveRoster(sel) API, then router.back() on success */
          router.back();
        }}>Confirm roster</Btn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  copyBtn: { fontSize: 13, color: T.brand, fontWeight: '600' },
  weekLabel: { fontSize: 12, color: T.textSub, fontWeight: '500' },
  bigTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6, color: T.text, marginTop: 2 },
  hint: { fontSize: 13, color: T.textSub, marginTop: 4, lineHeight: 19 },

  dayCardActive: { borderWidth: 2, borderColor: T.brand },
  dayHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 14, paddingHorizontal: 16, gap: 12,
  },
  dayName: { fontSize: 12, fontWeight: '700', color: T.textMute, letterSpacing: 0.3 },
  dayNum: { fontSize: 20, fontWeight: '700', color: T.text, letterSpacing: -0.4, marginTop: 2 },

  wfhBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: T.lineSoft, borderRadius: 999, alignSelf: 'center',
  },
  wfhText: { fontSize: 13, fontWeight: '600', color: T.textSub },

  legRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legDot: { width: 8, height: 8, borderRadius: 4 },
  legLabel: { fontSize: 12, fontWeight: '600', color: T.textSub, width: 48 },
  legTime: { fontSize: 14, fontWeight: '700', color: T.text },
  legNotSet: { fontSize: 14, fontWeight: '500', color: T.textMute, fontStyle: 'italic' },

  pickerBody: {
    borderTopWidth: 0.5, borderTopColor: T.lineSoft,
    padding: 14, paddingHorizontal: 16,
  },
  wfhToggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: 12, marginBottom: 10, borderBottomWidth: 0.5, borderBottomColor: T.lineSoft,
  },
  wfhToggleLabel: { fontSize: 15, fontWeight: '600', color: T.text },

  pickerSectionLabel: {
    fontSize: 11, fontWeight: '700', color: T.textMute, letterSpacing: 0.3, marginTop: 10, marginBottom: 6,
  },
  optionsList: { gap: 6 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10,
    borderWidth: 1, borderColor: T.lineSoft, backgroundColor: '#FAFBFE',
  },
  optionRowSelected: {
    borderColor: T.brand, backgroundColor: T.brandFaint,
  },
  optionTime: { fontSize: 14, fontWeight: '700', color: T.text, minWidth: 64 },
  optionTimeSelected: { color: T.brand },
  optionMeta: { fontSize: 12, color: T.textSub },
  optionMetaSelected: { color: T.brand, fontWeight: '600' },

  nightWarn: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    padding: 12, paddingHorizontal: 14, backgroundColor: T.warningSoft, borderRadius: 12,
  },
  nightWarnText: { flex: 1, fontSize: 12, color: '#7A5400', lineHeight: 18 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: T.line,
    paddingHorizontal: 16, paddingTop: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  totalLabel: { fontSize: 11, color: T.textMute, fontWeight: '600', letterSpacing: 0.3 },
  totalValue: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3, color: T.text },
});
