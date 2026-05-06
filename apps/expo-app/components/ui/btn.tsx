import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { T } from '@/constants/theme';
import { Icon } from './icon';

type Variant = 'primary' | 'dark' | 'soft' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, { bg: string; color: string; border?: string }> = {
  primary: { bg: T.brand, color: '#fff' },
  dark: { bg: T.ink, color: '#fff' },
  soft: { bg: T.brandSoft, color: T.brand },
  outline: { bg: '#fff', color: T.text, border: T.line },
  ghost: { bg: 'transparent', color: T.brand },
  danger: { bg: T.dangerSoft, color: T.danger },
};

const SIZES: Record<Size, { height: number; fontSize: number; paddingH: number }> = {
  sm: { height: 36, fontSize: 14, paddingH: 14 },
  md: { height: 48, fontSize: 16, paddingH: 18 },
  lg: { height: 54, fontSize: 17, paddingH: 22 },
};

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: string;
  full?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
};

export function Btn({ children, onPress, variant = 'primary', size = 'md', icon, full, style, disabled }: Props) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.paddingH,
          borderRadius: s.height / 2,
          backgroundColor: v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          flex: full ? 1 : undefined,
          opacity: pressed ? 0.8 : disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={s.fontSize + 4} color={v.color} />}
      <Text style={[styles.text, { fontSize: s.fontSize, color: v.color }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
