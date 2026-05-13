import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { COLORS, getRecoveryColor, getStrainColor } from '../components/theme';
import DayDetailModal from '../components/DayDetailModal';
import { getSleepLogsRange } from '../db/sleepQueries';
import { getStrainLogsRange } from '../db/strainQueries';
import { getAllHabitLogsForRange, getAllHabits } from '../db/habitsQueries';

const VIEWS = ['hábitos', 'sueño', 'strain'];

export default function CalendarScreen() {
  const [view, setView] = useState('sueño');
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'));

  useFocusEffect(
    useCallback(() => {
      loadMarks(currentMonth);
    }, [view, currentMonth])
  );

  const loadMarks = async (monthStr) => {
    const [year, month] = monthStr.split('-').map(Number);
    const start = format(startOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
    const end = format(endOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');

    const marks = {};

    if (view === 'sueño') {
      const logs = await getSleepLogsRange(start, end);
      for (const log of logs) {
        const color = getRecoveryColor(log.recovery_score || 0);
        marks[log.fecha] = {
          customStyles: {
            container: { backgroundColor: color + '33', borderRadius: 8, borderWidth: 1, borderColor: color + '66' },
            text: { color, fontWeight: '600' },
          },
        };
      }
    } else if (view === 'strain') {
      const logs = await getStrainLogsRange(start, end);
      for (const log of logs) {
        const color = getStrainColor(log.strain_score);
        marks[log.fecha] = {
          customStyles: {
            container: { backgroundColor: color + '33', borderRadius: 8, borderWidth: 1, borderColor: color + '66' },
            text: { color, fontWeight: '600' },
          },
        };
      }
    } else if (view === 'hábitos') {
      const [habits, habitLogs] = await Promise.all([
        getAllHabits(),
        getAllHabitLogsForRange(start, end),
      ]);
      const total = habits.length;
      if (total > 0) {
        const byDate = {};
        for (const log of habitLogs) {
          if (!byDate[log.fecha]) byDate[log.fecha] = { done: 0, total: 0 };
          byDate[log.fecha].total++;
          if (log.completado) byDate[log.fecha].done++;
        }
        for (const [fecha, stats] of Object.entries(byDate)) {
          const pct = stats.done / total;
          const color = pct === 1 ? COLORS.green : pct > 0 ? COLORS.yellow : COLORS.red;
          marks[fecha] = {
            customStyles: {
              container: { backgroundColor: color + '33', borderRadius: 8, borderWidth: 1, borderColor: color + '66' },
              text: { color, fontWeight: '600' },
            },
          };
        }
      }
    }

    setMarkedDates(marks);
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleMonthChange = (month) => {
    const newMonth = `${month.year}-${String(month.month).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.pageTitle}>Calendario</Text>

      {/* View filter */}
      <View style={styles.filterRow}>
        {VIEWS.map((v) => (
          <TouchableOpacity
            key={v}
            style={[styles.filterBtn, view === v && styles.filterBtnActive]}
            onPress={() => setView(v)}
          >
            <Text style={[styles.filterTxt, view === v && styles.filterTxtActive]}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.green }]} />
          <Text style={styles.legendTxt}>{view === 'hábitos' ? 'Todo cumplido' : 'Excelente'}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.yellow }]} />
          <Text style={styles.legendTxt}>{view === 'hábitos' ? 'Parcial' : 'Moderado'}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.red }]} />
          <Text style={styles.legendTxt}>{view === 'hábitos' ? 'Fallido' : 'Bajo'}</Text>
        </View>
      </View>

      <Calendar
        theme={{
          backgroundColor: COLORS.background,
          calendarBackground: COLORS.background,
          textSectionTitleColor: COLORS.textSecondary,
          selectedDayBackgroundColor: COLORS.accent,
          selectedDayTextColor: '#fff',
          todayTextColor: COLORS.accent,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.border,
          arrowColor: COLORS.accent,
          monthTextColor: COLORS.text,
          indicatorColor: COLORS.accent,
          textDayFontWeight: '500',
          textMonthFontWeight: '700',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
          dotColor: COLORS.accent,
        }}
        markedDates={markedDates}
        markingType="custom"
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        enableSwipeMonths
      />

      <DayDetailModal
        fecha={selectedDate}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  pageTitle: { fontSize: 32, fontWeight: '800', color: COLORS.text, padding: 20, paddingBottom: 12 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  filterTxt: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  filterTxtActive: { color: '#fff' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { fontSize: 12, color: COLORS.textSecondary },
});
