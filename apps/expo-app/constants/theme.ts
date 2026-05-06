export const T = {
  brand: '#1F4FD6',
  brandDark: '#153BA3',
  brandSoft: '#E8EEFF',
  brandFaint: '#F4F7FF',

  success: '#12A26B',
  successSoft: '#E4F6EE',
  warning: '#E39A0B',
  warningSoft: '#FFF4DB',
  danger: '#D4352B',
  dangerSoft: '#FDE8E6',
  info: '#0B84FF',

  bg: '#F2F3F7',
  card: '#FFFFFF',
  cardAlt: '#FAFAFC',

  ink: '#0D1226',
  text: '#161A2E',
  textSub: '#5A6078',
  textMute: '#8A90A6',
  line: '#E6E8EF',
  lineSoft: '#EFF1F6',

  pin: '#0F1B3D',
  mapRoad: '#E9ECF2',
  mapLand: '#F6F7FB',
  mapWater: '#DDE6F4',
  mapGreen: '#E3EDDB',

  shadow: '0 1px 2px rgba(15,20,40,0.04), 0 8px 24px rgba(15,20,40,0.06)',
  tabBarBg: 'rgba(255,255,255,0.92)',
  radius: 14,
  radiusLg: 20,
} as const;

export const SHIFTS = [
  { id: 'off', label: 'Off', time: '', color: '#EEF0F5', text: '#8A90A6', kind: null },
  { id: 'p9', label: 'Pickup', time: '9:00 AM', color: '#E8EEFF', text: '#1F4FD6', kind: 'pickup' },
  { id: 'p10', label: 'Pickup', time: '10:30 AM', color: '#E8EEFF', text: '#1F4FD6', kind: 'pickup' },
  { id: 'd18', label: 'Drop', time: '6:30 PM', color: '#FFE9DD', text: '#C45A16', kind: 'drop' },
  { id: 'd21', label: 'Drop', time: '9:00 PM', color: '#F2E4FF', text: '#6B28B8', kind: 'drop' },
  { id: 'd23', label: 'Drop', time: '11:00 PM', color: '#1F2A4A', text: '#FFD9A8', kind: 'drop', nightSafety: true },
];
