import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getLanguageOption,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  LanguageCode,
  LanguageOption,
  resolveInitialLanguage,
} from './languages';
import { en, TranslationDictionary, TranslationKey } from './translations/en';
import { es } from './translations/es';
import { fr } from './translations/fr';
import { it } from './translations/it';
import { ja } from './translations/ja';
import { th } from './translations/th';
import { vi } from './translations/vi';
import { zh } from './translations/zh';
import { zhTW } from './translations/zhTW';

const DICTIONARIES: Record<LanguageCode, TranslationDictionary> = {
  en,
  es,
  fr,
  it,
  zh,
  'zh-TW': zhTW,
  ja,
  th,
  vi,
};

export type TranslationVars = Record<string, string | number>;

interface I18nContextValue {
  language: LanguageCode;
  languageOption: LanguageOption;
  languages: LanguageOption[];
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, vars?: TranslationVars) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, token: string) =>
    token in vars ? String(vars[token]) : `{${token}}`
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(
    resolveInitialLanguage
  );

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // ignore storage errors
    }
  }, [language]);

  const setLanguage = useCallback((nextLang: LanguageCode) => {
    setLanguageState(nextLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslationVars): string => {
      const dict = DICTIONARIES[language] ?? en;
      const raw = dict[key] ?? en[key] ?? key;
      return interpolate(raw, vars);
    },
    [language]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      languageOption: getLanguageOption(language),
      languages: LANGUAGE_OPTIONS,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
