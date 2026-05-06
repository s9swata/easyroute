import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '@/constants/theme';
import { Icon } from './icon';

type Tone = 'neutral' | 'brand' | 'success' | 'warn' | 'danger' | 'dark';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: T.lineSoft, fg: T.textSub },
  brand: { bg: T.brandSoft, fg: T.brand },
  success: { bg: T.successSoft, fg: T.success },
  warn: { bg: T.warningSoft, fg: '#A06F00' },
  danger: { bg: T.dangerSoft, fg: T.danger },
  dark: { bg: T.ink, fg: '#fff' },
};

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  icon?: string;
  style?: object;
};

export function Chip({ children, tone = 'neutral', icon, style }: Props) {
  const t = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }, style]}>
      {icon && <Icon name={icon} size={12} color={t.fg} />}
      <Text style={[styles.text, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
