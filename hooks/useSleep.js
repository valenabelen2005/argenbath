import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  getSleepLog,
  upsertSleepLog,
  getRecentSleepLogs,
  getSleepLogsRange,
  computeWeeklyDebt,
} from '../db/sleepQueries';
import { getSettings } from '../db/settingsQueries';

const TODAY = () => format(new Date(), 'yyyy-MM-dd');

export function computeRecovery(horas, calidad, energia) {
  const score =
    (horas / 8) * 40 + (calidad / 10) * 35 + (energia / 10) * 25;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function useSleep() {
  const [todayLog, setTodayLog] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [weeklyDebt, setWeeklyDebt] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await getSettings();
      const meta = settings?.meta_sueno ?? 8;
      const [today, recent, debt] = await Promise.all([
        getSleepLog(TODAY()),
        getRecentSleepLogs(30),
        computeWeeklyDebt(meta),
      ]);
      setTodayLog(today);
      setRecentLogs(recent);
      setWeeklyDebt(debt);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSleep = useCallback(async ({ hora_dormir, hora_despertar, calidad, energia, nota }) => {
    const settings = await getSettings();
    const meta = settings?.meta_sueno ?? 8;
    const fecha = TODAY();

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    let sleepMin = toMinutes(hora_dormir);
    let wakeMin = toMinutes(hora_despertar);
    if (wakeMin < sleepMin) wakeMin += 24 * 60;
    const horasDormidas = (wakeMin - sleepMin) / 60;
    const recovery_score = computeRecovery(horasDormidas, calidad, energia);

    const prevLogs = await getRecentSleepLogs(7);
    let deuda = 0;
    for (const l of prevLogs) {
      if (l.fecha !== fecha && l.horas_dormidas != null) {
        deuda += meta - l.horas_dormidas;
      }
    }
    deuda += meta - horasDormidas;
    const deuda_acumulada = Math.max(0, deuda);

    await upsertSleepLog({
      fecha,
      hora_dormir,
      hora_despertar,
      horas_dormidas: horasDormidas,
      calidad,
      energia,
      nota,
      recovery_score,
      deuda_acumulada,
    });

    await refresh();
    return recovery_score;
  }, [refresh]);

  const getLogsRange = useCallback(async (since, until) => {
    return getSleepLogsRange(since, until);
  }, []);

  return { todayLog, recentLogs, weeklyDebt, loading, refresh, saveSleep, getLogsRange };
}
