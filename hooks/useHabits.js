import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  getAllHabits,
  getHabitLog,
  upsertHabitLog,
  getHabitStreak,
  getHabitCompletionRate,
  getHabitLogsForDate,
  getAllHabitLogsForRange,
  createHabit,
  archiveHabit,
} from '../db/habitsQueries';
import { getSleepLogsRange } from '../db/sleepQueries';

const TODAY = () => format(new Date(), 'yyyy-MM-dd');

export function useHabits(fecha = null) {
  const targetDate = fecha || TODAY();
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [streaks, setStreaks] = useState({});
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllHabits();
      setHabits(all);
      const logsMap = {};
      const streakMap = {};
      const rateMap = {};
      await Promise.all(
        all.map(async (h) => {
          const log = await getHabitLog(h.id, targetDate);
          logsMap[h.id] = log;
          streakMap[h.id] = await getHabitStreak(h.id);
          rateMap[h.id] = await getHabitCompletionRate(h.id, 7);
        })
      );
      setLogs(logsMap);
      setStreaks(streakMap);
      setRates(rateMap);
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  const toggle = useCallback(
    async (habitId, nota = null) => {
      const current = logs[habitId];
      const newVal = current ? !current.completado : true;
      await upsertHabitLog(habitId, targetDate, newVal, nota);
      setLogs((prev) => ({
        ...prev,
        [habitId]: { ...(prev[habitId] || {}), completado: newVal },
      }));
      const newStreak = await getHabitStreak(habitId);
      setStreaks((prev) => ({ ...prev, [habitId]: newStreak }));
    },
    [logs, targetDate]
  );

  const addHabit = useCallback(async (nombre, tipo, color) => {
    await createHabit(nombre, tipo, color);
    await refresh();
  }, [refresh]);

  const archive = useCallback(async (id) => {
    await archiveHabit(id);
    await refresh();
  }, [refresh]);

  const todayStats = {
    total: habits.length,
    completados: Object.values(logs).filter((l) => l?.completado).length,
  };

  // Returns correlation: % recovery days when habit was done vs not done
  const getCorrelation = useCallback(async (habitId) => {
    const days = 30;
    const until = TODAY();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = format(since, 'yyyy-MM-dd');

    const habitLogs = await getAllHabitLogsForRange(sinceStr, until);
    const sleepLogs = await getSleepLogsRange(sinceStr, until);

    const sleepMap = {};
    for (const s of sleepLogs) sleepMap[s.fecha] = s.recovery_score;

    const withHabit = [];
    const withoutHabit = [];

    for (const log of habitLogs) {
      if (log.habit_id !== habitId) continue;
      const recovery = sleepMap[log.fecha];
      if (recovery == null) continue;
      if (log.completado) withHabit.push(recovery);
      else withoutHabit.push(recovery);
    }

    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    return {
      withHabit: avg(withHabit),
      withoutHabit: avg(withoutHabit),
    };
  }, []);

  return { habits, logs, streaks, rates, loading, refresh, toggle, addHabit, archive, todayStats, getCorrelation };
}
