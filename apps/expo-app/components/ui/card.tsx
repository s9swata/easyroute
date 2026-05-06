import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { T } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  onPress?: () => void;
};

export function Card({ children, style, padded = true, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: T.card,
    borderRadius: T.radiusLg,
    shadowColor: '#0F1428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  padded: {
    padding: 16,
  },
});
