import {
  ArrowRight,
  Calculator,
  Compass,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { LegalDocTab } from '../data/legalContent';
import { TranslationKey, useI18n } from '../i18n';
import { ActiveTab } from './TopBar';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenShortcuts?: () => void;
  onStartTutorial?: () => void;
  onOpenLegal?: (tab: LegalDocTab) => void;
  onOpenSupport?: () => void;
}

const TOOL_GUIDE_ITEMS: Array<{
  tab: ActiveTab;
  titleKey: TranslationKey;
  actionKey: TranslationKey;
  descKey: TranslationKey;
  Icon: typeof Calculator;
  iconStyle: string;
}> = [
  {
    tab: 'calculator',
    titleKey: 'welcome.guideCalcTitle',
    actionKey: 'welcome.guideCalcAction',
    descKey: 'welcome.guideCalcDesc',
    Icon: Calculator,
    iconStyle:
      'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
  },
  {
    tab: 'compare',
    titleKey: 'welcome.guideCompareTitle',
    actionKey: 'welcome.guideCompareAction',
    descKey: 'welcome.guideCompareDesc',
    Icon: TrendingUp,
    iconStyle:
      'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
  },
  {
    tab: 'retirement',
    titleKey: 'welcome.guideRetireTitle',
    actionKey: 'welcome.guideRetireAction',
    descKey: 'welcome.guideRetireDesc',
    Icon: PiggyBank,
    iconStyle: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
  },
];

export function WelcomeModal({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenShortcuts,
  onStartTutorial,
  onOpenLegal,
  onOpenSupport,
}: WelcomeModalProps) {
  const { t } = useI18n();
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-7 sm:pt-6 sm:pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2
              id="welcome-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance"
            >
              {t('welcome.title')}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('welcome.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('legal.close')}
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Core Tools Guide */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 px-5 sm:px-7">
          {TOOL_GUIDE_ITEMS.map((item) => {
            const Icon = item.Icon;
            return (
              <div
                key={item.tab}
                className="py-4 sm:py-5 flex items-start gap-3.5 sm:gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${item.iconStyle}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                      {t(item.titleKey)}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateTab(item.tab);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{t(item.actionKey)}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {t(item.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Privacy reassurance + Primary CTA */}
        <div className="px-5 py-4 sm:px-7 sm:py-5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('welcome.localSavedNote')}</span>
            </div>
            {(onOpenLegal || onOpenSupport) && (
              <div className="flex flex-wrap items-center gap-2 pl-6 text-[11px] text-slate-500 dark:text-slate-400">
                {onOpenLegal && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenLegal('privacy');
                      }}
                      className="hover:text-teal-700 dark:hover:text-teal-300 underline-offset-2 hover:underline cursor-pointer"
                    >
                      {t('legal.privacyPolicy')}
                    </button>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenLegal('terms');
                      }}
                      className="hover:text-teal-700 dark:hover:text-teal-300 underline-offset-2 hover:underline cursor-pointer"
                    >
                      {t('legal.termsConditions')}
                    </button>
                  </>
                )}
                {onOpenSupport && (
                  <>
                    {onOpenLegal && <span aria-hidden="true">·</span>}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenSupport();
                      }}
                      className="font-medium text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 underline-offset-2 hover:underline cursor-pointer"
                    >
                      {t('welcome.supportLink')}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onStartTutorial && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartTutorial();
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{t('calc.quickTour')}</span>
              </button>
            )}
            {onOpenShortcuts && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShortcuts();
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <span>{t('welcome.shortcuts')}</span>
                <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  ?
                </kbd>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 active:scale-[0.98] rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <span>{t('welcome.getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
