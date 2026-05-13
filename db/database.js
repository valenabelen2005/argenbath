import * as SQLite from 'expo-sqlite';

let _db = null;

export async function getDatabase() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('wellness.db');
  await _initTables(_db);
  return _db;
}

async function _initTables(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('bueno', 'malo')),
      color TEXT NOT NULL DEFAULT '#7C5CFC',
      activo INTEGER NOT NULL DEFAULT 1,
      fecha_creacion TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      habit_id INTEGER NOT NULL,
      fecha TEXT NOT NULL,
      completado INTEGER NOT NULL DEFAULT 0,
      nota TEXT,
      FOREIGN KEY (habit_id) REFERENCES habits(id)
    );

    CREATE TABLE IF NOT EXISTS sleep_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      fecha TEXT NOT NULL UNIQUE,
      hora_dormir TEXT,
      hora_despertar TEXT,
      horas_dormidas REAL,
      calidad INTEGER,
      energia INTEGER,
      nota TEXT,
      recovery_score REAL DEFAULT 0,
      deuda_acumulada REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS strain_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      fecha TEXT NOT NULL UNIQUE,
      strain_score REAL NOT NULL,
      nota TEXT
    );

    CREATE TABLE IF NOT EXISTS stress_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      fecha TEXT NOT NULL UNIQUE,
      stress_nivel INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      fecha TEXT NOT NULL UNIQUE,
      estado_animo INTEGER,
      como_me_siento TEXT,
      reflexiones TEXT,
      gratitud_1 TEXT,
      gratitud_2 TEXT,
      gratitud_3 TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL DEFAULT 'local_user',
      meta_sueno REAL NOT NULL DEFAULT 8.0,
      notif_habitos_hora TEXT NOT NULL DEFAULT '21:00',
      notif_sueno_hora TEXT NOT NULL DEFAULT '09:00',
      notif_recordatorio_hora TEXT NOT NULL DEFAULT '23:00',
      notif_habitos_activa INTEGER NOT NULL DEFAULT 1,
      notif_sueno_activa INTEGER NOT NULL DEFAULT 1,
      notif_recordatorio_activa INTEGER NOT NULL DEFAULT 1
    );
  `);

  const existing = await db.getFirstAsync(
    "SELECT id FROM settings WHERE user_id = 'local_user'"
  );
  if (!existing) {
    await db.runAsync(
      "INSERT INTO settings (user_id) VALUES ('local_user')"
    );
  }
}
