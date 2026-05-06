import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

const REASONS = [
  'Change of plans',
  'Driver delayed',
  'Booked alternative transport',
  'Trip no longer needed',
  'Other',
];

export default function CancelTripScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const handleConfirm = () => {
    if (!selectedReason) return;
    setCancelled(true);
  };

  if (cancelled) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.successContent}>
          <View style={styles.checkCircle}>
            <Icon name="check" size={32} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Trip cancelled</Text>
          <Text style={styles.successSub}>Your cancellation has been processed.</Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Btn full onPress={() => router.replace('/(tabs)')}>
            Go to home
          </Btn>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: T.bg }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chev" size={16} color={T.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Cancel trip</Text>
          <View style={{ width: 36 }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {/* Trip summary */}
        <Card>
          <View style={styles.summaryHeader}>
            <Icon name="calendar" size={16} color={T.textSub} />
            <Text style={styles.summaryDate}>Today · 6:30 PM</Text>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeDots}>
              <View style={[styles.dot, { backgroundColor: T.brand }]} />
              <View style={styles.dash} />
              <View style={[styles.dot, styles.dotDrop]} />
            </View>
            <View style={styles.routeLabels}>
              <Text style={styles.routeText} numberOfLines={1}>
                Bellandur Gate
              </Text>
              <Text style={[styles.routeText, { marginTop: 18 }]} numberOfLines={1}>
                Electronic City Phase 1
              </Text>
            </View>
          </View>

          <View style={styles.typeRow}>
            <Text style={styles.typeLabel}>Type</Text>
            <Text style={styles.typeValue}>Shared · Drop</Text>
          </View>
        </Card>

        {/* Reason selection */}
        <Card>
          <Text style={styles.cardSectionLabel}>REASON FOR CANCELLATION</Text>
          <View style={{ gap: 6 }}>
            {REASONS.map((reason) => {
              const active = selectedReason === reason;
              return (
                <Pressable
                  key={reason}
                  style={[styles.reasonRow, active && styles.reasonRowActive]}
                  onPress={() => setSelectedReason(reason)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      active && { borderColor: T.brand },
                    ]}
                  >
                    {active && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.reasonText,
                      active && { color: T.ink, fontWeight: '700' },
                    ]}
                  >
                    {reason}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        {/* Confirmation area */}
        <View style={styles.confirmBlock}>
          <View style={styles.warningRow}>
            <Icon name="info" size={16} color={T.danger} />
            <Text style={styles.warningText}>This action cannot be undone.</Text>
          </View>
          <Btn
            variant="danger"
            full
            size="lg"
            onPress={handleConfirm}
            style={!selectedReason ? { opacity: 0.5 } : undefined}
          >
            Confirm cancellation
          </Btn>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '180deg' }],
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
  },
  cardSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: T.textSub,
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  summaryDate: {
    fontSize: 13,
    fontWeight: '600',
    color: T.textSub,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeDots: {
    alignItems: 'center',
    paddingTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotDrop: {
    backgroundColor: T.danger,
  },
  dash: {
    width: 2,
    height: 24,
    backgroundColor: T.line,
    marginVertical: 4,
  },
  routeLabels: {
    flex: 1,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '600',
    color: T.text,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: T.lineSoft,
  },
  typeLabel: {
    fontSize: 13,
    color: T.textSub,
  },
  typeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: T.radius,
  },
  reasonRowActive: {
    backgroundColor: T.brandSoft,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: T.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: T.brand,
  },
  reasonText: {
    fontSize: 15,
    color: T.text,
    fontWeight: '500',
    flex: 1,
  },
  confirmBlock: {
    marginTop: 8,
    gap: 14,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  warningText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.danger,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: T.textSub,
    textAlign: 'center',
  },
});
