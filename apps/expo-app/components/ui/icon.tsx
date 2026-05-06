import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  car: 'car-outline',
  calendar: 'calendar-outline',
  clock: 'time-outline',
  map: 'map-outline',
  user: 'person-outline',
  chev: 'chevron-forward',
  chevDown: 'chevron-down',
  plus: 'add',
  phone: 'call',
  home: 'home-outline',
  history: 'refresh-circle-outline',
  pin: 'location-outline',
  shield: 'shield-outline',
  bell: 'notifications-outline',
  bolt: 'flash-outline',
  check: 'checkmark',
  close: 'close',
  search: 'search',
  share: 'share-outline',
  info: 'information-circle-outline',
  users: 'people-outline',
  filter: 'filter',
  edit: 'pencil',
  lock: 'lock-closed-outline',
  building: 'business-outline',
  refresh: 'refresh',
};

type Props = {
  name: string;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

export function Icon({ name, size = 22, color = '#161A2E', accessibilityLabel }: Props) {
  const iconName = ICON_MAP[name] ?? (name as keyof typeof Ionicons.glyphMap);
  return (
    <Ionicons
      name={iconName}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
