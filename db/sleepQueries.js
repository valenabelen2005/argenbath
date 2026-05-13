import { getDatabase } from './database';

export async function getSleepLog(fecha) {
  const db = await getDatabase();
  return db.getFirstAsync(
    "SELECT * FROM sleep_logs WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
}

export async function upsertSleepLog(data) {
  const db = await getDatabase();
  const {
    fecha,
    hora_dormir,
    hora_despertar,
    horas_dormidas,
    calidad,
    energia,
    nota,
    recovery_score,
    deuda_acumulada,
  } = data;
  const existing = await db.getFirstAsync(
    "SELECT id FROM sleep_logs WHERE fecha = ? AND user_id = 'local_user'",
    [fecha]
  );
  if (existing) {
    await db.runAsync(
      `UPDATE sleep_logs SET hora_dormir=?, hora_despertar=?, horas_dormidas=?,
       calidad=?, energia=?, nota=?, recovery_score=?, deuda_acumulada=? WHERE id=?`,
      [hora_dormir, hora_despertar, horas_dormidas, calidad, energia, nota, recovery_score, deuda_acumulada, existing.id]
    );
  } else {
    await db.runAsync(
      `INSERT INTO sleep_logs (user_id, fecha, hora_dormir, hora_despertar, horas_dormidas,
       calidad, energia, nota, recovery_score, deuda_acumulada)
       VALUES ('local_user', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fecha, hora_dormir, hora_despertar, horas_dormidas, calidad, energia, nota, recovery_score, deuda_acumulada]
    );
  }
}

export async function getSleepLogsRange(since, until) {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT * FROM sleep_logs WHERE user_id = 'local_user' AND fecha >= ? AND fecha <= ? ORDER BY fecha",
    [since, until]
  );
}

export async function getRecentSleepLogs(days = 7) {
  const db = await getDatabase();
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  const sinceStr = since.toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];
  return db.getAllAsync(
    "SELECT * FROM sleep_logs WHERE user_id = 'local_user' AND fecha >= ? AND fecha <= ? ORDER BY fecha",
    [sinceStr, today]
  );
}

export async function computeWeeklyDebt(metaSueno = 8) {
  const logs = await getRecentSleepLogs(7);
  let debt = 0;
  for (const log of logs) {
    if (log.horas_dormidas != null) {
      debt += metaSueno - log.horas_dormidas;
    }
  }
  return Math.max(0, debt);
}
