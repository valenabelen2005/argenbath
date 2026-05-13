import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import BarChart from '../components/BarChart';
import { MetricCard } from '../components/MetricCard';
import { COLORS, getRecoveryColor, getMoodEmoji } from '../components/theme';
import { useStats } from '../hooks/useStats';

export default function StatsScreen() {
  const { stats, loading, refresh } = useStats();
  const [period, setPeriod] = useState(7);

  useFocusEffect(useCallback(() => { refresh(period); }, [period]));

  if (loading || !stats) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={COLORS.accent} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  const recoveryBarData = stats.sleepLogs.slice(-period).map((l) => ({
    value: l.recovery_score || 0,
    label: format(new Date(l.fecha + 'T12:00'), 'dd/MM'),
    color: getRecoveryColor(l.recovery_score || 0),
  }));

  const strainBarData = stats.strainLogs.slice(-period).map((l) => ({
    value: l.strain_score,
    label: format(new Date(l.fecha + 'T12:00'), 'dd/MM'),
    color: COLORS.accent,
  }));

  const moodData = stats.journalEntries.slice(-period).map((e) => ({
    value: e.estado_animo || 0,
    label: format(new Date(e.fecha + 'T12:00'), 'dd/MM'),
    color: COLORS.yellow,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Estadísticas</Text>

        {/* Period toggle */}
        <View style={styles.toggleRow}>
          {[7, 30].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.toggleBtn, period === p && styles.toggleBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.toggleTxt, period === p && styles.toggleTxtActive]}>
                {p === 7 ? '7 días' : '30 días'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview cards */}
        <View style={styles.overviewGrid}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Recovery prom.</Text>
            <Text style={[styles.overviewValue, { color: getRecoveryColor(stats.avgRecovery) }]}>
              {stats.avgRecovery}
            </Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Strain prom.</Text>
            <Text style={[styles.overviewValue, { color: COLORS.accent }]}>{stats.avgStrain}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Hábitos</Text>
            <Text style={[styles.overviewValue, { color: COLORS.green }]}>{stats.avgHabitPct}%</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewLabel}>Ánimo prom.</Text>
            <Text style={styles.overviewValue}>
              {getMoodEmoji(Number(stats.avgMood))} {stats.avgMood}
            </Text>
          </View>
        </View>

        {/* Recovery chart */}
        {recoveryBarData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Recovery Score</Text>
            <BarChart data={recoveryBarData} colorFn={getRecoveryColor} />
          </View>
        )}

        {/* Strain chart */}
        {strainBarData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Strain</Text>
            <BarChart data={strainBarData} />
          </View>
        )}

        {/* Mood chart */}
        {moodData.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Tendencia de ánimo</Text>
            <BarChart data={moodData} unit="/10" />
          </View>
        )}

        {/* Correlations */}
        {stats.correlations.length > 0 && (
          <View style={styles.correlCard}>
            <Text style={styles.correlTitle}>Correlaciones destacadas</Text>
            {stats.correlations.map(({ habit, diff }) => (
              <View key={habit.id} style={styles.correlRow}>
                <View style={[styles.correlDot, { backgroundColor: habit.color || COLORS.accent }]} />
                <Text style={styles.correlText}>
                  {diff > 0
                    ? `Cuando cumplís "${habit.nombre}", tu Recovery sube +${diff} pts`
                    : `Cuando no cumplís "${habit.nombre}", tu Recovery cae ${Math.abs(diff)} pts`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Stress trend */}
        {stats.stressLogs.length > 0 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Estrés percibido</Text>
            <BarChart
              data={stats.stressLogs.slice(-period).map((l) => ({
                value: l.stress_nivel,
                label: format(new Date(l.fecha + 'T12:00'), 'dd/MM'),
                color: l.stress_nivel >= 2 ? COLORS.red : l.stress_nivel === 1 ? COLORS.yellow : COLORS.green,
              }))}
            />
            <Text style={styles.chartHint}>0=sin estrés · 1=leve · 2=moderado · 3=alto</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  toggleRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: COLORS.accent },
  toggleTxt: { color: COLORS.textSecondary, fontWeight: '600' },
  toggleTxtActive: { color: '#fff' },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  overviewCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  overviewLabel: { fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  overviewValue: { fontSize: 28, fontWeight: '700', color: COLORS.text, marginTop: 6 },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  chartTitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  chartHint: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8 },
  correlCard: { backgroundColor: COLORS.accentLight, borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: COLORS.accent + '33' },
  correlTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  correlRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  correlDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  correlText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 20 },
});
