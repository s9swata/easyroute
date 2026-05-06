import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
import { Btn } from '@/components/ui/btn';

const CATEGORIES = [
  { icon: 'car', label: 'Trip issues', sub: 'Driver, route, OTP' },
  { icon: 'calendar', label: 'Roster', sub: 'Edit, cancel, rules' },
  { icon: 'shield', label: 'Safety', sub: 'SOS, escort' },
  { icon: 'lock', label: 'T‑PIN', sub: 'Reset, lockout' },
];

const FAQS = [
  { q: 'When does the roster window open?', a: 'Every Sunday from 6 AM to 8 PM for the upcoming week.' },
  { q: 'How do I cancel a confirmed ride?', a: 'Open the trip and tap Cancel. Charges apply after 30 min cutoff.' },
  { q: "What if the driver asks for the OTP before I board?", a: "Never share it. Verify the plate number, then share only after entering the cab." },
  { q: 'Who approves my ad‑hoc request?', a: "Your reporting manager. You'll get a push once approved." },
];

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleReply() {
    /* TODO: navigate to ticket reply screen */
  }

  function handleViewTicket() {
    /* TODO: navigate to ticket detail screen */
  }

  function handleCategoryPress(label: string) {
    /* TODO: router.push(`/help/category/${label}`) */
  }

  function handleFaqPress(q: string) {
    /* TODO: router.push to FAQ detail */
  }

  function handleCallMobilityDesk() {
    /* TODO: Linking.openURL('tel:+91...') or navigate to call screen */
  }

  function handleRaiseSOS() {
    router.push('/sos');
  }

  function handleNewTicket() {
    /* TODO: router.push('/tickets/new') */
  }

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
          <Text style={styles.headerTitle}>Help desk</Text>
          <View style={{ width: 36 }} />
        </View>
        <Text style={styles.pageTitle}>How can we help?</Text>

        {/* Search */}
        <View style={styles.search}>
          <Icon name="search" size={18} color={T.textMute} />
          <Text style={styles.searchPlaceholder}>Search articles, policies…</Text>
          <Chip tone="neutral">⌘K</Chip>
        </View>
      </View>

      {/* Active ticket */}
      <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
        <Card padded={false} style={{ padding: 14, backgroundColor: T.ink }}>
          <View style={styles.ticketStatusRow}>
            <View style={styles.ticketDot} />
            <Text style={styles.ticketStatus}>OPEN TICKET · #HD‑2841</Text>
          </View>
          <Text style={styles.ticketTitle}>Driver took longer route — Apr 18 drop</Text>
          <Text style={styles.ticketSub}>Agent Neha is reviewing · usually replies within 2 hrs</Text>
          <View style={styles.agentReply}>
            <Text style={styles.agentReplyText}>
              <Text style={{ fontWeight: '700', color: '#fff' }}>Neha · 1h ago{'\n'}</Text>
              Thanks Priya, we've pulled the trip logs. Can you confirm the detour was unapproved?
            </Text>
          </View>
          <View style={styles.ticketActions}>
            <Pressable style={styles.ticketBtn} onPress={handleReply}>
              <Text style={styles.ticketBtnText}>Reply</Text>
            </Pressable>
            <Pressable style={[styles.ticketBtn, { backgroundColor: 'rgba(255,255,255,0.06)' }]} onPress={handleViewTicket}>
              <Text style={styles.ticketBtnText}>View</Text>
            </Pressable>
          </View>
        </Card>
      </View>

      {/* Categories */}
      <Text style={styles.sectionLabel}>BROWSE TOPICS</Text>
      <View style={styles.categoriesGrid}>
        {CATEGORIES.map(c => (
          <Pressable key={c.label} onPress={() => handleCategoryPress(c.label)} accessibilityRole="button" style={styles.categoryCard}>
            <Card padded={false}>
              <View style={styles.categoryIcon}>
                <Icon name={c.icon} size={20} color={T.brand} />
              </View>
              <Text style={styles.categoryTitle}>{c.label}</Text>
              <Text style={styles.categorySub}>{c.sub}</Text>
            </Card>
          </Pressable>
        ))}
      </View>

      {/* FAQs */}
      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>FREQUENT QUESTIONS</Text>
      <View style={styles.faqGroup}>
        {FAQS.map((f, i) => (
          <Pressable
            key={f.q}
            onPress={() => handleFaqPress(f.q)}
            style={[styles.faqRow, i < FAQS.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: T.lineSoft }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.faqQ}>{f.q}</Text>
              <Text style={styles.faqA}>{f.a}</Text>
            </View>
            <Icon name="chev" size={15} color={T.textMute} />
          </Pressable>
        ))}
      </View>

      {/* CTAs */}
      <View style={{ paddingHorizontal: 16, paddingTop: 18 }}>
        <View style={styles.ctaGrid}>
          <Pressable onPress={handleCallMobilityDesk} accessibilityRole="button" accessibilityLabel="Call mobility desk">
            <Card padded={false} style={styles.ctaCard}>
              <Icon name="phone" size={22} color={T.brand} />
              <Text style={styles.ctaTitle}>Call mobility desk</Text>
              <Text style={styles.ctaSub}>24/7 · Helix internal</Text>
            </Card>
          </Pressable>
          <Pressable onPress={handleRaiseSOS} accessibilityRole="button" accessibilityLabel="Raise SOS">
            <Card padded={false} style={[styles.ctaCard, { backgroundColor: T.danger }]}>
              <Icon name="shield" size={22} color="#fff" />
              <Text style={[styles.ctaTitle, { color: '#fff' }]}>Raise SOS</Text>
              <Text style={[styles.ctaSub, { color: 'rgba(255,255,255,0.8)' }]}>Alerts security + manager</Text>
            </Card>
          </Pressable>
        </View>
        <Btn variant="dark" full size="lg" icon="edit" style={{ marginTop: 10 }} onPress={handleNewTicket}>New ticket</Btn>
      </View>
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
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: T.text },
  pageTitle: { fontSize: 26, fontWeight: '700', letterSpacing: -0.6, color: T.text, marginTop: 16 },
  search: {
    marginTop: 14, backgroundColor: '#fff', borderRadius: 14, padding: 12, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: T.textMute },

  ticketStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ticketDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F7C948' },
  ticketStatus: { fontSize: 11, fontWeight: '700', color: '#F7C948', letterSpacing: 0.3 },
  ticketTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginTop: 8, letterSpacing: -0.2 },
  ticketSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 },
  agentReply: {
    marginTop: 12, padding: 10, paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10,
  },
  agentReplyText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 18 },
  ticketActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  ticketBtn: {
    flex: 1, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999, alignItems: 'center',
  },
  ticketBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  sectionLabel: { fontSize: 11, fontWeight: '700', color: T.textMute, letterSpacing: 0.4, paddingHorizontal: 20, paddingBottom: 8 },
  categoriesGrid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { width: '48%' },
  categoryIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.brandSoft, alignItems: 'center', justifyContent: 'center' },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: T.text, marginTop: 22, letterSpacing: -0.2 },
  categorySub: { fontSize: 11.5, color: T.textSub, marginTop: 2 },

  faqGroup: {
    marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  faqRow: { padding: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12 },
  faqQ: { fontSize: 14, fontWeight: '600', color: T.text, letterSpacing: -0.2 },
  faqA: { fontSize: 12.5, color: T.textSub, marginTop: 4, lineHeight: 18 },

  ctaGrid: { flexDirection: 'row', gap: 10 },
  ctaCard: { flex: 1, padding: 14 },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: T.text, marginTop: 20 },
  ctaSub: { fontSize: 11.5, color: T.textSub, marginTop: 2 },
});
