import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle, Text as SvgText, G, Defs, Pattern } from 'react-native-svg';
import { T } from '@/constants/theme';

type Props = {
  height?: number;
  showPins?: boolean;
  routeProgress?: number;
  dark?: boolean;
};

export function StaticMap({ height = 280, showPins = true, routeProgress = 0.45, dark = false }: Props) {
  const bg = dark ? '#18202E' : T.mapLand;
  const land = dark ? '#1E2738' : '#FFFFFF';
  const road = dark ? '#2C3852' : T.mapRoad;
  const roadMajor = dark ? '#3A4A6C' : '#DDE2ED';
  const water = dark ? '#1A2440' : T.mapWater;
  const green = dark ? '#1C2A24' : T.mapGreen;

  const driver = { x: 70 + routeProgress * 60, y: 220 - routeProgress * 10 };
  const pickup = { x: 130, y: 220 };
  const office = { x: 330, y: 80 };
  const routeD = `M ${driver.x} ${driver.y} L 130 220 L 130 150 L 330 150 L 330 80`;

  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Svg width="100%" height={height} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <Rect width="400" height="300" fill={land} />
        <Path d="M0 0h140v80H0z" fill={dark ? '#1B2535' : '#FAFBFE'} />
        <Path d="M240 180h160v120H240z" fill={dark ? '#1B2535' : '#FAFBFE'} />
        <Rect x="270" y="40" width="90" height="70" rx="6" fill={green} />
        <SvgText x="315" y="80" textAnchor="middle" fontSize="9" fontWeight="500" fill={dark ? '#3D5A4A' : '#8BA595'}>Cubbon Park</SvgText>
        <Path d="M0 240 Q 80 220 160 240 T 320 240 L 320 300 L 0 300 Z" fill={water} />
        <Path d="M-10 150 L 410 150" stroke={roadMajor} strokeWidth="14" strokeLinecap="round" />
        <Path d="M200 -10 L 200 310" stroke={roadMajor} strokeWidth="12" strokeLinecap="round" />
        <Path d="M60 -10 L 60 310" stroke={road} strokeWidth="6" />
        <Path d="M330 -10 L 330 310" stroke={road} strokeWidth="6" />
        <Path d="M-10 80 L 410 80" stroke={road} strokeWidth="6" />
        <Path d="M-10 220 L 410 220" stroke={road} strokeWidth="6" />
        <Path d="M130 80 L 130 220" stroke={road} strokeWidth="4" />
        <Path d="M270 40 L 270 150" stroke={road} strokeWidth="4" />
        <Path d="M60 80 L 200 150" stroke={road} strokeWidth="5" />
        <SvgText x="100" y="147" fontSize="7.5" fill={dark ? '#6B7A99' : '#A5ADBF'} fontWeight="500">MG Road</SvgText>

        {showPins && (
          <G>
            <Path d={routeD} stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Path d={routeD} stroke={T.brand} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            {/* office pin */}
            <G transform={`translate(${office.x}, ${office.y})`}>
              <Circle r="11" fill="#fff" stroke={T.ink} strokeWidth="2" />
              <Rect x="-4" y="-5" width="8" height="10" rx="1" fill={T.ink} />
            </G>
            {/* pickup pin */}
            <G transform={`translate(${pickup.x}, ${pickup.y})`}>
              <Path d="M0 -18 C -8 -18 -13 -11 -13 -5 C -13 3 0 14 0 14 C 0 14 13 3 13 -5 C 13 -11 8 -18 0 -18 Z" fill={T.brand} stroke="#fff" strokeWidth="2" />
              <Circle r="4.5" cy="-6" fill="#fff" />
            </G>
            {/* driver */}
            <G transform={`translate(${driver.x}, ${driver.y})`}>
              <Circle r="16" fill={T.brand} opacity="0.15" />
              <Circle r="11" fill={T.brand} />
              <Rect x="-6" y="-4" width="12" height="8" rx="2" fill="#fff" />
              <Circle cx="-3.5" cy="4" r="1.5" fill="#fff" />
              <Circle cx="3.5" cy="4" r="1.5" fill="#fff" />
            </G>
          </G>
        )}
      </Svg>
    </View>
  );
}
