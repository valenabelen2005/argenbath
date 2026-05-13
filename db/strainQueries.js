import { getDatabase } from './database';

export async function getStrainLog(fecha) {
  const db = await getDatabase();
  return db.getFirstAsync(
    "SELECT * FROM strain_logs WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
}

export async function upsertStrainLog(fecha, strain_score, nota = null) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync(
    "SELECT id FROM strain_logs WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
  if (existing) {
    await db.runAsync(
      'UPDATE strain_logs SET strain_score = ?, nota = ? WHERE id = ?',
      [strain_score, nota, existing.id]
    );
  } else {
    await db.runAsync(
      "INSERT INTO strain_logs (user_id, fecha, strain_score, nota) VALUES ('local_user', ?, ?, ?)",
      [fecha, strain_score, nota]
    );
  }
}

export async function getStrainLogsRange(since, until) {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT * FROM strain_logs WHERE user_id = 'local_user' AND fecha >= ? AND fecha <= ? ORDER BY fecha",
    [since, until]
  );
}

export async function getRecentStrainLogs(days = 7) {
  const db = await getDatabase();
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  const sinceStr = since.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  return db.getAllAsync(
    "SELECT * FROM strain_logs WHERE user_id = 'local_user' AND fecha >= ? AND fecha <= ? ORDER BY fecha",
    [sinceStr, today]
  );
}
