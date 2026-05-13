import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, getRecoveryColor, getStrainLabel, getMoodEmoji } from './theme';
import { getSleepLog } from '../db/sleepQueries';
import { getStrainLog } from '../db/strainQueries';
import { getJournalEntry } from '../db/journalQueries';
import { getHabitLogsForDate } from '../db/habitsQueries';

export default function DayDetailModal({ fecha, visible, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && fecha) {
      setLoading(true);
      Promise.all([
        getSleepLog(fecha),
        getStrainLog(fecha),
        getJournalEntry(fecha),
        getHabitLogsForDate(fecha),
      ])
        .then(([sleep, strain, journal, habits]) => setData({ sleep, strain, journal, habits }))
        .finally(() => setLoading(false));
    }
  }, [visible, fecha]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.dateTitle}>{fecha}</Text>

          {loading && <ActivityIndicator color={COLORS.accent} style={{ marginTop: 20 }} />}

          {!loading && data && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {data.sleep && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Sueño</Text>
                  <Text style={[styles.bigValue, { color: getRecoveryColor(data.sleep.recovery_score) }]}>
                    Recovery {Math.round(data.sleep.recovery_score)}
                  </Text>
                  <Text style={styles.detail}>
                    {data.sleep.horas_dormidas?.toFixed(1)}hs · Calidad {data.sleep.calidad}/10 · Energía {data.sleep.energia}/10
                  </Text>
                  {data.sleep.nota ? <Text style={styles.note}>{data.sleep.nota}</Text> : null}
                </View>
              )}

              {data.strain && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Strain</Text>
                  <Text style={styles.bigValue}>{data.strain.strain_score}/21 — {getStrainLabel(data.strain.strain_score)}</Text>
                </View>
              )}

              {data.journal && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Diario</Text>
                  <Text style={styles.bigValue}>
                    {getMoodEmoji(data.journal.estado_animo)} {data.journal.estado_animo}/10
                  </Text>
                  {data.journal.como_me_siento ? (
                    <Text style={styles.detail}>{data.journal.como_me_siento}</Text>
                  ) : null}
                </View>
              )}

              {data.habits.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Hábitos</Text>
                  {data.habits.map((h) => (
                    <View key={h.id} style={styles.habitRow}>
                      <View style={[styles.dot, { backgroundColor: h.color || COLORS.accent }]} />
                      <Text style={[styles.habitName, !h.completado && { color: COLORS.textSecondary }]}>
                        {h.nombre}
                      </Text>
                      <Text style={{ color: h.completado ? COLORS.green : COLORS.red }}>
                        {h.completado ? '✓' : '✗'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {!data.sleep && !data.strain && !data.journal && data.habits.length === 0 && (
                <Text style={styles.empty}>Sin registros para este día</Text>
              )}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeTxt}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  dateTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  section: { marginBottom: 20 },
  sectionLabel: { fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  bigValue: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  detail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  note: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6, fontStyle: 'italic' },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  habitName: { flex: 1, fontSize: 14, color: COLORS.text },
  empty: { textAlign: 'center', color: COLORS.textSecondary, marginTop: 20 },
  closeBtn: {
    marginTop: 16,
    backgroundColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  closeTxt: { color: COLORS.text, fontWeight: '600' },
});
