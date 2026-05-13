import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Wellness Tracker',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function cancelIdentifier(id) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (_) {}
}

export async function scheduleAllNotifications(settings) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings) return;

  const parseHour = (str) => {
    const [h, m] = (str || '09:00').split(':').map(Number);
    return { hour: h, minute: m || 0 };
  };

  if (settings.notif_sueno_activa) {
    const { hour, minute } = parseHour(settings.notif_sueno_hora);
    await Notifications.scheduleNotificationAsync({
      identifier: 'notif_sueno',
      content: {
        title: 'Wellness — Sueño',
        body: '¿Cómo dormiste anoche? Registrá tu sueño.',
        sound: true,
      },
      trigger: { hour, minute, repeats: true },
    });
  }

  if (settings.notif_habitos_activa) {
    const { hour, minute } = parseHour(settings.notif_habitos_hora);
    await Notifications.scheduleNotificationAsync({
      identifier: 'notif_habitos',
      content: {
        title: 'Wellness — Hábitos',
        body: '¿Registraste tus hábitos de hoy?',
        sound: true,
      },
      trigger: { hour, minute, repeats: true },
    });
  }

  if (settings.notif_recordatorio_activa) {
    const { hour, minute } = parseHour(settings.notif_recordatorio_hora);
    await Notifications.scheduleNotificationAsync({
      identifier: 'notif_recordatorio',
      content: {
        title: 'Wellness',
        body: 'Hoy todavía no registraste nada.',
        sound: true,
      },
      trigger: { hour, minute, repeats: true },
    });
  }
}
