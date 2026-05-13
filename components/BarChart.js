import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Rect, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { COLORS, getRecoveryColor } from './theme';

const CHART_HEIGHT = 140;
const BAR_WIDTH = 24;
const BAR_GAP = 8;

export default function BarChart({ data = [], colorFn = null, unit = '', title = '' }) {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sin datos</Text>
      </View>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.value || 0), 1);
  const chartWidth = data.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP;

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={chartWidth} height={CHART_HEIGHT + 32}>
          {data.map((item, i) => {
            const barH = Math.max(((item.value || 0) / maxVal) * CHART_HEIGHT, 2);
            const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP);
            const y = CHART_HEIGHT - barH;
            const barColor = colorFn
              ? colorFn(item.value)
              : item.color || COLORS.accent;

            return (
              <React.Fragment key={i}>
                <Rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={barH}
                  fill={barColor}
                  rx={4}
                  opacity={item.value ? 1 : 0.2}
                />
                <SvgText
                  x={x + BAR_WIDTH / 2}
                  y={CHART_HEIGHT + 14}
                  fill={COLORS.textSecondary}
                  fontSize="10"
                  textAnchor="middle"
                >
                  {item.label || ''}
                </SvgText>
                {item.value > 0 && (
                  <SvgText
                    x={x + BAR_WIDTH / 2}
                    y={y - 4}
                    fill={COLORS.textSecondary}
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {typeof item.value === 'number' ? item.value.toFixed(item.decimals ?? 0) : item.value}
                    {unit}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}

export function LineChart({ data = [], color = COLORS.accent, title = '', unit = '' }) {
  if (data.length < 2) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Sin datos suficientes</Text>
      </View>
    );
  }

  const W = 300;
  const H = 100;
  const maxVal = Math.max(...data.map((d) => d.value || 0), 1);
  const minVal = 0;
  const range = maxVal - minVal || 1;
  const step = W / (data.length - 1);

  const points = data
    .map((d, i) => {
      const x = i * step;
      const y = H - ((d.value - minVal) / range) * H;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={W} height={H + 24}>
          {data.map((d, i) => {
            const x = i * step;
            const y = H - ((d.value - minVal) / range) * H;
            return (
              <React.Fragment key={i}>
                <Line x1={x} y1={0} x2={x} y2={H} stroke={COLORS.border} strokeWidth={0.5} />
                <SvgText x={x} y={H + 14} fill={COLORS.textSecondary} fontSize="9" textAnchor="middle">
                  {d.label}
                </SvgText>
              </React.Fragment>
            );
          })}
          <Polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
        </Svg>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  title: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  empty: { height: 80, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 13 },
});
