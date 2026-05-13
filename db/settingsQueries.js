import { getDatabase } from './database';

export async function getSettings() {
  const db = await getDatabase();
  return db.getFirstAsync("SELECT * FROM settings WHERE user_id = 'local_user'");
}

export async function updateSettings(data) {
  const db = await getDatabase();
  const {
    meta_sueno,
    notif_habitos_hora,
    notif_sueno_hora,
    notif_recordatorio_hora,
    notif_habitos_activa,
    notif_sueno_activa,
    notif_recordatorio_activa,
  } = data;
  await db.runAsync(
    `UPDATE settings SET meta_sueno=?, notif_habitos_hora=?, notif_sueno_hora=?,
     notif_recordatorio_hora=?, notif_habitos_activa=?, notif_sueno_activa=?,
     notif_recordatorio_activa=? WHERE user_id='local_user'`,
    [
      meta_sueno,
      notif_habitos_hora,
      notif_sueno_hora,
      notif_recordatorio_hora,
      notif_habitos_activa ? 1 : 0,
      notif_sueno_activa ? 1 : 0,
      notif_recordatorio_activa ? 1 : 0,
    ]
  );
}
