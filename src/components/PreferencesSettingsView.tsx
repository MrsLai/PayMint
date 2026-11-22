import { User } from 'firebase/auth';
import {
  ArrowLeftRight,
  Check,
  Clock,
  Cloud,
  CloudOff,
  Compass,
  Eraser,
  FileText,
  Globe,
  Keyboard,
  LogOut,
  PiggyBank,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { getCountryPreset } from '../data/countryPresets';
import { CURRENCY_OPTIONS, getCurrencyOption } from '../data/currencies';
import { LegalDocTab } from '../data/legalContent';
import { CloudSyncStatus } from '../hooks/useWageStore';
import { LanguageCode, useI18n } from '../i18n';
import { InputFrequency, PaySettings } from '../types/wage';

const MAX_FAVORITE_CURRENCIES = 5;

const FREQ_OPTIONS: Array<{
  id: InputFrequency;
  labelKey:
    | 'period.Hourly'
    | 'period.Daily'
    | 'period.Weekly'
    | 'period.Fortnightly'
    | 'period.Monthly'
    | 'period.Annual';
}> = [
  { id: 'hourly', labelKey: 'period.Hourly' },
  { id: 'daily', labelKey: 'period.Daily' },
  { id: 'weekly', labelKey: 'period.Weekly' },
  { id: 'fortnightly', labelKey: 'period.Fortnightly' },
  { id: 'monthly', labelKey: 'period.Monthly' },
  { id: 'annual', labelKey: 'period.Annual' },
];

interface PreferencesSettingsViewProps {
  settings: PaySettings;
  hasAnyAmount: boolean;
  showWelcomeOnStartup: boolean;
  retirementSavingsRatePct: number;
  retirementIncludeEmployer: boolean;
  retirementAnnualReturnPct: number;
  retirementAnnualInflationPct: number;
  retirementYears: number;
  retirementValueMode: 'nominal' | 'real';
  onUpdateSettings: (patch: Partial<PaySettings>) => void;
  onToggleShowWelcomeOnStartup: (show: boolean) => void;
  onChangeRetirementSavingsRatePct: (pct: number) => void;
  onChangeRetirementIncludeEmployer: (val: boolean) => void;
  onChangeRetirementAnnualReturnPct: (pct: number) => void;
  onChangeRetirementAnnualInflationPct: (pct: number) => void;
  onChangeRetirementYears: (yrs: number) => void;
  onChangeRetirementValueMode: (mode: 'nominal' | 'real') => void;
  onClearAmounts: () => void;
  onOpenWelcome: () => void;
  onStartTutorial?: () => void;
  onOpenShortcuts: () => void;
  onOpenLegal?: (tab: LegalDocTab) => void;
  onAnnounce: (msg: string) => void;
  cloudSyncRequested: boolean;
  cloudUser: User | null;
  cloudSyncStatus: CloudSyncStatus;
  cloudSyncError: string | null;
  isSigningIn: boolean;
  lastSyncedAt: string | null;
  onRequestCloudSync: (requested: boolean) => void;
  onSignInForCloudSync: () => Promise<User | null>;
  onSignOutCloudSync: () => Promise<void>;
  onSyncNow: () => Promise<boolean>;
}

export function PreferencesSettingsView({
  settings,
  hasAnyAmount,
  showWelcomeOnStartup,
  retirementSavingsRatePct,
  retirementIncludeEmployer,
  retirementAnnualReturnPct,
  retirementAnnualInflationPct,
  retirementYears,
  retirementValueMode,
  onUpdateSettings,
  onToggleShowWelcomeOnStartup,
  onChangeRetirementSavingsRatePct,
  onChangeRetirementIncludeEmployer,
  onChangeRetirementAnnualReturnPct,
  onChangeRetirementAnnualInflationPct,
  onChangeRetirementYears,
  onChangeRetirementValueMode,
  onClearAmounts,
  onOpenWelcome,
  onStartTutorial,
  onOpenShortcuts,
  onOpenLegal,
  onAnnounce,
  cloudSyncRequested,
  cloudUser,
  cloudSyncStatus,
  cloudSyncError,
  isSigningIn,
  lastSyncedAt,
  onRequestCloudSync,
  onSignInForCloudSync,
  onSignOutCloudSync,
  onSyncNow,
}: PreferencesSettingsViewProps) {
  const { language, languages, setLanguage, t } = useI18n();
  const countryPreset = getCountryPreset(settings.countryCode);
  const favorites = settings.favoriteCurrencies ?? [];
  const availableCurrencies = CURRENCY_OPTIONS.filter(
    (c) => c.code !== settings.currencyCode
  );
  const isAtFavoriteCap = favorites.length >= MAX_FAVORITE_CURRENCIES;

  const handleSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    const opt = languages.find((l) => l.code === code);
    onAnnounce(
      t('notice.languageChanged', { name: opt?.nativeName ?? code })
    );
  };

  const handleToggleFavorite = (code: string) => {
    if (favorites.includes(code)) {
      onUpdateSettings({
        favoriteCurrencies: favorites.filter((c) => c !== code),
      });
      return;
    }
    if (isAtFavoriteCap) return;
    onUpdateSettings({
      favoriteCurrencies: [...favorites, code],
    });
  };

  const handleResetScheduleToCountry = () => {
    onUpdateSettings({
      standardHoursPerDay: countryPreset.standardHoursPerDay,
      standardDaysPerWeek: countryPreset.standardDaysPerWeek,
      weeksPerYear: countryPreset.weeksPerYear,
      superMode: countryPreset.superMode,
    });
    onAnnounce(`Work schedule reset to ${countryPreset.name} defaults`);
  };

  const handleResetRetirementDefaults = () => {
    onChangeRetirementSavingsRatePct(20);
    onChangeRetirementIncludeEmployer(true);
    onChangeRetirementAnnualReturnPct(7.0);
    onChangeRetirementAnnualInflationPct(2.5);
    onChangeRetirementYears(25);
    onChangeRetirementValueMode('nominal');
    onAnnounce('Retirement projection defaults restored');
  };

  return (
    <div className="space-y-6">
      {/* Sub-header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t('prefs.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('prefs.subtitle')}
          </p>
        </div>
      </div>

      {/* 0. Language & Interface Locale */}
      <section
        aria-labelledby="pref-language-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3
              id="pref-language-heading"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {t('prefs.languageTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('prefs.languageDesc')}
            </p>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="pref-language-heading"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
        >
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-400 ring-2 ring-teal-500/20 dark:ring-teal-400/25 bg-teal-50/50 dark:bg-teal-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {lang.nativeName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {lang.englishName}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 1. Work Schedule & Calculator Defaults */}
      <section
        aria-labelledby="pref-schedule-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="pref-schedule-heading"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {t('prefs.scheduleTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('prefs.scheduleDesc')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetScheduleToCountry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('prefs.resetSchedule', { code: countryPreset.code })}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="pref-hours-day"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Hours per Workday
            </label>
            <div className="relative">
              <input
                id="pref-hours-day"
                type="number"
                min={1}
                max={16}
                step={0.1}
                value={settings.standardHoursPerDay}
                onChange={(e) =>
                  onUpdateSettings({
                    standardHoursPerDay: Math.max(
                      1,
                      Math.min(16, parseFloat(e.target.value) || 7.6)
                    ),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                h/day
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="pref-days-week"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Workdays per Week
            </label>
            <div className="relative">
              <input
                id="pref-days-week"
                type="number"
                min={1}
                max={7}
                step={0.5}
                value={settings.standardDaysPerWeek}
                onChange={(e) =>
                  onUpdateSettings({
                    standardDaysPerWeek: Math.max(
                      1,
                      Math.min(7, parseFloat(e.target.value) || 5)
                    ),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                days/wk
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="pref-weeks-year"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Paid Weeks per Year
            </label>
            <div className="relative">
              <input
                id="pref-weeks-year"
                type="number"
                min={1}
                max={53}
                step={0.1}
                value={settings.weeksPerYear}
                onChange={(e) =>
                  onUpdateSettings({
                    weeksPerYear: Math.max(
                      1,
                      Math.min(53, parseFloat(e.target.value) || 52)
                    ),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                wks/yr
              </span>
            </div>
          </div>

          <div className="md:col-span-3">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              {t('prefs.activeInputPeriod')}
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {FREQ_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ inputMode: opt.id })}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    settings.inputMode === opt.id
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Currency Converter & Favorite Currencies */}
      <section
        aria-labelledby="pref-currency-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="pref-currency-heading"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {t('prefs.currencyTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('prefs.currencyDesc', {
                  count: favorites.length,
                  max: MAX_FAVORITE_CURRENCIES,
                })}
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ favoriteCurrencies: [] });
                onAnnounce('Favorite currencies cleared');
              }}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {t('prefs.clearPinned')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label
              htmlFor="pref-target-currency"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Active Conversion Currency
            </label>
            <select
              id="pref-target-currency"
              value={settings.targetCurrency}
              onChange={(e) => {
                const code = e.target.value;
                if (!code) {
                  onUpdateSettings({ targetCurrency: '' });
                  return;
                }
                const baseOpt = getCurrencyOption(settings.currencyCode);
                const targetOpt = getCurrencyOption(code);
                const raw =
                  (targetOpt?.fallbackRateFromAud ?? 1) /
                  Math.max(0.0001, baseOpt?.fallbackRateFromAud ?? 1);
                const nextRate =
                  raw >= 100
                    ? Math.round(raw * 100) / 100
                    : Math.round(raw * 10000) / 10000;
                onUpdateSettings({
                  targetCurrency: code,
                  exchangeRate: nextRate,
                });
              }}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400 cursor-pointer"
            >
              <option value="">Off ({settings.currencyCode} only)</option>
              {availableCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {favorites.includes(c.code) ? '★ ' : ''}
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Pin Favorite Currencies ({favorites.length}/{MAX_FAVORITE_CURRENCIES})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {availableCurrencies.map((c) => {
              const isPinned = favorites.includes(c.code);
              const disabled = !isPinned && isAtFavoriteCap;
              return (
                <button
                  key={c.code}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleToggleFavorite(c.code)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isPinned
                      ? 'border-amber-300/90 dark:border-amber-700/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 cursor-pointer'
                      : disabled
                        ? 'border-slate-200/70 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer'
                  }`}
                >
                  <span className="font-mono">{c.code}</span>
                  <Star
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isPinned
                        ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Retirement Projection Defaults */}
      <section
        aria-labelledby="pref-retirement-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="pref-retirement-heading"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {t('prefs.retirementTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('prefs.retirementDesc')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetRetirementDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('prefs.resetAssumptions')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label
              htmlFor="pref-ret-savings-rate"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Savings Rate (% of Net)
            </label>
            <div className="relative">
              <input
                id="pref-ret-savings-rate"
                type="number"
                min={0}
                max={100}
                step={1}
                value={retirementSavingsRatePct}
                onChange={(e) =>
                  onChangeRetirementSavingsRatePct(
                    Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                %
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="pref-ret-return"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Annual Return
            </label>
            <div className="relative">
              <input
                id="pref-ret-return"
                type="number"
                min={0}
                max={25}
                step={0.5}
                value={retirementAnnualReturnPct}
                onChange={(e) =>
                  onChangeRetirementAnnualReturnPct(
                    Math.max(0, Math.min(25, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                % p.a.
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="pref-ret-inflation"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Annual Inflation
            </label>
            <div className="relative">
              <input
                id="pref-ret-inflation"
                type="number"
                min={0}
                max={15}
                step={0.1}
                value={retirementAnnualInflationPct}
                onChange={(e) =>
                  onChangeRetirementAnnualInflationPct(
                    Math.max(0, Math.min(15, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                % p.a.
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="pref-ret-years"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Horizon (Years)
            </label>
            <div className="relative">
              <input
                id="pref-ret-years"
                type="number"
                min={1}
                max={50}
                step={1}
                value={retirementYears}
                onChange={(e) =>
                  onChangeRetirementYears(
                    Math.max(1, Math.min(50, Math.round(Number(e.target.value) || 1)))
                  )
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                yrs
              </span>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Projection Value Mode
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => onChangeRetirementValueMode('nominal')}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                  retirementValueMode === 'nominal'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Future
              </button>
              <button
                type="button"
                onClick={() => onChangeRetirementValueMode('real')}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                  retirementValueMode === 'real'
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                Today&apos;s $
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={retirementIncludeEmployer}
              onChange={(e) =>
                onChangeRetirementIncludeEmployer(e.target.checked)
              }
              className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
            />
            <span>
              Include employer {settings.retirementLabel} ({settings.superRate}%) in projected retirement growth
            </span>
          </label>
        </div>
      </section>

      {/* 4. Startup Guide, Shortcuts & Privacy */}
      <section
        aria-labelledby="pref-privacy-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3
              id="pref-privacy-heading"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {t('prefs.privacyTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('prefs.privacyDesc')}
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('prefs.showWelcomeTitle')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('prefs.showWelcomeDesc')}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {onStartTutorial && (
                <button
                  type="button"
                  onClick={onStartTutorial}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-lg transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t('calc.quickTour')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenWelcome}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{t('prefs.previewGuide')}</span>
              </button>
              <button
                type="button"
                role="switch"
                aria-checked={showWelcomeOnStartup}
                onClick={() => onToggleShowWelcomeOnStartup(!showWelcomeOnStartup)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  showWelcomeOnStartup
                    ? 'bg-teal-600'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className="sr-only">{t('prefs.showWelcomeTitle')}</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showWelcomeOnStartup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('prefs.shortcutsTitle')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('prefs.shortcutsDesc')}
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{t('prefs.viewShortcuts')}</span>
            </button>
          </div>

          <div className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {t('prefs.clearAmountsTitle')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('prefs.clearAmountsDesc')}
              </div>
            </div>
            <button
              type="button"
              disabled={!hasAnyAmount}
              onClick={onClearAmounts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200/80 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 rounded-xl transition-colors cursor-pointer disabled:cursor-default whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{t('prefs.clearAllAmounts')}</span>
            </button>
          </div>

          {onOpenLegal && (
            <div className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {t('legal.summaryTitle')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('legal.summaryDesc')}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{t('legal.privacyPolicy')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{t('legal.termsConditions')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Cross-Device Sync (Optional — Opt-in Only) */}
      <section
        aria-labelledby="pref-sync-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              {cloudUser && cloudSyncRequested ? (
                <Cloud className="w-4 h-4" />
              ) : (
                <CloudOff className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id="pref-sync-heading"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  {t('sync.title')}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                    cloudUser && cloudSyncRequested
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/70'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  {cloudUser && cloudSyncRequested
                    ? cloudSyncStatus === 'syncing'
                      ? t('sync.syncing')
                      : t('sync.synced')
                    : t('sync.localOnly')}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('sync.desc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {t('sync.toggleLabel')}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={cloudSyncRequested}
              aria-label={t('sync.toggleLabel')}
              onClick={async () => {
                if (cloudSyncRequested) {
                  if (cloudUser) {
                    await onSignOutCloudSync();
                    onAnnounce(t('notice.syncDisabled'));
                  } else {
                    onRequestCloudSync(false);
                  }
                } else {
                  onRequestCloudSync(true);
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                cloudSyncRequested
                  ? 'bg-teal-600'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span className="sr-only">{t('sync.toggleLabel')}</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  cloudSyncRequested ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Google Sign-In / Account Bar — ONLY shown when user explicitly enables cross-device sync */}
        {(cloudSyncRequested || cloudUser) && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {!cloudUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/80 p-3.5">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {t('sync.freeNote')}
                </div>
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={async () => {
                    const user = await onSignInForCloudSync();
                    if (user) {
                      onAnnounce(
                        t('notice.syncEnabled', {
                          name:
                            user.email || user.displayName || 'Google account',
                        })
                      );
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait whitespace-nowrap shrink-0"
                >
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>
                    {isSigningIn ? t('sync.signingIn') : t('sync.signInGoogle')}
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/35 border border-teal-200/70 dark:border-teal-800/70 p-3.5">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {t('sync.signedInAs', {
                      email:
                        cloudUser.email ||
                        cloudUser.displayName ||
                        'Google account',
                    })}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('sync.freeNote')}
                    {lastSyncedAt && (
                      <span>
                        {' '}
                        ·{' '}
                        {new Date(lastSyncedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={cloudSyncStatus === 'syncing'}
                    onClick={async () => {
                      const ok = await onSyncNow();
                      if (ok) {
                        onAnnounce(t('notice.syncedNow'));
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${
                        cloudSyncStatus === 'syncing' ? 'animate-spin' : ''
                      }`}
                    />
                    <span>
                      {cloudSyncStatus === 'syncing'
                        ? t('sync.syncing')
                        : t('sync.syncNow')}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await onSignOutCloudSync();
                      onAnnounce(t('notice.syncDisabled'));
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('sync.signOut')}</span>
                  </button>
                </div>
              </div>
            )}

            {cloudSyncError && (
              <div
                role="alert"
                className="rounded-xl border border-amber-300/80 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/40 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200"
              >
                {cloudSyncError}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
