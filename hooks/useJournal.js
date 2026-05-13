import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import {
  getJournalEntry,
  upsertJournalEntry,
  getRecentJournalEntries,
  searchJournalEntries,
} from '../db/journalQueries';

const TODAY = () => format(new Date(), 'yyyy-MM-dd');

export function useJournal() {
  const [todayEntry, setTodayEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [today, recent] = await Promise.all([
        getJournalEntry(TODAY()),
        getRecentJournalEntries(30),
      ]);
      setTodayEntry(today);
      setEntries(recent);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveEntry = useCallback(async (data) => {
    await upsertJournalEntry({ fecha: TODAY(), ...data });
    await refresh();
  }, [refresh]);

  const search = useCallback(async (query) => {
    if (!query.trim()) {
      const recent = await getRecentJournalEntries(30);
      setEntries(recent);
      return;
    }
    const results = await searchJournalEntries(query);
    setEntries(results);
  }, []);

  return { todayEntry, entries, loading, refresh, saveEntry, search };
}
