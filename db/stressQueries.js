import { getDatabase } from './database';

export async function getStressLog(fecha) {
  const db = await getDatabase();
  return db.getFirstAsync(
    "SELECT * FROM stress_logs WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
}

export async function upsertStressLog(fecha, stress_nivel) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync(
    "SELECT id FROM stress_logs WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
  if (existing) {
    await db.runAsync(
      'UPDATE stress_logs SET stress_nivel = ? WHERE id = ?',
      [stress_nivel, existing.id]
    );
  } else {
    await db.runAsync(
      "INSERT INTO stress_logs (user_id, fecha, stress_nivel) VALUES ('local_user', ?, ?)",
      [fecha, stress_nivel]
    );
  }
}

export async function getRecentStressLogs(days = 7) {
  const db = await getDatabase();
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  const sinceStr = since.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  return db.getAllAsync(
    "SELECT * FROM stress_logs WHERE user_id = 'local_user' AND fecha >= ? AND fecha <= ? ORDER BY fecha",
    [sinceStr, today]
  );
}
