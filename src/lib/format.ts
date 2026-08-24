import type { BotswanaPhone } from '@/types';

/** Botswana numbers are shown as +267 71 234 567. */
export function formatPhone(phone: BotswanaPhone): string {
  const digits = phone.replace(/\D/g, '');
  const national = digits.startsWith('267') ? digits.slice(3) : digits;
  if (national.length !== 8) return phone;
  return `+267 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
}

export function telHref(phone: BotswanaPhone): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits.startsWith('267') ? digits : `267${digits}`}`;
}

/** 24-hour clock, as used on the dispatcher console: "14:32". */
export function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--:--';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** "7 min" / "1 min" / "Less than a minute". */
export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return 'Not available';
  if (minutes < 1) return 'Less than a minute';
  return `${Math.round(minutes)} min`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/** Elapsed time since an ISO timestamp, as "4 min 12 s". */
export function formatElapsed(fromIso: string, nowMs: number): string {
  const started = new Date(fromIso).getTime();
  if (Number.isNaN(started)) return '--';
  const totalSeconds = Math.max(0, Math.floor((nowMs - started) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds} s`;
  return `${minutes} min ${String(seconds).padStart(2, '0')} s`;
}

/** Greeting used on the patient home screen. */
export function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Botswana pula pricing, e.g. "P 45 / month". */
export function formatPula(amount: number, per?: 'month' | 'year'): string {
  const base = `P ${amount.toFixed(0)}`;
  return per ? `${base} / ${per}` : base;
}

/** Omang numbers are never shown in full outside the patient's own profile. */
export function maskOmang(omang: string): string {
  if (omang.length <= 4) return '••••';
  return `${'•'.repeat(omang.length - 4)}${omang.slice(-4)}`;
}
