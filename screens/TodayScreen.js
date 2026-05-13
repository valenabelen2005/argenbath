import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SafeAreaView } from 'react-native-safe-area-context';
import CircularRing from '../components/CircularRing';
import { MetricCard } from '../components/MetricCard';
import { COLORS, getRecoveryColor, getStrainLabel, getStrainColor } from '../components/theme';
import { useSleep } from '../hooks/useSleep';
import { useStrain } from '../hooks/useStrain';
import { useHabits } from '../hooks/useHabits';
import { useJournal } from '../hooks/useJournal';
import { ScaleSelector } from '../components/MetricCard';

export default function TodayScreen() {
  const navigation = useNavigation();
  const { todayLog: sleepLog, refresh: refreshSleep } = useSleep();
  const { todayLog: strainLog, refresh: refreshStrain, saveStrain } = useStrain();
  const { habits, logs, todayStats, refresh: refreshHabits } = useHabits();
  const { todayEntry, refresh: refreshJournal } = useJournal();

  const [strainModal, setStrainModal] = useState(false);
  const [strainValue, setStrainValue] = useState(8);
  const [strainNota, setStrainNota] = useState('');

  useFocusEffect(
    useCallback(() => {
      refreshSleep();
      refreshStrain();
      refreshHabits();
      refreshJournal();
    }, [])
  );

  const recovery = sleepLog?.recovery_score ?? 0;
  const strain = strainLog?.strain_score ?? 0;
  const isRisk = strain > 14 && recovery < 50 && (strain > 0 || recovery > 0);
  const allDone = sleepLog && strainLog && todayEntry;

  const handleSaveStrain = async () => {
    await saveStrain(strainValue, strainNota || null);
    setStrainModal(false);
    setStrainNota('');
  };

  const dateLabel = format(new Date(), "EEEE d 'de' MMMM", { locale: es });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>{dateLabel}</Text>
          <Text style={styles.titleText}>Hoy</Text>
        </View>

        {/* Rings */}
        <View style={styles.ringsRow}>
          <View style={styles.ringBlock}>
            <CircularRing value={recovery} max={100} size={160} strokeWidth={16} />
            <Text style={styles.ringTitle}>Recovery</Text>
            <Text style={[styles.ringSub, { color: getRecoveryColor(recovery) }]}>
              {!sleepLog
                ? 'Sin datos'
                : recovery >= 67
                ? 'Listo para rendir'
                : recovery >= 34
                ? 'Actividad moderada'
                : 'Descansá hoy'}
            </Text>
          </View>

          <View style={styles.ringBlock}>
            <CircularRing
              value={strain}
              max={21}
              size={110}
              strokeWidth={12}
              color={strain > 0 ? getStrainColor(strain) : COLORS.border}
            />
            <Text style={styles.ringTitle}>Strain</Text>
            <Text style={styles.ringSub}>
              {strain > 0 ? `${strain}/21 · ${getStrainLabel(strain)}` : 'Sin datos'}
            </Text>
          </View>
        </View>

        {/* Risk alert */}
        {isRisk && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              ⚠️ Strain alto con Recovery bajo — considera descansar mañana
            </Text>
          </View>
        )}

        {/* All done banner */}
        {allDone && (
          <View style={styles.doneBanner}>
            <Text style={styles.doneText}>Día registrado ✓</Text>
          </View>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Registrar</Text>
        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.actionCard, sleepLog && styles.actionDone]}
            onPress={() => navigation.navigate('Sueño')}
          >
            <Text style={styles.actionIcon}>🌙</Text>
            <Text style={styles.actionLabel}>Sueño</Text>
            {sleepLog && (
              <Text style={styles.actionValue}>{sleepLog.horas_dormidas?.toFixed(1)}hs</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, strainLog && styles.actionDone]}
            onPress={() => setStrainModal(true)}
          >
            <Text style={styles.actionIcon}>💪</Text>
            <Text style={styles.actionLabel}>Strain</Text>
            {strainLog && <Text style={styles.actionValue}>{strain}/21</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, todayStats.completados > 0 && styles.actionDone]}
            onPress={() => navigation.navigate('Hábitos')}
          >
            <Text style={styles.actionIcon}>✅</Text>
            <Text style={styles.actionLabel}>Hábitos</Text>
            {todayStats.total > 0 && (
              <Text style={styles.actionValue}>
                {todayStats.completados}/{todayStats.total}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, todayEntry && styles.actionDone]}
            onPress={() => navigation.navigate('Diario')}
          >
            <Text style={styles.actionIcon}>📔</Text>
            <Text style={styles.actionLabel}>Diario</Text>
            {todayEntry && (
              <Text style={styles.actionValue}>{todayEntry.estado_animo}/10</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Summary cards */}
        {sleepLog && (
          <MetricCard
            title="SUEÑO"
            value={`${sleepLog.horas_dormidas?.toFixed(1)}hs`}
            subtitle={`Calidad ${sleepLog.calidad}/10 · Energía ${sleepLog.energia}/10`}
            accent={getRecoveryColor(recovery)}
          />
        )}
      </ScrollView>

      {/* Strain modal */}
      <Modal visible={strainModal} transparent animationType="slide" onRequestClose={() => setStrainModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Registrar Strain</Text>
            <Text style={styles.modalSubtitle}>¿Cómo fue tu exigencia física hoy?</Text>

            <View style={styles.strainTrack}>
              {Array.from({ length: 22 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.strainDot,
                    { backgroundColor: i <= strainValue ? getStrainColor(strainValue) : COLORS.border },
                  ]}
                  onPress={() => setStrainValue(i)}
                />
              ))}
            </View>
            <Text style={[styles.strainScore, { color: getStrainColor(strainValue) }]}>
              {strainValue} — {getStrainLabel(strainValue)}
            </Text>

            <View style={styles.strainRef}>
              {[
                { range: '0–3', label: 'Reposo', color: COLORS.green },
                { range: '4–8', label: 'Ligero', color: '#60A5FA' },
                { range: '9–14', label: 'Serio', color: COLORS.yellow },
                { range: '15–18', label: 'Exigente', color: '#F97316' },
                { range: '19–21', label: 'Extremo', color: COLORS.red },
              ].map((r) => (
                <View key={r.range} style={styles.strainRefItem}>
                  <View style={[styles.strainRefDot, { backgroundColor: r.color }]} />
                  <Text style={styles.strainRefText}>{r.range} {r.label}</Text>
                </View>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nota opcional..."
              placeholderTextColor={COLORS.textSecondary}
              value={strainNota}
              onChangeText={setStrainNota}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveStrain}>
              <Text style={styles.saveBtnTxt}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  dateText: { fontSize: 13, color: COLORS.textSecondary, textTransform: 'capitalize' },
  titleText: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginTop: 2 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 24 },
  ringBlock: { alignItems: 'center' },
  ringTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 12 },
  ringSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  alert: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.red + '44',
  },
  alertText: { color: COLORS.red, fontSize: 13 },
  doneBanner: {
    backgroundColor: COLORS.accentLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accent + '44',
  },
  doneText: { color: COLORS.accent, fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 14, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  actionCard: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionDone: { borderColor: COLORS.accent + '55', backgroundColor: COLORS.accentLight },
  actionIcon: { fontSize: 24 },
  actionLabel: { fontSize: 13, color: COLORS.text, fontWeight: '600', marginTop: 8 },
  actionValue: { fontSize: 12, color: COLORS.accent, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, marginBottom: 24 },
  strainTrack: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  strainDot: { width: 22, height: 22, borderRadius: 4 },
  strainScore: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginVertical: 12 },
  strainRef: { gap: 6, marginBottom: 20 },
  strainRefItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  strainRefDot: { width: 10, height: 10, borderRadius: 5 },
  strainRefText: { fontSize: 13, color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    padding: 14,
    color: COLORS.text,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, alignItems: 'center' },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
