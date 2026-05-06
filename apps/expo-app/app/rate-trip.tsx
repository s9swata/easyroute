import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { Icon } from '@/components/ui/icon';
import { Btn } from '@/components/ui/btn';
import { Card } from '@/components/ui/card';

const QUICK_TAGS = [
  'Driver was punctual',
  'Vehicle was clean',
  'Safe driving',
  'Driver was late',
  'Route was longer',
  'Vehicle not clean',
];

const STAR_COUNT = 5;

export default function RateTripScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [rating, setRating] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (submitted) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [submitted, fadeAnim]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
  }, [rating, router]);

  if (submitted) {
    return (
      <View style={[styles.thankYouContainer, { paddingTop: insets.top + 120, paddingBottom: insets.bottom + 24 }]}>
        <Animated.View style={[styles.checkCircle, { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }]}>
          <Icon name="check" size={48} color="#fff" />
        </Animated.View>
        <Animated.Text style={[styles.thankYouTitle, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
          Thank you!
        </Animated.Text>
        <Animated.Text style={[styles.thankYouSub, { opacity: fadeAnim }]}>
          Your feedback helps us improve every ride.
        </Animated.Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: T.bg }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <Text style={styles.headerTitle}>How was your trip?</Text>
          <Text style={styles.headerSub}>Rate your experience to help us serve you better.</Text>
        </View>

        {/* Trip Summary Card */}
        <View style={styles.section}>
          <Card padded style={{ gap: 16 }}>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Icon name="user" size={22} color={T.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.driverName}>Ramesh K.</Text>
                <Text style={styles.vehicleInfo}>Toyota Innova · White</Text>
                <Text style={styles.plateInfo}>KA-01-HG-4821</Text>
              </View>
            </View>

            <View style={styles.routeRow}>
              <View style={styles.routeLine}>
                <View style={styles.dotBlue} />
                <View style={styles.dashedLine} />
                <View style={styles.dotDark} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 12 }}>
                  <Text style={styles.routeLabel}>PICKUP</Text>
                  <Text style={styles.routeValue}>Helix HQ, Gate 3 · Bellandur</Text>
                </View>
                <View>
                  <Text style={styles.routeLabel}>DROP</Text>
                  <Text style={styles.routeValue}>Prestige Lake Ridge · Uttarahalli</Text>
                </View>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="calendar" size={14} color={T.textMute} />
                <Text style={styles.metaText}>Tue, 22 Apr</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Icon name="clock" size={14} color={T.textMute} />
                <Text style={styles.metaText}>6:30 PM</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your rating</Text>
          <View style={styles.starsRow}>
            {Array.from({ length: STAR_COUNT }, (_, i) => {
              const index = i + 1;
              const filled = index <= rating;
              return (
                <Pressable
                  key={index}
                  onPress={() => setRating(index)}
                  style={styles.starBtn}
                  accessibilityLabel={`Rate ${index} star${index > 1 ? 's' : ''}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filled }}
                >
                  <Icon
                    name={filled ? 'star' : 'star-outline'}
                    size={36}
                    color={filled ? T.warning : T.textMute}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Quick Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick feedback</Text>
          <View style={styles.tagsWrap}>
            {QUICK_TAGS.map((tag) => {
              const selected = selectedTags.has(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tag,
                    { backgroundColor: selected ? T.brandSoft : T.lineSoft },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: selected ? T.brand : T.textSub },
                    ]}
                  >
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Comment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional comments</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Anything else? (optional)"
              placeholderTextColor={T.textMute}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
              maxLength={500}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>
        </View>

        {/* Submit */}
        <View style={[styles.section, { marginTop: 8 }]}>
          <Btn
            full
            size="lg"
            variant="primary"
            onPress={handleSubmit}
            icon="check"
            disabled={rating === 0}
          >
            Submit feedback
          </Btn>
          {rating === 0 && (
            <Text style={styles.hint}>Please select a star rating to continue.</Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.6,
  },
  headerSub: {
    fontSize: 14,
    color: T.textSub,
    marginTop: 6,
    fontWeight: '500',
  },

  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text,
  },
  vehicleInfo: {
    fontSize: 13,
    fontWeight: '500',
    color: T.textSub,
    marginTop: 1,
  },
  plateInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: T.textMute,
    marginTop: 1,
  },

  routeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  routeLine: {
    alignItems: 'center',
    paddingTop: 4,
  },
  dotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: T.brand,
  },
  dashedLine: {
    width: 2,
    flex: 1,
    backgroundColor: T.line,
    marginVertical: 3,
  },
  dotDark: {
    width: 10,
    height: 10,
    backgroundColor: T.ink,
  },
  routeLabel: {
    fontSize: 10,
    color: T.textMute,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  routeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: T.text,
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: T.lineSoft,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: T.textSub,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: T.line,
  },

  starsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  starBtn: {
    padding: 4,
  },

  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },

  inputBox: {
    backgroundColor: T.card,
    borderRadius: T.radiusLg,
    borderWidth: 1,
    borderColor: T.line,
    padding: 14,
  },
  textInput: {
    fontSize: 15,
    color: T.text,
    lineHeight: 22,
    minHeight: 80,
    fontWeight: '500',
  },
  charCount: {
    fontSize: 12,
    color: T.textMute,
    textAlign: 'right',
    marginTop: 6,
  },

  hint: {
    fontSize: 12,
    color: T.textMute,
    textAlign: 'center',
    marginTop: 10,
  },

  thankYouContainer: {
    flex: 1,
    backgroundColor: T.bg,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: T.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  thankYouTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: T.text,
    letterSpacing: -0.5,
  },
  thankYouSub: {
    fontSize: 15,
    color: T.textSub,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});
