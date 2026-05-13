import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import CircularRing from '../components/CircularRing';
import BarChart from '../components/BarChart';
import { MetricCard, ScaleSelector } from '../components/MetricCard';
import { COLORS, getRecoveryColor } from '../components/theme';
import { useSleep } from '../hooks/useSleep';
import { getSettings } from '../db/settingsQueries';

const DAY_ABBR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export default function SleepScreen() {
  const { todayLog, recentLogs, weeklyDebt, loading, refresh, saveSleep } = useSleep();

  const [period, setPeriod] = useState('semana');
  const [editing, setEditing] = useState(false);
  const [hora_dormir, setHoraDormir] = useState('23:00');
  const [hora_despertar, setHoraDespertar] = useState('07:00');
  const [calidad, setCalidad] = useState(7);
  const [energia, setEnergia] = useState(7);
  const [nota, setNota] = useState('');
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState(8);

  useFocusEffect(
    useCallback(() => {
      refresh();
      getSettings().then((s) => setMeta(s?.meta_sueno ?? 8));
    }, [])
  );

  const handleSave = async () => {
    const timeRe = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    if (!timeRe.test(hora_dormir) || !timeRe.test(hora_despertar)) {
      Alert.alert('Formato incorrecto', 'Usá el formato HH:MM (ej: 23:00)');
      return;
    }
    setSaving(true);
    try {
      const score = await saveSleep({ hora_dormir, hora_despertar, calidad, energia, nota });
      setEditing(false);
      Alert.alert('Guardado', `Recovery Score: ${score}`);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const days = period === 'semana' ? 7 : 30;
  const since = subDays(new Date(), days - 1);
  const filtered = recentLogs.filter(
    (l) => new Date(l.fecha) >= since
  );

  const horasData = filtered.map((l, i) => ({
    value: l.horas_dormidas || 0,
    label: format(new Date(l.fecha + 'T12:00'), 'dd/MM'),
    color: l.horas_dormidas >= meta ? COLORS.green : COLORS.red,
    decimals: 1,
  }));

  const recoveryData = filtered.map((l) => ({
    value: l.recovery_score || 0,
    label: format(new Date(l.fecha + 'T12:00'), 'dd/MM'),
    color: getRecoveryColor(l.recovery_score || 0),
  }));

  const calidadData = filtered.map((l) => ({
    value: l.calidad || 0,
    label: format(new Date(l.fecha + 'T12:00'), 'dd/MM'),
    color: COLORS.accent,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Sueño</Text>

          {/* Today's recovery ring */}
          {todayLog && !editing && (
            <View style={styles.recoveryCard}>
              <CircularRing
                value={todayLog.recovery_score || 0}
                max={100}
                size={130}
                strokeWidth={14}
              />
              <View style={styles.recoveryInfo}>
                <Text style={[styles.recoveryScore, { color: getRecoveryColor(todayLog.recovery_score) }]}>
                  Recovery {Math.round(todayLog.recovery_score)}
                </Text>
                <Text style={styles.recoveryDetail}>
                  {todayLog.horas_dormidas?.toFixed(1)}hs · {todayLog.hora_dormir} → {todayLog.hora_despertar}
                </Text>
                <Text style={styles.recoveryDetail}>
                  Calidad {todayLog.calidad}/10 · Energía {todayLog.energia}/10
                </Text>
                <TouchableOpacity onPress={() => setEditing(true)}>
                  <Text style={styles.editLink}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Debt card */}
          <View style={styles.debtCard}>
            <Text style={styles.debtLabel}>Deuda de sueño esta semana</Text>
            <Text style={[styles.debtValue, { color: weeklyDebt > 2 ? COLORS.red : weeklyDebt > 0 ? COLORS.yellow : COLORS.green }]}>
              {weeklyDebt > 0 ? `-${weeklyDebt.toFixed(1)}hs` : 'Al día ✓'}
            </Text>
            <Text style={styles.debtMeta}>Meta: {meta}hs/noche</Text>
          </View>

          {/* Form */}
          {(!todayLog || editing) && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                {todayLog ? 'Editar sueño de hoy' : 'Registrar sueño de hoy'}
              </Text>

              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <Text style={styles.fieldLabel}>Me dormí</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={hora_dormir}
                    onChangeText={setHoraDormir}
                    placeholder="23:00"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                  />
                </View>
                <Text style={styles.timeSeparator}>→</Text>
                <View style={styles.timeField}>
                  <Text style={styles.fieldLabel}>Me desperté</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={hora_despertar}
                    onChangeText={setHoraDespertar}
                    placeholder="07:00"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Calidad del sueño: {calidad}/10</Text>
              <ScaleSelector value={calidad} onChange={setCalidad} min={1} max={10} />

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Energía al despertar: {energia}/10</Text>
              <ScaleSelector value={energia} onChange={setEnergia} min={1} max={10} />

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Nota (opcional)</Text>
              <TextInput
                style={styles.textArea}
                value={nota}
                onChangeText={setNota}
                placeholder="¿Algo que afectó tu sueño?"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveBtnTxt}>{saving ? 'Guardando...' : 'Guardar Sueño'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Period toggle */}
          <View style={styles.toggleRow}>
            {['semana', 'mes'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.toggleBtn, period === p && styles.toggleBtnActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.toggleTxt, period === p && styles.toggleTxtActive]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Charts */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Horas dormidas vs meta ({meta}hs)</Text>
            <BarChart data={horasData} unit="h" />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Recovery Score</Text>
            <BarChart data={recoveryData} colorFn={getRecoveryColor} />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Calidad del sueño</Text>
            <BarChart data={calidadData} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 20 },
  recoveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    gap: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recoveryInfo: { flex: 1 },
  recoveryScore: { fontSize: 20, fontWeight: '700' },
  recoveryDetail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  editLink: { color: COLORS.accent, fontSize: 13, marginTop: 8 },
  debtCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  debtLabel: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  debtValue: { fontSize: 28, fontWeight: '700', marginTop: 6 },
  debtMeta: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  form: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  formTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 20 },
  timeField: { flex: 1 },
  fieldLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  timeInput: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 20, fontWeight: '700', textAlign: 'center', borderWidth: 1, borderColor: COLORS.border },
  timeSeparator: { fontSize: 20, color: COLORS.textSecondary, paddingBottom: 14 },
  textArea: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border, minHeight: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20 },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  toggleRow: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 16 },
  toggleBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: COLORS.accent },
  toggleTxt: { color: COLORS.textSecondary, fontWeight: '600' },
  toggleTxtActive: { color: '#fff' },
  chartCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  chartTitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 12 },
});
