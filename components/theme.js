export const COLORS = {
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceAlt: '#222222',
  accent: '#7C5CFC',
  accentLight: 'rgba(124,92,252,0.15)',
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
  text: '#F0F0F0',
  textSecondary: '#888888',
  border: '#2A2A2A',
  inputBg: '#252525',
};

export function getRecoveryColor(score) {
  if (score >= 67) return COLORS.green;
  if (score >= 34) return COLORS.yellow;
  return COLORS.red;
}

export function getStrainLabel(score) {
  if (score <= 3) return 'Reposo';
  if (score <= 8) return 'Ligero';
  if (score <= 14) return 'Serio';
  if (score <= 18) return 'Muy exigente';
  return 'Extremo';
}

export function getStrainColor(score) {
  if (score <= 3) return COLORS.green;
  if (score <= 8) return '#60A5FA';
  if (score <= 14) return COLORS.yellow;
  if (score <= 18) return '#F97316';
  return COLORS.red;
}

export function getMoodEmoji(score) {
  if (score <= 2) return '😔';
  if (score <= 4) return '😕';
  if (score <= 6) return '😐';
  if (score <= 8) return '🙂';
  return '😄';
}

export const TYPOGRAPHY = {
  title: { fontSize: 28, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: 20, fontWeight: '600', color: COLORS.text },
  body: { fontSize: 15, color: COLORS.text },
  caption: { fontSize: 13, color: COLORS.textSecondary },
  tiny: { fontSize: 11, color: COLORS.textSecondary },
};
