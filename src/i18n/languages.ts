export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'it'
  | 'zh'
  | 'zh-TW'
  | 'ja'
  | 'th'
  | 'vi';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  shortLabel: string;
}

export const LANGUAGE_STORAGE_KEY = 'paymint_language_v1';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    shortLabel: 'EN',
  },
  {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
    shortLabel: 'ES',
  },
  {
    code: 'fr',
    nativeName: 'Français',
    englishName: 'French',
    shortLabel: 'FR',
  },
  {
    code: 'it',
    nativeName: 'Italiano',
    englishName: 'Italian',
    shortLabel: 'IT',
  },
  {
    code: 'zh',
    nativeName: '中文 (简体)',
    englishName: 'Chinese (Simplified)',
    shortLabel: '简中',
  },
  {
    code: 'zh-TW',
    nativeName: '中文 (繁體)',
    englishName: 'Chinese (Traditional)',
    shortLabel: '繁體',
  },
  {
    code: 'ja',
    nativeName: '日本語',
    englishName: 'Japanese',
    shortLabel: '日本語',
  },
  {
    code: 'th',
    nativeName: 'ไทย',
    englishName: 'Thai',
    shortLabel: 'TH',
  },
  {
    code: 'vi',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    shortLabel: 'VI',
  },
];

export function isSupportedLanguage(value: string | null): value is LanguageCode {
  return LANGUAGE_OPTIONS.some((opt) => opt.code === value);
}

export function getLanguageOption(code: LanguageCode): LanguageOption {
  return (
    LANGUAGE_OPTIONS.find((opt) => opt.code === code) ?? LANGUAGE_OPTIONS[0]
  );
}

export function resolveInitialLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(saved)) {
      return saved;
    }
  } catch {
    // ignore storage restrictions
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    const full = navigator.language.toLowerCase();
    if (
      full.startsWith('zh-tw') ||
      full.startsWith('zh-hk') ||
      full.startsWith('zh-mo') ||
      full.includes('hant')
    ) {
      return 'zh-TW';
    }
    const base = full.split('-')[0];
    if (isSupportedLanguage(base)) {
      return base;
    }
  }

  return 'en';
}
