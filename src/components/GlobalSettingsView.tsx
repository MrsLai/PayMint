import { User } from 'firebase/auth';
import { Globe, Palette, Settings2, SlidersHorizontal } from 'lucide-react';
import { LegalDocTab } from '../data/legalContent';
import { AccentColorId, ThemeMode } from '../data/themePresets';
import { CloudSyncStatus } from '../hooks/useWageStore';
import { LanguageCode, useI18n } from '../i18n';
import { CountryCode, PaySettings } from '../types/wage';
import { PreferencesSettingsView } from './PreferencesSettingsView';
import { TaxSettingsView } from './TaxSettingsView';
import { ThemeSettingsView } from './ThemeSettingsView';

export type SettingsSubTab = 'tax' | 'theme' | 'preferences';

interface GlobalSettingsViewProps {
  activeSubTab: SettingsSubTab;
  onChangeSubTab: (tab: SettingsSubTab) => void;
  settings: PaySettings;
  hasAnyAmount: boolean;
  themeMode: ThemeMode;
  accentColor: AccentColorId;
  showWelcomeOnStartup: boolean;
  retirementSavingsRatePct: number;
  retirementIncludeEmployer: boolean;
  retirementAnnualReturnPct: number;
  retirementAnnualInflationPct: number;
  retirementYears: number;
  retirementValueMode: 'nominal' | 'real';
  onUpdateSettings: (
    updater: Partial<PaySettings> | ((prev: PaySettings) => PaySettings)
  ) => void;
  onSelectCountry: (code: CountryCode) => void;
  onSyncLatestRules: () => void;
  onChangeThemeMode: (mode: ThemeMode) => void;
  onChangeAccentColor: (accent: AccentColorId) => void;
  onResetTheme: () => void;
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

const SETTINGS_SECTIONS: Array<{
  id: SettingsSubTab;
  labelKey: 'settings.tabTax' | 'settings.tabTheme' | 'settings.tabPrefs';
  descKey:
    | 'settings.tabTaxDesc'
    | 'settings.tabThemeDesc'
    | 'settings.tabPrefsDesc';
  Icon: typeof SlidersHorizontal;
}> = [
  {
    id: 'tax',
    labelKey: 'settings.tabTax',
    descKey: 'settings.tabTaxDesc',
    Icon: SlidersHorizontal,
  },
  {
    id: 'theme',
    labelKey: 'settings.tabTheme',
    descKey: 'settings.tabThemeDesc',
    Icon: Palette,
  },
  {
    id: 'preferences',
    labelKey: 'settings.tabPrefs',
    descKey: 'settings.tabPrefsDesc',
    Icon: Settings2,
  },
];

export function GlobalSettingsView({
  activeSubTab,
  onChangeSubTab,
  settings,
  hasAnyAmount,
  themeMode,
  accentColor,
  showWelcomeOnStartup,
  retirementSavingsRatePct,
  retirementIncludeEmployer,
  retirementAnnualReturnPct,
  retirementAnnualInflationPct,
  retirementYears,
  retirementValueMode,
  onUpdateSettings,
  onSelectCountry,
  onSyncLatestRules,
  onChangeThemeMode,
  onChangeAccentColor,
  onResetTheme,
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
}: GlobalSettingsViewProps) {
  const { language, languages, setLanguage, t } = useI18n();

  const handleLanguageChange = (nextLang: LanguageCode) => {
    setLanguage(nextLang);
    const opt = languages.find((l) => l.code === nextLang);
    onAnnounce(
      t('notice.languageChanged', { name: opt?.nativeName ?? nextLang })
    );
  };

  return (
    <div className="space-y-6">
      {/* Global Settings Header + Quick Language Toggle + Sub-Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
              {t('settings.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t('settings.subtitle')}
            </p>
          </div>

          {/* Quick Language Toggle in Global Settings Header */}
          <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-3 py-2 shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] dark:shadow-none shrink-0">
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <label
              htmlFor="global-language-select"
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap"
            >
              {t('settings.languageLabel')}
            </label>
            <select
              id="global-language-select"
              value={language}
              onChange={(e) =>
                handleLanguageChange(e.target.value as LanguageCode)
              }
              className="pl-2 pr-1 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400 cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.shortLabel})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Settings sections"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(15,23,42,0.05)] dark:shadow-none"
        >
          {SETTINGS_SECTIONS.map((section) => {
            const isActive = activeSubTab === section.id;
            const Icon = section.Icon;
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChangeSubTab(section.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs sm:text-sm font-bold truncate">
                    {t(section.labelKey)}
                  </span>
                  <span
                    className={`block text-[11px] truncate ${
                      isActive
                        ? 'text-white/80'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {t(section.descKey)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Settings Panel */}
      <div role="tabpanel" aria-label={activeSubTab}>
        {activeSubTab === 'tax' && (
          <TaxSettingsView
            embedded
            settings={settings}
            onUpdateSettings={onUpdateSettings}
            onSelectCountry={onSelectCountry}
            onSyncLatestRules={onSyncLatestRules}
          />
        )}

        {activeSubTab === 'theme' && (
          <ThemeSettingsView
            embedded
            themeMode={themeMode}
            accentColor={accentColor}
            onChangeThemeMode={onChangeThemeMode}
            onChangeAccentColor={onChangeAccentColor}
            onResetTheme={onResetTheme}
          />
        )}

        {activeSubTab === 'preferences' && (
          <PreferencesSettingsView
            settings={settings}
            hasAnyAmount={hasAnyAmount}
            showWelcomeOnStartup={showWelcomeOnStartup}
            retirementSavingsRatePct={retirementSavingsRatePct}
            retirementIncludeEmployer={retirementIncludeEmployer}
            retirementAnnualReturnPct={retirementAnnualReturnPct}
            retirementAnnualInflationPct={retirementAnnualInflationPct}
            retirementYears={retirementYears}
            retirementValueMode={retirementValueMode}
            onUpdateSettings={onUpdateSettings}
            onToggleShowWelcomeOnStartup={onToggleShowWelcomeOnStartup}
            onChangeRetirementSavingsRatePct={onChangeRetirementSavingsRatePct}
            onChangeRetirementIncludeEmployer={onChangeRetirementIncludeEmployer}
            onChangeRetirementAnnualReturnPct={onChangeRetirementAnnualReturnPct}
            onChangeRetirementAnnualInflationPct={
              onChangeRetirementAnnualInflationPct
            }
            onChangeRetirementYears={onChangeRetirementYears}
            onChangeRetirementValueMode={onChangeRetirementValueMode}
            onClearAmounts={onClearAmounts}
            onOpenWelcome={onOpenWelcome}
            onStartTutorial={onStartTutorial}
            onOpenShortcuts={onOpenShortcuts}
            onOpenLegal={onOpenLegal}
            onAnnounce={onAnnounce}
            cloudSyncRequested={cloudSyncRequested}
            cloudUser={cloudUser}
            cloudSyncStatus={cloudSyncStatus}
            cloudSyncError={cloudSyncError}
            isSigningIn={isSigningIn}
            lastSyncedAt={lastSyncedAt}
            onRequestCloudSync={onRequestCloudSync}
            onSignInForCloudSync={onSignInForCloudSync}
            onSignOutCloudSync={onSignOutCloudSync}
            onSyncNow={onSyncNow}
          />
        )}
      </div>
    </div>
  );
}
