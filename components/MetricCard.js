import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from './theme';

export function MetricCard({ title, value, subtitle, accent = COLORS.accent, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </Wrapper>
  );
}

export function SectionHeader({ title, action, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function ScaleSelector({ value, onChange, min = 1, max = 10, colors = null }) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <View style={styles.scale}>
      {items.map((n) => {
        const selected = value === n;
        const color = colors
          ? colors(n)
          : selected
          ? COLORS.accent
          : COLORS.surface;
        return (
          <TouchableOpacity
            key={n}
            style={[styles.scaleItem, { backgroundColor: color, borderColor: selected ? color : COLORS.border }]}
            onPress={() => onChange(n)}
          >
            <Text style={[styles.scaleText, selected && { color: '#fff', fontWeight: '700' }]}>
              {n}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  value: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  sectionAction: { fontSize: 13, color: COLORS.accent },
  scale: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  scaleItem: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scaleText: { fontSize: 14, color: COLORS.textSecondary },
});
