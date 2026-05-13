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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { COLORS, getMoodEmoji } from '../components/theme';
import { useJournal } from '../hooks/useJournal';
import { ScaleSelector } from '../components/MetricCard';

export default function JournalScreen() {
  const { todayEntry, entries, loading, refresh, saveEntry, search } = useJournal();

  const [tab, setTab] = useState('today');
  const [estadoAnimo, setEstadoAnimo] = useState(7);
  const [comoMeSiento, setComoMeSiento] = useState('');
  const [reflexiones, setReflexiones] = useState('');
  const [gratitud1, setGratitud1] = useState('');
  const [gratitud2, setGratitud2] = useState('');
  const [gratitud3, setGratitud3] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh().then(() => {
        if (todayEntry) populateForm(todayEntry);
      });
    }, [])
  );

  const populateForm = (entry) => {
    if (!entry) return;
    setEstadoAnimo(entry.estado_animo || 7);
    setComoMeSiento(entry.como_me_siento || '');
    setReflexiones(entry.reflexiones || '');
    setGratitud1(entry.gratitud_1 || '');
    setGratitud2(entry.gratitud_2 || '');
    setGratitud3(entry.gratitud_3 || '');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveEntry({
        estado_animo: estadoAnimo,
        como_me_siento: comoMeSiento,
        reflexiones,
        gratitud_1: gratitud1,
        gratitud_2: gratitud2,
        gratitud_3: gratitud3,
      });
      Alert.alert('Guardado', 'Tu entrada de hoy fue guardada.');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    search(text);
  };

  const today = format(new Date(), "d 'de' MMMM, yyyy", { locale: es });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Diario</Text>
          <View style={styles.tabs}>
            {['today', 'history'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tab, tab === t && styles.tabActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
                  {t === 'today' ? 'Hoy' : 'Historial'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {tab === 'today' && (
            <>
              <Text style={styles.dateLabel}>{today}</Text>

              {/* Mood selector */}
              <View style={styles.moodCard}>
                <Text style={styles.moodEmoji}>{getMoodEmoji(estadoAnimo)}</Text>
                <Text style={styles.moodValue}>{estadoAnimo}/10</Text>
              </View>
              <Text style={styles.fieldLabel}>Estado de ánimo</Text>
              <ScaleSelector value={estadoAnimo} onChange={setEstadoAnimo} min={1} max={10} />

              <Text style={[styles.fieldLabel, { marginTop: 20 }]}>¿Cómo me siento hoy?</Text>
              <TextInput
                style={styles.textArea}
                value={comoMeSiento}
                onChangeText={setComoMeSiento}
                placeholder="Describí tu estado actual..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
              />

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Reflexiones del día</Text>
              <TextInput
                style={styles.textArea}
                value={reflexiones}
                onChangeText={setReflexiones}
                placeholder="¿Qué aprendiste hoy? ¿Qué harías diferente?"
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={4}
              />

              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Gratitud</Text>
              {[
                [gratitud1, setGratitud1, 'Hoy agradezco...'],
                [gratitud2, setGratitud2, 'También valoro...'],
                [gratitud3, setGratitud3, 'Me alegra que...'],
              ].map(([val, setter, ph], i) => (
                <TextInput
                  key={i}
                  style={[styles.input, { marginBottom: 10 }]}
                  value={val}
                  onChangeText={setter}
                  placeholder={ph}
                  placeholderTextColor={COLORS.textSecondary}
                />
              ))}

              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.saveBtnTxt}>{saving ? 'Guardando...' : 'Guardar entrada'}</Text>
              </TouchableOpacity>
            </>
          )}

          {tab === 'history' && (
            <>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
                placeholder="Buscar por fecha o texto..."
                placeholderTextColor={COLORS.textSecondary}
              />
              {entries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryDate}>
                      {format(new Date(entry.fecha + 'T12:00'), "EEEE d 'de' MMMM", { locale: es })}
                    </Text>
                    <Text style={styles.entryMood}>
                      {getMoodEmoji(entry.estado_animo)} {entry.estado_animo}/10
                    </Text>
                  </View>
                  {entry.como_me_siento ? (
                    <Text style={styles.entryText} numberOfLines={2}>{entry.como_me_siento}</Text>
                  ) : null}
                  {entry.gratitud_1 ? (
                    <Text style={styles.entryGratitud}>🙏 {entry.gratitud_1}</Text>
                  ) : null}
                </View>
              ))}
              {entries.length === 0 && (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No hay entradas</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingBottom: 0 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 4 },
  tab: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.accent },
  tabTxt: { color: COLORS.textSecondary, fontWeight: '600' },
  tabTxtActive: { color: '#fff' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  dateLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16, textTransform: 'capitalize' },
  moodCard: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 8 },
  moodEmoji: { fontSize: 48 },
  moodValue: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  fieldLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  textArea: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border, minHeight: 100, textAlignVertical: 'top' },
  input: { backgroundColor: COLORS.inputBg, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  saveBtn: { backgroundColor: COLORS.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  saveBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  searchInput: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, color: COLORS.text, fontSize: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  entryCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  entryDate: { fontSize: 14, fontWeight: '600', color: COLORS.text, textTransform: 'capitalize', flex: 1 },
  entryMood: { fontSize: 16, color: COLORS.text },
  entryText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  entryGratitud: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { color: COLORS.textSecondary },
});
