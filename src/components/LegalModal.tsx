import { FileText, ShieldCheck, X } from 'lucide-react';
import { useEffect } from 'react';
import { getLegalContent, LegalDocTab } from '../data/legalContent';
import { useI18n } from '../i18n';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalDocTab;
  onChangeTab: (tab: LegalDocTab) => void;
  onClose: () => void;
}

export function LegalModal({
  isOpen,
  activeTab,
  onChangeTab,
  onClose,
}: LegalModalProps) {
  const { language, t } = useI18n();

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

  const bundle = getLegalContent(language);
  const sections = activeTab === 'privacy' ? bundle.privacy : bundle.terms;
  const Icon = activeTab === 'privacy' ? ShieldCheck : FileText;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs no-print"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 sm:px-7 sm:pt-6 border-b border-slate-100 dark:border-slate-800 space-y-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h2
                  id="legal-modal-title"
                  className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance"
                >
                  {activeTab === 'privacy'
                    ? t('legal.privacyPolicy')
                    : t('legal.termsConditions')}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  PocketWage · {t('legal.effectiveDate')}
                </p>
              </div>
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

          {/* Interactive Document Switcher */}
          <div
            role="tablist"
            aria-label={t('legal.summaryTitle')}
            className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'privacy'}
              onClick={() => onChangeTab('privacy')}
              className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeTab === 'privacy'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('legal.privacyPolicy')}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'terms'}
              onClick={() => onChangeTab('terms')}
              className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                activeTab === 'terms'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t('legal.termsConditions')}
            </button>
          </div>
        </div>

        {/* Scrollable Legal Body */}
        <div
          role="tabpanel"
          aria-label={
            activeTab === 'privacy'
              ? t('legal.privacyPolicy')
              : t('legal.termsConditions')
          }
          className="flex-1 overflow-y-auto px-5 py-2 sm:px-7 divide-y divide-slate-100 dark:divide-slate-800"
        >
          {sections.map((section) => (
            <section key={section.heading} className="py-4 space-y-2">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                {section.heading}
              </h3>
              {section.body.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 sm:px-7 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {t('legal.footerNotice')}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {t('legal.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
