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
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HabitCard from '../components/HabitCard';
import { SectionHeader } from '../components/MetricCard';
import { COLORS } from '../components/theme';
import { useHabits } from '../hooks/useHabits';

const COLORS_OPTIONS = ['#7C5CFC', '#22C55E', '#EAB308', '#EF4444', '#60A5FA', '#F97316', '#EC4899', '#06B6D4'];

export default function HabitsScreen() {
  const { habits, logs, streaks, rates, loading, refresh, toggle, addHabit, archive } = useHabits();

  const [addModal, setAddModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('bueno');
  const [selectedColor, setSelectedColor] = useState(COLORS_OPTIONS[0]);
  const [archiveModal, setArchiveModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [correlModal, setCorrelModal] = useState(false);
  const [correlData, setCorrelData] = useState(null);

  useFocusEffect(useCallback(() => { refresh(); }, []));

  const buenos = habits.filter((h) => h.tipo === 'bueno');
  const malos = habits.filter((h) => h.tipo === 'malo');

  const handleAdd = async () => {
    if (!nombre.trim()) return;
    await addHabit(nombre.trim(), tipo, selectedColor);
    setNombre('');
    setTipo('bueno');
    setSelectedColor(COLORS_OPTIONS[0]);
    setAddModal(false);
  };

  const handleLongPress = (habit) => {
    setSelectedHabit(habit);
    setArchiveModal(true);
  };

  const handleArchive = async () => {
    if (!selectedHabit) return;
    await archive(selectedHabit.id);
    setArchiveModal(false);
    setSelectedHabit(null);
  };

  const renderHabit = (habit) => (
    <HabitCard
      key={habit.id}
      habit={habit}
      log={logs[habit.id]}
      streak={streaks[habit.id] || 0}
      rate={rates[habit.id] || 0}
      onToggle={toggle}
      onLongPress={handleLongPress}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Hábitos</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddModal(true)}>
          <Text style={styles.addBtnTxt}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNum}>
              {Object.values(logs).filter((l) => l?.completado).length}/{habits.length}
            </Text>
            <Text style={styles.statLabel}>Hoy</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNum}>{buenos.length}</Text>
            <Text style={styles.statLabel}>Buenos</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNum}>{malos.length}</Text>
            <Text style={styles.statLabel}>Malos</Text>
          </View>
        </View>

        {buenos.length > 0 && (
          <>
            <SectionHeader title="Hábitos Buenos" />
            {buenos.map(renderHabit)}
          </>
        )}

        {malos.length > 0 && (
          <>
            <SectionHeader title="Hábitos a Eliminar" />
            {malos.map(renderHabit)}
          </>
        )}

        {habits.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>Todavía no tenés hábitos</Text>
            <Text style={styles.emptySub}>Tocá "+ Nuevo" para comenzar</Text>
          </View>
        )}
      </ScrollView>

      {/* Add habit modal */}
      <Modal visible={addModal} transparent animationType="slide" onRequestClose={() => setAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.handle} />
            <Text style={styles.modalTitle}>Nuevo Hábito</Text>

            <Text style={styles.inputLabel}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Meditar 10 min..."
              placeholderTextColor={COLORS.textSecondary}
              value={nombre}
              onChangeText={setNombre}
              autoFocus
            />

            <Text style={styles.inputLabel}>Tipo</Text>
            <View style={styles.tipoRow}>
              <TouchableOpacity
                style={[styles.tipoPill, tipo === 'bueno' && styles.tipoPillActive]}
                onPress={() => setTipo('bueno')}
              >
                <Text style={[styles.tipoPillTxt, tipo === 'bueno' && { color: '#fff' }]}>✅ Bueno</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tipoPill, tipo === 'malo' && styles.tipoPillBad]}
                onPress={() => setTipo('malo')}
              >
                <Text style={[styles.tipoPillTxt, tipo === 'malo' && { color: '#fff' }]}>🚫 Eliminar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorRow}>
              {COLORS_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotSelected]}
                  onPress={() => setSelectedColor(c)}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnTxt}>Crear Hábito</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Archive confirmation modal */}
      <Modal visible={archiveModal} transparent animationType="fade" onRequestClose={() => setArchiveModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, styles.alertModal]}>
            <Text style={styles.modalTitle}>{selectedHabit?.nombre}</Text>
            <Text style={styles.modalSubtitle}>¿Qué querés hacer con este hábito?</Text>
            <TouchableOpacity style={styles.archiveBtn} onPress={handleArchive}>
              <Text style={styles.archiveBtnTxt}>Archivar (mantener historial)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setArchiveModal(false)}>
              <Text style={styles.cancelBtnTxt}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 0 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text },
  addBtn: { backgroundColor: COLORS.accent, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statPill: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statNum: { fontSize: 22, fontWeight: '700', color: COLORS.accent },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  alertModal: { borderRadius: 24, margin: 24, marginTop: 'auto', paddingBottom: 24 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, marginBottom: 20 },
  inputLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 15, borderWidth: 1, borderColor: COLORS.border },
  tipoRow: { flexDirection: 'row', gap: 12 },
  tipoPill: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', backgroundColor: COLORS.inputBg, borderWidth: 1, borderColor: COLORS.border },
  tipoPillActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  tipoPillBad: { backgroundColor: COLORS.red, borderColor: COLORS.red },
  tipoPillTxt: { color: COLORS.textSecondary, fontWeight: '600' },
  colorRow: { flexDirection: 'row', gap: 10, marginTop: 4, flexWrap: 'wrap' },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff' },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  archiveBtn: { backgroundColor: COLORS.yellow + '33', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: COLORS.yellow + '55' },
  archiveBtnTxt: { color: COLORS.yellow, fontWeight: '600' },
  cancelBtn: { backgroundColor: COLORS.border, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  cancelBtnTxt: { color: COLORS.textSecondary, fontWeight: '600' },
});
