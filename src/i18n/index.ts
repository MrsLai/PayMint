export { I18nProvider, useI18n } from './I18nContext';
export type { TranslationVars } from './I18nContext';
export {
  getLanguageOption,
  isSupportedLanguage,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  resolveInitialLanguage,
} from './languages';
export type { LanguageCode, LanguageOption } from './languages';
export type { TranslationDictionary, TranslationKey } from './translations/en';
