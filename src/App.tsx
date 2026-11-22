import { useCallback, useEffect, useRef, useState } from 'react';
import { CalculatorView } from './components/CalculatorView';
import {
  GlobalSettingsView,
  SettingsSubTab,
} from './components/GlobalSettingsView';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { LegalModal } from './components/LegalModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PayriseCompareView } from './components/PayriseCompareView';
import { QuickTutorialOverlay } from './components/QuickTutorialOverlay';
import { RetirementProjectionsSection } from './components/RetirementProjectionsSection';
import { ShareModal } from './components/ShareModal';
import { SupportModal } from './components/SupportModal';
import { ActiveTab, TopBar } from './components/TopBar';
import { WelcomeModal } from './components/WelcomeModal';
import { LegalDocTab } from './data/legalContent';
import {
  ACCENT_PRESETS,
  AccentColorId,
  getAccentPreset,
  getThemeModePreset,
  THEME_MODES,
  ThemeMode,
} from './data/themePresets';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useWageStore } from './hooks/useWageStore';
import { useI18n } from './i18n';

const WELCOME_SEEN_KEY = 'paymint_welcome_seen_v1';
const THEME_MODE_KEY = 'paymint_theme_mode_v1';
const ACCENT_COLOR_KEY = 'paymint_accent_color_v1';

function resolveInitialThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_MODE_KEY);
    if (saved && THEME_MODES.some((m) => m.id === saved)) {
      return saved as ThemeMode;
    }
  } catch {
    // ignore storage errors
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

function resolveInitialAccent(): AccentColorId {
  try {
    const saved = localStorage.getItem(ACCENT_COLOR_KEY);
    if (saved && ACCENT_PRESETS.some((a) => a.id === saved)) {
      return saved as AccentColorId;
    }
  } catch {
    // ignore storage errors
  }
  return 'teal';
}

export default function App() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('tax');
  const [themeMode, setThemeMode] = useState<ThemeMode>(resolveInitialThemeMode);
  const [accentColor, setAccentColor] =
    useState<AccentColorId>(resolveInitialAccent);
  const [showWelcomeOnStartup, setShowWelcomeOnStartup] = useState<boolean>(
    () => {
      try {
        return localStorage.getItem(WELCOME_SEEN_KEY) !== '1';
      } catch {
        return true;
      }
    }
  );
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(
    () => showWelcomeOnStartup
  );
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalDocTab | null>(null);
  const [shortcutNotice, setShortcutNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  const isDark = themeMode === 'dark' || themeMode === 'midnight';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.setAttribute('data-theme', themeMode);
    root.setAttribute('data-accent', accentColor);

    try {
      localStorage.setItem(THEME_MODE_KEY, themeMode);
      localStorage.setItem(ACCENT_COLOR_KEY, accentColor);
    } catch {
      // ignore storage errors
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const content =
        themeMode === 'light'
          ? getAccentPreset(accentColor).swatchHex
          : getThemeModePreset(themeMode).metaThemeColor;
      metaTheme.setAttribute('content', content);
    }
  }, [themeMode, accentColor, isDark]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const announceAction = useCallback((message: string) => {
    setShortcutNotice(message);
    if (noticeTimerRef.current !== null) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setShortcutNotice(null);
      noticeTimerRef.current = null;
    }, 2200);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const donation = params.get('donation');
    if (donation === 'success') {
      announceAction(t('support.thankYouNotice'));
    } else if (donation === 'cancelled') {
      announceAction(t('support.cancelledNotice'));
    }
    if (donation !== null) {
      params.delete('donation');
      const remaining = params.toString();
      const nextUrl =
        window.location.pathname +
        (remaining ? `?${remaining}` : '') +
        window.location.hash;
      window.history.replaceState({}, '', nextUrl);
    }
  }, [announceAction, t]);

  const handleToggleShowWelcomeOnStartup = useCallback(
    (show: boolean) => {
      setShowWelcomeOnStartup(show);
      try {
        if (show) {
          localStorage.removeItem(WELCOME_SEEN_KEY);
        } else {
          localStorage.setItem(WELCOME_SEEN_KEY, '1');
        }
      } catch {
        // ignore storage errors
      }
      announceAction(
        show
          ? 'Welcome guide enabled on startup'
          : 'Welcome guide hidden on startup'
      );
    },
    [announceAction]
  );

  const handleCloseWelcome = () => {
    setIsWelcomeOpen(false);
    setShowWelcomeOnStartup(false);
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, '1');
    } catch {
      // ignore storage errors
    }
  };

  const {
    settings,
    breakdown,
    updateSettings,
    selectCountry,
    syncLatestRules,
    clearAllAmounts,
    compareCurrentMode,
    setCompareCurrentMode,
    compareCurrentAmount,
    setCompareCurrentAmount,
    compareTargetMode,
    setCompareTargetMode,
    compareTargetAmount,
    setCompareTargetAmount,
    compareTargetDriver,
    setCompareTargetDriver,
    compareTargetRaisePct,
    setCompareTargetRaisePct,
    savedComparisons,
    saveComparison,
    loadSavedComparison,
    deleteSavedComparison,
    clearSavedComparisons,
    retirementStartingSavings,
    setRetirementStartingSavings,
    retirementSavingsRatePct,
    setRetirementSavingsRatePct,
    retirementIncludeEmployer,
    setRetirementIncludeEmployer,
    retirementAnnualReturnPct,
    setRetirementAnnualReturnPct,
    retirementAnnualInflationPct,
    setRetirementAnnualInflationPct,
    retirementYears,
    setRetirementYears,
    retirementValueMode,
    setRetirementValueMode,
    cloudSyncRequested,
    cloudUser,
    cloudSyncStatus,
    cloudSyncError,
    isSigningIn,
    lastSyncedAt,
    requestCloudSync,
    signInForCloudSync,
    signOutCloudSync,
    syncNow,
  } = useWageStore();

  const hasAnyAmount =
    settings.inputAmount > 0 ||
    settings.otherMonthlyDeduction > 0 ||
    compareCurrentAmount > 0 ||
    compareTargetAmount > 0 ||
    compareTargetRaisePct !== 0 ||
    retirementStartingSavings > 0;

  const handleOpenCompare = () => {
    if (settings.inputAmount > 0 && compareCurrentAmount === 0) {
      setCompareCurrentMode(settings.inputMode);
      setCompareCurrentAmount(settings.inputAmount);
    }
    setActiveTab('compare');
  };

  const handleCycleTheme = useCallback(() => {
    setThemeMode((prev) => {
      const next: ThemeMode =
        prev === 'light' ? 'dark' : prev === 'dark' ? 'midnight' : 'light';
      const label = getThemeModePreset(next).name;
      announceAction(`Switched to ${label}`);
      return next;
    });
  }, [announceAction]);

  const handleSelectThemeMode = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
      announceAction(`Switched to ${getThemeModePreset(mode).name}`);
    },
    [announceAction]
  );

  const handleSelectAccentColor = useCallback(
    (accent: AccentColorId) => {
      setAccentColor(accent);
      announceAction(`Accent color set to ${getAccentPreset(accent).name}`);
    },
    [announceAction]
  );

  const handleResetTheme = useCallback(() => {
    const systemDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const defaultMode: ThemeMode = systemDark ? 'dark' : 'light';
    setThemeMode(defaultMode);
    setAccentColor('teal');
    announceAction('Theme reset to default');
  }, [announceAction]);

  const handleFocusPrimaryInput = useCallback(() => {
    const targetId =
      activeTab === 'calculator'
        ? `rate-input-${settings.inputMode}`
        : activeTab === 'compare'
          ? 'compare-current-amount'
          : activeTab === 'retirement'
            ? 'ret-starting-savings'
            : settingsSubTab === 'tax'
              ? 'tax-settings-primary-control'
              : settingsSubTab === 'theme'
                ? 'theme-settings-primary-control'
                : 'pref-hours-day';

    const el = document.getElementById(targetId);
    if (el instanceof HTMLElement) {
      el.focus({ preventScroll: false });
      if (el instanceof HTMLInputElement) {
        el.select();
      }
    }
  }, [activeTab, settings.inputMode, settingsSubTab]);

  const handleOpenThemeSettings = useCallback(() => {
    setActiveTab('settings');
    setSettingsSubTab('theme');
    announceAction('Switched to Settings → Theme & Appearance');
  }, [announceAction]);

  const handleStartTutorial = useCallback(() => {
    setIsWelcomeOpen(false);
    setActiveTab('calculator');
    setIsTutorialOpen(true);
  }, []);

  useKeyboardShortcuts({
    activeTab,
    isModalOpen:
      isWelcomeOpen ||
      isShareOpen ||
      isSupportOpen ||
      isTutorialOpen ||
      legalModalTab !== null,
    isShortcutsOpen,
    hasAnyAmount,
    onSelectTab: setActiveTab,
    onOpenThemeSettings: handleOpenThemeSettings,
    onClearAmounts: clearAllAmounts,
    onToggleTheme: handleCycleTheme,
    onOpenShare: () => setIsShareOpen(true),
    onToggleShortcutsHelp: () => setIsShortcutsOpen((prev) => !prev),
    onFocusPrimaryInput: handleFocusPrimaryInput,
    onAnnounce: announceAction,
  });

  const activeAccentHex = getAccentPreset(accentColor).swatchHex;

  return (
    <div
      style={
        themeMode === 'midnight'
          ? undefined
          : {
              backgroundImage: `radial-gradient(ellipse at top, ${activeAccentHex}${isDark ? '22' : '14'}, transparent 55%)`,
            }
      }
      className="min-h-screen bg-[#f2f6fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 print:bg-white print:text-slate-900 print:min-h-0 print:bg-none"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-teal-600 focus:text-white focus:text-xs focus:font-semibold focus:shadow-lg focus:outline-none no-print"
      >
        {t('nav.skipToMain')}
      </a>

      <TopBar
        activeTab={activeTab}
        hasAnyAmount={hasAnyAmount}
        themeMode={themeMode}
        onToggleTheme={handleCycleTheme}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onSelectTab={setActiveTab}
        onClearAmounts={() => {
          clearAllAmounts();
          announceAction(t('notice.amountsCleared'));
        }}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 pt-6 pb-8 md:py-9 focus:outline-none print:p-0 print:max-w-none"
      >
        {activeTab === 'calculator' && (
          <CalculatorView
            settings={settings}
            breakdown={breakdown}
            isDark={isDark}
            themeMode={themeMode}
            onUpdateSettings={updateSettings}
            onSelectCountry={selectCountry}
            onSyncLatestRules={syncLatestRules}
            onOpenCompare={handleOpenCompare}
            onOpenRetirement={() => setActiveTab('retirement')}
            onStartTutorial={handleStartTutorial}
            onAnnounce={announceAction}
          />
        )}

        {activeTab === 'compare' && (
          <PayriseCompareView
            settings={settings}
            currentMode={compareCurrentMode}
            currentAmount={compareCurrentAmount}
            targetMode={compareTargetMode}
            targetAmount={compareTargetAmount}
            targetDriver={compareTargetDriver}
            targetRaisePct={compareTargetRaisePct}
            savedComparisons={savedComparisons}
            onChangeCurrentMode={setCompareCurrentMode}
            onChangeCurrentAmount={setCompareCurrentAmount}
            onChangeTargetMode={setCompareTargetMode}
            onChangeTargetAmount={setCompareTargetAmount}
            onChangeTargetDriver={setCompareTargetDriver}
            onChangeTargetRaisePct={setCompareTargetRaisePct}
            onSaveComparison={saveComparison}
            onLoadComparison={loadSavedComparison}
            onDeleteComparison={deleteSavedComparison}
            onClearSavedComparisons={clearSavedComparisons}
            onUpdateSettings={updateSettings}
            onAnnounce={announceAction}
            cloudSyncRequested={cloudSyncRequested}
            cloudUser={cloudUser}
            cloudSyncStatus={cloudSyncStatus}
            cloudSyncError={cloudSyncError}
            isSigningIn={isSigningIn}
            onRequestCloudSync={requestCloudSync}
            onSignInForCloudSync={signInForCloudSync}
            onSignOutCloudSync={signOutCloudSync}
            onSyncNow={syncNow}
          />
        )}

        {activeTab === 'retirement' && (
          <RetirementProjectionsSection
            settings={settings}
            breakdown={breakdown}
            isDark={isDark}
            themeMode={themeMode}
            accentColor={accentColor}
            startingSavings={retirementStartingSavings}
            onChangeStartingSavings={setRetirementStartingSavings}
            savingsRatePct={retirementSavingsRatePct}
            onChangeSavingsRatePct={setRetirementSavingsRatePct}
            includeEmployerRetirement={retirementIncludeEmployer}
            onChangeIncludeEmployerRetirement={setRetirementIncludeEmployer}
            annualReturnPct={retirementAnnualReturnPct}
            onChangeAnnualReturnPct={setRetirementAnnualReturnPct}
            annualInflationPct={retirementAnnualInflationPct}
            onChangeAnnualInflationPct={setRetirementAnnualInflationPct}
            years={retirementYears}
            onChangeYears={setRetirementYears}
            valueMode={retirementValueMode}
            onChangeValueMode={setRetirementValueMode}
            onUpdateSettings={updateSettings}
            onOpenCalculator={() => setActiveTab('calculator')}
          />
        )}

        {activeTab === 'settings' && (
          <GlobalSettingsView
            activeSubTab={settingsSubTab}
            onChangeSubTab={setSettingsSubTab}
            settings={settings}
            hasAnyAmount={hasAnyAmount}
            themeMode={themeMode}
            accentColor={accentColor}
            showWelcomeOnStartup={showWelcomeOnStartup}
            retirementSavingsRatePct={retirementSavingsRatePct}
            retirementIncludeEmployer={retirementIncludeEmployer}
            retirementAnnualReturnPct={retirementAnnualReturnPct}
            retirementAnnualInflationPct={retirementAnnualInflationPct}
            retirementYears={retirementYears}
            retirementValueMode={retirementValueMode}
            onUpdateSettings={updateSettings}
            onSelectCountry={selectCountry}
            onSyncLatestRules={syncLatestRules}
            onChangeThemeMode={handleSelectThemeMode}
            onChangeAccentColor={handleSelectAccentColor}
            onResetTheme={handleResetTheme}
            onToggleShowWelcomeOnStartup={handleToggleShowWelcomeOnStartup}
            onChangeRetirementSavingsRatePct={setRetirementSavingsRatePct}
            onChangeRetirementIncludeEmployer={setRetirementIncludeEmployer}
            onChangeRetirementAnnualReturnPct={setRetirementAnnualReturnPct}
            onChangeRetirementAnnualInflationPct={
              setRetirementAnnualInflationPct
            }
            onChangeRetirementYears={setRetirementYears}
            onChangeRetirementValueMode={setRetirementValueMode}
            onClearAmounts={() => {
              clearAllAmounts();
              announceAction(t('notice.amountsCleared'));
            }}
            onOpenWelcome={() => setIsWelcomeOpen(true)}
            onStartTutorial={handleStartTutorial}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenLegal={setLegalModalTab}
            onAnnounce={announceAction}
            cloudSyncRequested={cloudSyncRequested}
            cloudUser={cloudUser}
            cloudSyncStatus={cloudSyncStatus}
            cloudSyncError={cloudSyncError}
            isSigningIn={isSigningIn}
            lastSyncedAt={lastSyncedAt}
            onRequestCloudSync={requestCloudSync}
            onSignInForCloudSync={signInForCloudSync}
            onSignOutCloudSync={signOutCloudSync}
            onSyncNow={syncNow}
          />
        )}
      </main>

      <footer className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 pt-4 pb-20 md:pb-8 border-t border-slate-200/70 dark:border-slate-800/80 space-y-2 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{t('legal.footerNotice')}</span>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="hover:text-teal-700 dark:hover:text-teal-300 underline-offset-2 hover:underline transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
            >
              {t('support.button')}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-teal-700 dark:hover:text-teal-300 underline-offset-2 hover:underline transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
            >
              {t('legal.privacyPolicy')}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-teal-700 dark:hover:text-teal-300 underline-offset-2 hover:underline transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
            >
              {t('legal.termsConditions')}
            </button>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500/90 dark:text-slate-400/90">
          {t('legal.disclaimer')}
        </p>
      </footer>

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={handleCloseWelcome}
        onNavigateTab={setActiveTab}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onStartTutorial={handleStartTutorial}
        onOpenLegal={setLegalModalTab}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      <QuickTutorialOverlay
        isOpen={isTutorialOpen}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onClose={() => setIsTutorialOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <SupportModal
        isOpen={isSupportOpen}
        currencyCode={settings.currencyCode}
        onClose={() => setIsSupportOpen(false)}
      />

      <LegalModal
        isOpen={legalModalTab !== null}
        activeTab={legalModalTab ?? 'privacy'}
        onChangeTab={setLegalModalTab}
        onClose={() => setLegalModalTab(null)}
      />

      {shortcutNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-5 right-4 z-40 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold shadow-lg pointer-events-none no-print"
        >
          {shortcutNotice}
        </div>
      )}

      <OfflineIndicator />
    </div>
  );
}
