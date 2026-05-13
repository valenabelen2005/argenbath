import { useState, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { getSleepLogsRange } from '../db/sleepQueries';
import { getStrainLogsRange } from '../db/strainQueries';
import { getRecentStressLogs } from '../db/stressQueries';
import { getAllHabitLogsForRange, getAllHabits } from '../db/habitsQueries';
import { getJournalEntriesRange } from '../db/journalQueries';

const dateStr = (d) => format(d, 'yyyy-MM-dd');

export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (days = 30) => {
    setLoading(true);
    try {
      const today = new Date();
      const since = subDays(today, days - 1);
      const sinceStr = dateStr(since);
      const todayStr = dateStr(today);

      const [sleepLogs, strainLogs, stressLogs, habits, habitLogs, journalEntries] =
        await Promise.all([
          getSleepLogsRange(sinceStr, todayStr),
          getStrainLogsRange(sinceStr, todayStr),
          getRecentStressLogs(days),
          getAllHabits(),
          getAllHabitLogsForRange(sinceStr, todayStr),
          getJournalEntriesRange(sinceStr, todayStr),
        ]);

      const avgRecovery =
        sleepLogs.length
          ? Math.round(sleepLogs.reduce((a, b) => a + (b.recovery_score || 0), 0) / sleepLogs.length)
          : 0;

      const avgStrain =
        strainLogs.length
          ? (strainLogs.reduce((a, b) => a + b.strain_score, 0) / strainLogs.length).toFixed(1)
          : 0;

      const avgMood =
        journalEntries.length
          ? (journalEntries.reduce((a, b) => a + (b.estado_animo || 0), 0) / journalEntries.length).toFixed(1)
          : 0;

      // Habit completion per day
      const habitsByDate = {};
      for (const log of habitLogs) {
        if (!habitsByDate[log.fecha]) habitsByDate[log.fecha] = { done: 0, total: 0 };
        habitsByDate[log.fecha].total++;
        if (log.completado) habitsByDate[log.fecha].done++;
      }
      const habitDays = Object.values(habitsByDate);
      const avgHabitPct =
        habitDays.length
          ? Math.round(
              habitDays.reduce((a, b) => a + (b.total ? (b.done / b.total) * 100 : 0), 0) /
                habitDays.length
            )
          : 0;

      // Correlations: for each habit, avg recovery when done vs not done
      const correlations = [];
      for (const habit of habits) {
        const habitSpecific = habitLogs.filter((l) => l.habit_id === habit.id);
        const sleepMap = {};
        for (const s of sleepLogs) sleepMap[s.fecha] = s.recovery_score;

        const withDone = [];
        const withoutDone = [];
        for (const log of habitSpecific) {
          const r = sleepMap[log.fecha];
          if (r == null) continue;
          if (log.completado) withDone.push(r);
          else withoutDone.push(r);
        }
        const avg = (arr) =>
          arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
        const avgWith = avg(withDone);
        const avgWithout = avg(withoutDone);
        if (avgWith != null && avgWithout != null && withDone.length >= 3) {
          const diff = avgWith - avgWithout;
          if (Math.abs(diff) >= 5) {
            correlations.push({ habit, diff: Math.round(diff) });
          }
        }
      }
      correlations.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

      setStats({
        avgRecovery,
        avgStrain,
        avgMood,
        avgHabitPct,
        correlations: correlations.slice(0, 3),
        sleepLogs,
        strainLogs,
        stressLogs,
        journalEntries,
        habitLogs,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, refresh };
}
