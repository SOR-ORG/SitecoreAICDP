import { clsx, type ClassValue } from 'clsx';
import { initialize } from 'next/dist/server/lib/render-server';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function dateFormatter(inputDate: string): string {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    return inputDate; // fallback for invalid dates
  }

  const day = date.getDate();

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${monthName} ${year}`;
}




export const formatCurrency = (amount?: number, currency = 'EUR') =>
  typeof amount === 'number'
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
    : '';



type Split = { peak: number | null; offPeak: number | null };

/** Convert "70%", "70", "0.7" → 70; returns null on invalid. */
export const toPercentNumber = (val: string | null | undefined): number | null => {
  if (val == null) return null;
  const s = val.trim();
  if (!s) return null;

  // "70%" → 70
  if (/^-?\d+(\.\d+)?%$/.test(s)) {
    const n = parseFloat(s.slice(0, -1));
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
    }

  // "0.7" or "70"
  const n = Number(s);
  if (!Number.isFinite(n)) return null;

  // 0–1 → fraction to percent; 1–100 → already percent
  if (n >= 0 && n <= 1) return Math.round(n * 100);
  if (n > 1 && n <= 100) return Math.round(n);

  return null;
};

/** Safely JSON.parse a string that looks like JSON; otherwise return the original string. */
const safeParseJsonString = (val: string | null | undefined): unknown => {
  if (val == null) return null;
  const s = val.trim();
  if (!s) return null;
  if (!(s.startsWith('{') || s.startsWith('['))) return s; // not JSON → return raw string
  try {
    return JSON.parse(s);
  } catch {
    // Keep it non-throwing; return raw string
    return s;
  }
};

const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

const isArray = (x: unknown): x is unknown[] => Array.isArray(x);

/** Try to pick a string-like value by keys; returns string|null. */
const pickStringValue = (obj: Record<string, unknown>, keys: readonly string[]): string | null => {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const v = obj[k];
      if (v == null) return null;
      return String(v);
    }
  }
  return null;
};

/** Lowercases a possibly-unknown value in a safe way. */
const lower = (v: unknown): string => String(v ?? '').toLowerCase();

/** Find an item in an unknown[] where label/name equals one of the targets (case-insensitive). */
const findLabeledItem = (arr: unknown[], targets: readonly string[]): Record<string, unknown> | null => {
  for (const item of arr) {
    if (!isRecord(item)) continue;
    const label = lower(item.label);
    const name = lower(item.name);
    if (targets.includes(label) || targets.includes(name)) {
      return item;
    }
  }
  return null;
};

/** Normalize split-like JSON *string* into {peak, offPeak} as integer percentages (0–100). */
export const normalizeSplit = (raw: string | null | undefined): Split => {
  const parsed = safeParseJsonString(raw);

  // A) Array JSON: ["70%","30%"] or [70,30] or ["0.7","0.3"] …
  if (isArray(parsed)) {
    // Simple tuple form: [peak, offPeak]
    if (parsed.length === 2 && !isRecord(parsed[0]) && !isRecord(parsed[1])) {
      const p = parsed[0] != null ? String(parsed[0]) : null;
      const o = parsed[1] != null ? String(parsed[1]) : null;
      return { peak: toPercentNumber(p), offPeak: toPercentNumber(o) };
    }

    // Labeled objects: [{label:'peak',value:'70%'}, {label:'offPeak',value:'30%'}]
    const peakObj = findLabeledItem(parsed, ['peak']);
    const offObj = findLabeledItem(parsed, ['offpeak', 'off_peak']);

    if (peakObj || offObj) {
      const pv = peakObj ? pickStringValue(peakObj, ['value', 'val', 'amount', 'data']) : null;
      const ov = offObj ? pickStringValue(offObj, ['value', 'val', 'amount', 'data']) : null;
      return { peak: toPercentNumber(pv), offPeak: toPercentNumber(ov) };
    }

    // Unrecognized array shape
    return { peak: null, offPeak: null };
  }

  // B) Object JSON: {"peak":"70%","offPeak":"30%"} (and variants)
  if (isRecord(parsed)) {
    const peakRaw = pickStringValue(parsed, ['peak', 'peakRate', 'peak_percent', 'peakPct', 'peakValue']);
    const offRaw  = pickStringValue(parsed, ['offPeak', 'off_peak', 'offPeakRate', 'offpeak', 'offPct', 'off_percent', 'offValue']);
    if (peakRaw !== null || offRaw !== null) {
      return { peak: toPercentNumber(peakRaw), offPeak: toPercentNumber(offRaw) };
    }
    return { peak: null, offPeak: null };
  }

  // C) Plain non-JSON string → try CSV "70,30" or single scalar "70"
  if (typeof parsed === 'string') {
    const csv = parsed.split(',').map((p) => p.trim());
    if (csv.length === 2) {
      return { peak: toPercentNumber(csv[0] || null), offPeak: toPercentNumber(csv[1] || null) };
    }
    return { peak: toPercentNumber(parsed), offPeak: null };
  }

  return { peak: null, offPeak: null };
};

/** Tariff to percent equivalents (from string). Currently same logic as split. */
export const normalizeTariffToPercent = (raw: string | null | undefined): Split => normalizeSplit(raw);

/** "70" -> "70%" ; null -> "-" */
export const formatPercent = (n: number | null): string => (n == null ? '-' : `${n}%`);


