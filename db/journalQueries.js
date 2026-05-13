import { getDatabase } from './database';

export async function getJournalEntry(fecha) {
  const db = await getDatabase();
  return db.getFirstAsync(
    "SELECT * FROM journal_entries WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
}

export async function upsertJournalEntry(data) {
  const db = await getDatabase();
  const { fecha, estado_animo, como_me_siento, reflexiones, gratitud_1, gratitud_2, gratitud_3 } = data;
  const existing = await db.getFirstAsync(
    "SELECT id FROM journal_entries WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
  if (existing) {
    await db.runAsync(
      `UPDATE journal_entries SET estado_animo=?, como_me_siento=?, reflexiones=?,
       gratitud_1=?, gratitud_2=?, gratitud_3=? WHERE id=?`,
      [estado_animo, como_me_siento, reflexiones, gratitud_1, gratitud_2, gratitud_3, existing.id]
    );
  } else {
    await db.runAsync(
      `INSERT INTO journal_entries (user_id, fecha, estado_animo, como_me_siento, reflexiones,
       gratitud_1, gratitud_2, gratitud_3) VALUES ('local_user', ?, ?, ?, ?, ?, ?, ?)`,
      [fecha, estado_animo, como_me_siento, reflexiones, gratitud_1, gratitud_2, gratitud_3]
    );
  }
}

export async function getRecentJournalEntries(limit = 30) {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT * FROM journal_entries WHERE user_id = 'local_user' ORDER BY fecha DESC LIMIT ?",
    [limit]
  );
}

export async function searchJournalEntries(query) {
  const db = await getDatabase();
  const q = `%${query}%`;
  return db.getAllAsync(
    `SELECT * FROM journal_entries WHERE user_id = 'local_user'
     AND (como_me_siento LIKE ? OR reflexiones LIKE ? OR fecha LIKE ?)
     ORDER BY fecha DESC`,
    [q, q, q]
  );
}

export async function getJournalEntriesRange(since, until) {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT * FROM journal_entries WHERE user_id = 'local_user' AND fecha >= ? AND fecha <= ? ORDER BY fecha",
    [since, until]
  );
}
