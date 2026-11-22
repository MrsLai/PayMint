import {
  Calculator,
  Contrast,
  Eraser,
  Heart,
  HelpCircle,
  Keyboard,
  Moon,
  PiggyBank,
  Settings,
  Share2,
  Sun,
  TrendingUp,
} from 'lucide-react';
import { ThemeMode } from '../data/themePresets';
import { TranslationKey, useI18n } from '../i18n';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'calculator' | 'compare' | 'retirement' | 'settings';

interface TopBarProps {
  activeTab: ActiveTab;
  hasAnyAmount: boolean;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  onOpenWelcome: () => void;
  onOpenShortcuts: () => void;
  onOpenShare: () => void;
  onOpenSupport?: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onClearAmounts: () => void;
}

const NAV_ITEMS: Array<{
  id: ActiveTab;
  labelKey: TranslationKey;
  compactKey: TranslationKey;
  mobileKey: TranslationKey;
  shortcutNum: string;
  Icon: typeof Calculator;
}> = [
  {
    id: 'calculator',
    labelKey: 'nav.calculator',
    compactKey: 'nav.calculator',
    mobileKey: 'nav.calculateMobile',
    shortcutNum: '1',
    Icon: Calculator,
  },
  {
    id: 'compare',
    labelKey: 'nav.compare',
    compactKey: 'nav.compareCompact',
    mobileKey: 'nav.compareCompact',
    shortcutNum: '2',
    Icon: TrendingUp,
  },
  {
    id: 'retirement',
    labelKey: 'nav.retirement',
    compactKey: 'nav.retirement',
    mobileKey: 'nav.retirementMobile',
    shortcutNum: '3',
    Icon: PiggyBank,
  },
  {
    id: 'settings',
    labelKey: 'nav.settings',
    compactKey: 'nav.settings',
    mobileKey: 'nav.settings',
    shortcutNum: '4',
    Icon: Settings,
  },
];

export function TopBar({
  activeTab,
  hasAnyAmount,
  themeMode,
  onToggleTheme,
  onOpenWelcome,
  onOpenShortcuts,
  onOpenShare,
  onOpenSupport,
  onSelectTab,
  onClearAmounts,
}: TopBarProps) {
  const { t } = useI18n();
  const nextThemeLabel =
    themeMode === 'light'
      ? 'Switch to dark mode (T or Alt+T)'
      : themeMode === 'dark'
        ? 'Switch to Midnight high-contrast mode (T or Alt+T)'
        : 'Switch to light mode (T or Alt+T)';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors no-print">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 lg:gap-6">
          {/* Zone 1: Wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('calculator')}
            title="PocketWage Calculator (Ctrl+1)"
            className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg"
          >
            Pocket<span className="text-teal-600 dark:text-teal-400">Wage</span>
          </button>

          {/* Zone 2: Clean Desktop Nav Links */}
          <nav
            aria-label="Primary Navigation"
            data-tour="primary-nav"
            className="hidden md:flex items-center gap-4 lg:gap-6"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const label = t(item.labelKey);
              const compactLabel = t(item.compactKey);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-keyshortcuts={`Control+${item.shortcutNum} Alt+${item.shortcutNum}`}
                  title={`${label} (Ctrl+${item.shortcutNum} or Alt+${item.shortcutNum})`}
                  className={`relative py-5 text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded ${
                    isActive
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="lg:hidden">{compactLabel}</span>
                  <span className="hidden lg:inline">{label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-teal-600 dark:bg-teal-400"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Install, Share, Shortcuts, Guide, Theme Cycle + Primary Action */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
            <PWAInstallButton />

            <button
              type="button"
              onClick={onOpenShare}
              aria-label={t('nav.share')}
              aria-keyshortcuts="Alt+S s"
              title={`${t('nav.share')} (S or Alt+S)`}
              className="inline-flex items-center justify-center gap-1.5 w-8 h-8 sm:w-9 sm:h-9 xl:w-auto xl:px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-semibold whitespace-nowrap">
                {t('nav.share')}
              </span>
            </button>

            {onOpenSupport && (
              <button
                type="button"
                onClick={onOpenSupport}
                aria-label={t('support.button')}
                title={t('support.button')}
                className="inline-flex items-center justify-center gap-1.5 w-8 h-8 sm:w-9 sm:h-9 xl:w-auto xl:px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <Heart className="w-4 h-4" />
                <span className="hidden xl:inline text-xs font-semibold whitespace-nowrap">
                  {t('support.button')}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenShortcuts}
              aria-label={t('nav.shortcutsLabel')}
              aria-keyshortcuts="Control+/ ?"
              title={`${t('nav.shortcutsLabel')} (? or Ctrl+/)`}
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenWelcome}
              aria-label={t('nav.openGuide')}
              title={t('nav.openGuide')}
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-teal-700 dark:hover:text-teal-300 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={nextThemeLabel}
              aria-keyshortcuts="Alt+T t"
              title={nextThemeLabel}
              className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              {themeMode === 'midnight' ? (
                <Contrast className="w-4 h-4 text-teal-300" />
              ) : themeMode === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClearAmounts}
              disabled={!hasAnyAmount}
              aria-keyshortcuts="Control+Shift+X Alt+X"
              title="Clear all amounts (Ctrl+Shift+X or Alt+X)"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 lg:px-3.5 lg:py-2 text-xs lg:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:bg-slate-200/80 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 shadow-xs disabled:shadow-none"
            >
              <Eraser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t('nav.clearAmounts')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile App Bottom Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        data-tour="mobile-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-4 h-16 shadow-[0_-4px_20px_-6px_rgba(15,23,42,0.08)] dark:shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.45)] transition-colors no-print"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.Icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap min-w-0 ${
                isActive
                  ? 'text-teal-700 dark:text-teal-300'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span
                className={`px-2.5 py-1 rounded-full transition-colors ${
                  isActive
                    ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <span className="truncate">{t(item.mobileKey)}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
