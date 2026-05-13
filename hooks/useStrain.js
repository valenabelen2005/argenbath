import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  getStrainLog,
  upsertStrainLog,
  getRecentStrainLogs,
  getStrainLogsRange,
} from '../db/strainQueries';

const TODAY = () => format(new Date(), 'yyyy-MM-dd');

export function useStrain() {
  const [todayLog, setTodayLog] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [today, recent] = await Promise.all([
        getStrainLog(TODAY()),
        getRecentStrainLogs(30),
      ]);
      setTodayLog(today);
      setRecentLogs(recent);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveStrain = useCallback(async (score, nota = null) => {
    await upsertStrainLog(TODAY(), score, nota);
    await refresh();
  }, [refresh]);

  const getLogsRange = useCallback(async (since, until) => {
    return getStrainLogsRange(since, until);
  }, []);

  return { todayLog, recentLogs, loading, refresh, saveStrain, getLogsRange };
}
