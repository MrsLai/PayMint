export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  fallbackRateFromAud: number;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2, fallbackRateFromAud: 1.0 },
  { code: 'USD', name: 'US Dollar', symbol: 'US$', decimals: 2, fallbackRateFromAud: 0.655 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', decimals: 2, fallbackRateFromAud: 22.45 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, fallbackRateFromAud: 0.515 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, fallbackRateFromAud: 0.605 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, fallbackRateFromAud: 1.10 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, fallbackRateFromAud: 0.875 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0, fallbackRateFromAud: 100.5 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2, fallbackRateFromAud: 0.91 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimals: 2, fallbackRateFromAud: 2.90 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0, fallbackRateFromAud: 10350 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2, fallbackRateFromAud: 38.2 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', decimals: 0, fallbackRateFromAud: 16600 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, fallbackRateFromAud: 55.2 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2, fallbackRateFromAud: 4.72 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2, fallbackRateFromAud: 5.10 },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', decimals: 0, fallbackRateFromAud: 21.1 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0, fallbackRateFromAud: 910 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, fallbackRateFromAud: 3.75 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2, fallbackRateFromAud: 13.1 },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', decimals: 0, fallbackRateFromAud: 2820 },
  { code: 'CLP', name: 'Chilean Peso', symbol: 'CLP$', decimals: 0, fallbackRateFromAud: 635 },
  { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', decimals: 0, fallbackRateFromAud: 660 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', decimals: 2, fallbackRateFromAud: 2.45 },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', decimals: 0, fallbackRateFromAud: 332 },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', decimals: 2, fallbackRateFromAud: 27.5 },
];

export function getCurrencyOption(code: string): CurrencyOption | undefined {
  return CURRENCY_OPTIONS.find((c) => c.code === code);
}
