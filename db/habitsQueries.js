import { getDatabase } from './database';

export async function getAllHabits() {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT * FROM habits WHERE user_id = 'local_user' AND activo = 1 ORDER BY fecha_creacion DESC"
  );
}

export async function getArchivedHabits() {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT * FROM habits WHERE user_id = 'local_user' AND activo = 0 ORDER BY fecha_creacion DESC"
  );
}

export async function createHabit(nombre, tipo, color = '#7C5CFC') {
  const db = await getDatabase();
  const fecha = new Date().toISOString().split('T')[0];
  const result = await db.runAsync(
    "INSERT INTO habits (user_id, nombre, tipo, color, fecha_creacion) VALUES ('local_user', ?, ?, ?, ?)",
    [nombre, tipo, color, fecha]
  );
  return result.lastInsertRowId;
}

export async function archiveHabit(id) {
  const db = await getDatabase();
  await db.runAsync('UPDATE habits SET activo = 0 WHERE id = ?', [id]);
}

export async function deleteHabit(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ?', [id]);
  await db.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}

export async function getHabitLog(habitId, fecha) {
  const db = await getDatabase();
  return db.getFirstAsync(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND fecha = ?',
    [habitId, fecha]
  );
}

export async function getHabitLogsForDate(fecha) {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT hl.*, h.nombre, h.tipo, h.color FROM habit_logs hl JOIN habits h ON h.id = hl.habit_id WHERE hl.fecha = ? AND h.user_id = 'local_user'",
    [fecha]
  );
}

export async function upsertHabitLog(habitId, fecha, completado, nota = null) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync(
    'SELECT id FROM habit_logs WHERE habit_id = ? AND fecha = ?',
    [habitId, fecha]
  );
  if (existing) {
    await db.runAsync(
      'UPDATE habit_logs SET completado = ?, nota = ? WHERE id = ?',
      [completado ? 1 : 0, nota, existing.id]
    );
  } else {
    await db.runAsync(
      "INSERT INTO habit_logs (user_id, habit_id, fecha, completado, nota) VALUES ('local_user', ?, ?, ?, ?)",
      [habitId, fecha, completado ? 1 : 0, nota]
    );
  }
}

export async function getHabitStreak(habitId) {
  const db = await getDatabase();
  const logs = await db.getAllAsync(
    'SELECT fecha, completado FROM habit_logs WHERE habit_id = ? ORDER BY fecha DESC',
    [habitId]
  );
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let cursor = new Date();
  for (const log of logs) {
    const expected = cursor.toISOString().split('T')[0];
    if (log.fecha === expected && log.completado) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (log.fecha === today && !log.completado) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function getHabitCompletionRate(habitId, days = 7) {
  const db = await getDatabase();
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  const sinceStr = since.toISOString().split('T')[0];
  const logs = await db.getAllAsync(
    'SELECT completado FROM habit_logs WHERE habit_id = ? AND fecha >= ?',
    [habitId, sinceStr]
  );
  if (logs.length === 0) return 0;
  const done = logs.filter((l) => l.completado).length;
  return Math.round((done / days) * 100);
}

export async function getHabitLogsRange(habitId, since, until) {
  const db = await getDatabase();
  return db.getAllAsync(
    'SELECT * FROM habit_logs WHERE habit_id = ? AND fecha >= ? AND fecha <= ? ORDER BY fecha',
    [habitId, since, until]
  );
}

export async function getAllHabitLogsForRange(since, until) {
  const db = await getDatabase();
  return db.getAllAsync(
    "SELECT hl.*, h.nombre, h.tipo, h.color FROM habit_logs hl JOIN habits h ON h.id = hl.habit_id WHERE hl.fecha >= ? AND hl.fecha <= ? AND h.user_id = 'local_user' ORDER BY hl.fecha",
    [since, until]
  );
}
