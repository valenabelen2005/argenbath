import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, getRecoveryColor } from './theme';

export default function CircularRing({
  value = 0,
  max = 100,
  size = 140,
  strokeWidth = 14,
  color = null,
  label = null,
  sublabel = null,
  showValue = true,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), max);
  const progress = max > 0 ? clampedValue / max : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const cx = size / 2;
  const cy = size / 2;
  const ringColor = color || getRecoveryColor((value / max) * 100);

  return (
    <View style={styles.wrapper}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={COLORS.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={ringColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={-90}
            origin={`${cx}, ${cy}`}
          />
        </Svg>
        {showValue && (
          <View style={[styles.innerContent, { width: size, height: size }]}>
            <Text style={[styles.value, { color: ringColor, fontSize: size * 0.22 }]}>
              {Math.round(value)}
            </Text>
            {label && <Text style={styles.label}>{label}</Text>}
          </View>
        )}
      </View>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  innerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: { fontWeight: '700' },
  label: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  sublabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
});
