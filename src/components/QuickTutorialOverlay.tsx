import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { TranslationKey, useI18n } from '../i18n';
import { ActiveTab } from './TopBar';

interface TutorialStep {
  id: string;
  tab: ActiveTab;
  selector: string;
  mobileSelector?: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'enter-amount',
    tab: 'calculator',
    selector: '[data-tour="salary-inputs"]',
    titleKey: 'tour.step1Title',
    descKey: 'tour.step1Desc',
  },
  {
    id: 'currency-converter',
    tab: 'calculator',
    selector: '[data-tour="currency-converter"]',
    titleKey: 'tour.step2Title',
    descKey: 'tour.step2Desc',
  },
  {
    id: 'country-rules',
    tab: 'calculator',
    selector: '[data-tour="country-tax-controls"]',
    titleKey: 'tour.step3Title',
    descKey: 'tour.step3Desc',
  },
  {
    id: 'export-breakdown',
    tab: 'calculator',
    selector: '[data-tour="breakdown-export"]',
    titleKey: 'tour.step4Title',
    descKey: 'tour.step4Desc',
  },
  {
    id: 'explore-tools',
    tab: 'calculator',
    selector: '[data-tour="primary-nav"]',
    mobileSelector: '[data-tour="mobile-nav"]',
    titleKey: 'tour.step5Title',
    descKey: 'tour.step5Desc',
  },
];

interface QuickTutorialOverlayProps {
  isOpen: boolean;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onClose: () => void;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function QuickTutorialOverlay({
  isOpen,
  activeTab,
  onSelectTab,
  onClose,
}: QuickTutorialOverlayProps) {
  const { t } = useI18n();
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  const currentStep = TUTORIAL_STEPS[stepIdx] ?? TUTORIAL_STEPS[0];
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === TUTORIAL_STEPS.length - 1;

  useEffect(() => {
    if (!isOpen) {
      setStepIdx(0);
      setRect(null);
    }
  }, [isOpen]);

  // Ensure the target tab for the active step is selected
  useEffect(() => {
    if (!isOpen) return;
    if (activeTab !== currentStep.tab) {
      onSelectTab(currentStep.tab);
    }
  }, [isOpen, currentStep.tab, activeTab, onSelectTab]);

  const measureTarget = useCallback(() => {
    if (!isOpen) return;
    const useMobile =
      typeof window !== 'undefined' &&
      window.innerWidth < 768 &&
      currentStep.mobileSelector;
    const query = useMobile
      ? currentStep.mobileSelector!
      : currentStep.selector;
    const el = document.querySelector(query);
    if (!(el instanceof HTMLElement)) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) {
      setRect(null);
      return;
    }
    const pad = 6;
    setRect({
      top: Math.max(4, r.top - pad),
      left: Math.max(4, r.left - pad),
      width: Math.min(window.innerWidth - 8, r.width + pad * 2),
      height: r.height + pad * 2,
    });
  }, [isOpen, currentStep.selector, currentStep.mobileSelector]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const useMobile =
      typeof window !== 'undefined' &&
      window.innerWidth < 768 &&
      currentStep.mobileSelector;
    const query = useMobile
      ? currentStep.mobileSelector!
      : currentStep.selector;
    const el = document.querySelector(query);
    if (el instanceof HTMLElement && !currentStep.mobileSelector) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    measureTarget();
    const timer1 = window.setTimeout(measureTarget, 120);
    const timer2 = window.setTimeout(measureTarget, 360);

    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [isOpen, stepIdx, activeTab, currentStep, measureTarget]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isLast) {
          onClose();
        } else {
          setStepIdx((prev) => Math.min(TUTORIAL_STEPS.length - 1, prev + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStepIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLast, onClose]);

  if (!isOpen) return null;

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const cardWidth = Math.min(360, vw - 24);
  const estimatedCardHeight = 225;

  let cardTop = Math.max(24, vh / 2 - estimatedCardHeight / 2);
  let cardLeft = Math.max(12, vw / 2 - cardWidth / 2);
  let arrowDirection: 'up' | 'down' | null = null;
  let arrowOffsetX = cardWidth / 2;

  if (rect) {
    const spaceBelow = vh - (rect.top + rect.height);
    const spaceAbove = rect.top;
    const placeBelow =
      spaceBelow >= estimatedCardHeight + 24 || spaceBelow >= spaceAbove;

    if (placeBelow) {
      cardTop = Math.min(
        vh - estimatedCardHeight - 16,
        rect.top + rect.height + 16
      );
      arrowDirection = 'up';
    } else {
      cardTop = Math.max(16, rect.top - estimatedCardHeight - 16);
      arrowDirection = 'down';
    }

    const targetCenterX = rect.left + rect.width / 2;
    cardLeft = Math.max(
      12,
      Math.min(vw - cardWidth - 12, targetCenterX - cardWidth / 2)
    );
    arrowOffsetX = Math.max(
      24,
      Math.min(cardWidth - 24, targetCenterX - cardLeft)
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-tutorial-title"
    >
      {/* Click-outside backdrop */}
      <div
        className="fixed inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Spotlight Box with dimmed surroundings */}
      {rect ? (
        <div
          aria-hidden="true"
          style={{
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.65)',
          }}
          className="fixed rounded-2xl border-2 border-teal-400 ring-4 ring-teal-500/30 pointer-events-none transition-all duration-200"
        />
      ) : (
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-slate-950/65 pointer-events-none"
        />
      )}

      {/* Floating Tutorial Card + Arrow Pointer */}
      <div
        style={{
          top: `${cardTop}px`,
          left: `${cardLeft}px`,
          width: `${cardWidth}px`,
        }}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-4 sm:p-5 text-slate-900 dark:text-slate-100 transition-all duration-200"
      >
        {/* Directional Arrow Pointer */}
        {arrowDirection === 'up' && (
          <div
            aria-hidden="true"
            style={{ left: `${arrowOffsetX}px` }}
            className="absolute -top-2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-slate-900 border-l border-t border-slate-200 dark:border-slate-700"
          />
        )}
        {arrowDirection === 'down' && (
          <div
            aria-hidden="true"
            style={{ left: `${arrowOffsetX}px` }}
            className="absolute -bottom-2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-slate-900 border-r border-b border-slate-200 dark:border-slate-700"
          />
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
            <Compass className="w-4 h-4 shrink-0" />
            <span>
              {t('tour.badge', {
                current: stepIdx + 1,
                total: TUTORIAL_STEPS.length,
              })}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('tour.exit')}
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2
          id="quick-tutorial-title"
          className="mt-2 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100"
        >
          {t(currentStep.titleKey)}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {t(currentStep.descKey)}
        </p>

        {/* Step Progress Bars */}
        <div className="mt-3.5 flex items-center gap-1.5" aria-hidden="true">
          {TUTORIAL_STEPS.map((s, idx) => (
            <span
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                idx <= stepIdx
                  ? 'bg-teal-600 dark:bg-teal-400'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {t('tour.exit')}
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStepIdx((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('tour.back')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  onClose();
                } else {
                  setStepIdx((prev) =>
                    Math.min(TUTORIAL_STEPS.length - 1, prev + 1)
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{isLast ? t('tour.finish') : t('tour.next')}</span>
              {!isLast && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
