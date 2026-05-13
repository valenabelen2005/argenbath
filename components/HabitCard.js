import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS } from './theme';

export default function HabitCard({ habit, log, streak, rate, onToggle, onLongPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const done = !!log?.completado;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();
    onToggle(habit.id);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[styles.card, done && styles.cardDone]}
        onPress={handlePress}
        onLongPress={() => onLongPress && onLongPress(habit)}
        activeOpacity={0.85}
      >
        <View style={[styles.colorDot, { backgroundColor: habit.color || COLORS.accent }]} />
        <View style={styles.info}>
          <Text style={[styles.name, done && styles.nameDone]}>{habit.nombre}</Text>
          <View style={styles.meta}>
            {streak > 0 && (
              <Text style={styles.streak}>🔥 {streak} días</Text>
            )}
            <Text style={styles.rate}>{rate}% esta semana</Text>
          </View>
        </View>
        <View style={[styles.check, done && { backgroundColor: habit.color || COLORS.accent }]}>
          {done && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardDone: {
    borderColor: COLORS.accent + '55',
    backgroundColor: COLORS.accentLight,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  nameDone: { color: COLORS.textSecondary, textDecorationLine: 'line-through' },
  meta: { flexDirection: 'row', gap: 10, marginTop: 4 },
  streak: { fontSize: 12, color: COLORS.yellow },
  rate: { fontSize: 12, color: COLORS.textSecondary },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { fontSize: 14, color: '#fff', fontWeight: '700' },
});
