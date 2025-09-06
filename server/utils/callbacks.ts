// server/utils/callbacks.ts
export type JsonObject = Record<string, unknown>;

/**
 * Normalize MSISDN-ish values to a 254... string when possible.
 * Returns null if input is falsy.
 */
export function normalizePhone(raw?: unknown): string | null {
  if (raw === undefined || raw === null) {
    return null;
  }
  const s = String(raw).replace(/\D/g, '');
  if (s.length === 9 && s.startsWith('7')) {
    return `254${s}`;
  }
  if (s.length === 10 && s.startsWith('0')) {
    return `254${s.slice(1)}`;
  }
  if (s.startsWith('254')) {
    return s;
  }
  if (s.startsWith('+')) {
    return s.slice(1);
  }
  // if we cannot transform safely, return raw digits (may be useful)
  return s || null;
}

/**
 * Parse various transaction date formats into an ISO string.
 * Returns null if not parseable.
 */
export function parseTransactionDate(raw?: unknown): string | null {
  if (raw === undefined || raw === null) {
    return null;
  }
  const txt = String(raw).trim();
  // pattern: "YYYYMMDD HHMMSS" or "YYYYMMDDHHMMSS"
  const compact = txt.replace(/\s+/g, '');
  if (/^\d{14}$/.test(compact)) {
    const year = compact.slice(0, 4);
    const month = compact.slice(4, 6);
    const day = compact.slice(6, 8);
    const hour = compact.slice(8, 10);
    const minute = compact.slice(10, 12);
    const second = compact.slice(12, 14);
    const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  // try Date.parse for ISO or common formats
  const d = new Date(txt);
  if (!Number.isNaN(d.getTime())) return d.toISOString();

  // if number epoch seconds or ms
  const n = Number(txt);
  if (!Number.isNaN(n)) {
    if (n < 1e12) {
      return new Date(n * 1000).toISOString();
    }
    return new Date(n).toISOString();
  }

  return null;
}
