export type ThemeMode = 'light' | 'dark' | 'midnight';

export type AccentColorId =
  | 'teal'
  | 'emerald'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'amber'
  | 'rose';

export interface AccentPreset {
  id: AccentColorId;
  name: string;
  description: string;
  swatchHex: string;
  lightChartHex: string;
  darkChartHex: string;
  midnightChartHex: string;
}

export interface ThemeModePreset {
  id: ThemeMode;
  name: string;
  shortLabel: string;
  description: string;
  metaThemeColor: string;
  previewBg: string;
  previewCard: string;
  previewBorder: string;
  previewText: string;
  previewMuted: string;
}

export const THEME_MODES: ThemeModePreset[] = [
  {
    id: 'light',
    name: 'Light Mode',
    shortLabel: 'Light',
    description: 'Clean daylight workspace with soft neutral canvas and crisp cards.',
    metaThemeColor: '#f2f6fa',
    previewBg: '#f2f6fa',
    previewCard: '#ffffff',
    previewBorder: '#e2e8f0',
    previewText: '#0f172a',
    previewMuted: '#64748b',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    shortLabel: 'Dark',
    description: 'Balanced low-light slate palette designed for comfortable evening use.',
    metaThemeColor: '#020617',
    previewBg: '#020617',
    previewCard: '#0f172a',
    previewBorder: '#1e293b',
    previewText: '#f1f5f9',
    previewMuted: '#94a3b8',
  },
  {
    id: 'midnight',
    name: 'Midnight High Contrast',
    shortLabel: 'Midnight',
    description:
      'Pure black OLED backdrop, bright white ink, and boosted borders for maximum clarity.',
    metaThemeColor: '#000000',
    previewBg: '#000000',
    previewCard: '#090a0f',
    previewBorder: '#3f4656',
    previewText: '#ffffff',
    previewMuted: '#cbd5e1',
  },
];

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: 'teal',
    name: 'Teal',
    description: 'PocketWage signature',
    swatchHex: '#0d9488',
    lightChartHex: '#0d9488',
    darkChartHex: '#2dd4bf',
    midnightChartHex: '#5eead4',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Crisp wealth green',
    swatchHex: '#047857',
    lightChartHex: '#059669',
    darkChartHex: '#34d399',
    midnightChartHex: '#6ee7b7',
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    description: 'Classic fintech blue',
    swatchHex: '#2563eb',
    lightChartHex: '#2563eb',
    darkChartHex: '#60a5fa',
    midnightChartHex: '#93c5fd',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    description: 'Deep analytical ink',
    swatchHex: '#4f46e5',
    lightChartHex: '#4f46e5',
    darkChartHex: '#818cf8',
    midnightChartHex: '#a5b4fc',
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Modern royal plum',
    swatchHex: '#7c3aed',
    lightChartHex: '#7c3aed',
    darkChartHex: '#a78bfa',
    midnightChartHex: '#c4b5fd',
  },
  {
    id: 'amber',
    name: 'Amber Gold',
    description: 'Warm bullion gold',
    swatchHex: '#b45309',
    lightChartHex: '#d97706',
    darkChartHex: '#fbbf24',
    midnightChartHex: '#fcd34d',
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    description: 'High-clarity coral red',
    swatchHex: '#e11d48',
    lightChartHex: '#e11d48',
    darkChartHex: '#fb7185',
    midnightChartHex: '#fda4af',
  },
];

export function getAccentPreset(id: AccentColorId): AccentPreset {
  return ACCENT_PRESETS.find((a) => a.id === id) ?? ACCENT_PRESETS[0];
}

export function getThemeModePreset(id: ThemeMode): ThemeModePreset {
  return THEME_MODES.find((m) => m.id === id) ?? THEME_MODES[0];
}
