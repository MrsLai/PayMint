export function formatCurrency(
  amount: number,
  currencySymbol = '$',
  decimals = 2
): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const sign = safe < 0 ? '-' : '';
  const abs = Math.abs(safe);
  const formatted = abs.toLocaleString('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${sign}${currencySymbol}${formatted}`;
}

export function formatConvertedCurrency(
  amountInBase: number,
  exchangeRate: number,
  symbol: string,
  decimals = 2
): string {
  const converted = amountInBase * Math.max(0, exchangeRate);
  return formatCurrency(converted, symbol, decimals);
}

export function formatCompactCurrency(
  amount: number,
  currencySymbol = '$'
): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const sign = safe < 0 ? '-' : '';
  const abs = Math.abs(safe);

  if (abs >= 1_000_000_000_000) {
    return `${sign}${currencySymbol}${(abs / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}${currencySymbol}${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${currencySymbol}${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${currencySymbol}${(abs / 1_000).toFixed(abs >= 100_000 ? 0 : 1)}K`;
  }
  return `${sign}${currencySymbol}${Math.round(abs).toLocaleString('en-AU')}`;
}

export function formatHours(hours: number): string {
  const safe = Number.isFinite(hours) ? hours : 0;
  return `${safe.toFixed(2)}h`;
}

export function formatElapsedClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split('-').map(Number);
  if (!y || !m) return monthKey;
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
}

export function formatShortDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getDayOfWeek(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return 1;
  return new Date(y, m - 1, d).getDay(); // 0=Sun, 6=Sat
}

export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

export function computeNetShiftHours(
  startTime: string,
  endTime: string,
  breakMinutes: number
): number {
  let start = parseTimeToMinutes(startTime);
  let end = parseTimeToMinutes(endTime);
  if (end < start) {
    // overnight shift
    end += 24 * 60;
  }
  const netMinutes = Math.max(0, end - start - Math.max(0, breakMinutes));
  return Math.round((netMinutes / 60) * 100) / 100;
}

export function addHoursToTime(startTime: string, netHours: number, breakMinutes: number): string {
  const startMin = parseTimeToMinutes(startTime);
  const totalMin = Math.round(startMin + netHours * 60 + breakMinutes);
  const wrapped = ((totalMin % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
