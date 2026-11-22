import { Check, Copy, Download, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useI18n } from '../i18n';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useI18n();
  const [showGuide, setShowGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!showGuide) {
      setCopiedUrl(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGuide]);

  // Suppress install button when already running in standalone PWA mode
  if (isInstalled) {
    return null;
  }

  const appUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : '';

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) return;
      return;
    }
    setShowGuide(true);
  };

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(appUrl);
        setCopiedUrl(true);
        window.setTimeout(() => setCopiedUrl(false), 2500);
      }
    } catch {
      // ignore clipboard restrictions
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Install PocketWage app"
        title="Install PocketWage on Android, iOS, or Desktop"
        className="inline-flex items-center justify-center gap-1.5 w-8 h-8 sm:w-9 sm:h-9 xl:w-auto xl:px-3 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100/80 dark:hover:bg-teal-900/60 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
      >
        <Download className="w-4 h-4" />
        <span className="hidden xl:inline text-xs font-semibold whitespace-nowrap">
          {t('nav.install')}
        </span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs"
          onClick={() => setShowGuide(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h2
                    id="pwa-install-title"
                    className="text-base font-bold text-slate-900 dark:text-slate-100"
                  >
                    {isIOS ? 'Install on iPhone / iPad' : 'Install PocketWage App'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Works offline on your home screen
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install instructions"
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {isIOS ? (
                <ol className="space-y-2 list-decimal list-inside">
                  <li>
                    Open this page directly in{' '}
                    <strong className="font-semibold text-slate-900 dark:text-slate-100">
                      Safari
                    </strong>
                    .
                  </li>
                  <li>
                    Tap the{' '}
                    <strong className="font-semibold text-slate-900 dark:text-slate-100">
                      Share
                    </strong>{' '}
                    button in Safari&apos;s toolbar.
                  </li>
                  <li>
                    Scroll down and tap{' '}
                    <strong className="font-semibold text-slate-900 dark:text-slate-100">
                      Add to Home Screen
                    </strong>
                    .
                  </li>
                </ol>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Android (Chrome)
                    </div>
                    <p className="mt-1 text-xs leading-relaxed">
                      Open the app link in Chrome (outside any preview frame), tap the{' '}
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">
                        ⋮ menu
                      </strong>{' '}
                      at top right, and select{' '}
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">
                        Install app
                      </strong>{' '}
                      or{' '}
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">
                        Add to Home screen
                      </strong>
                      .
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      iPhone / iPad (Safari)
                    </div>
                    <p className="mt-1 text-xs leading-relaxed">
                      Tap <strong className="font-semibold text-slate-900 dark:text-slate-100">Share</strong> in Safari and choose{' '}
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>
              )}

              {appUrl && (
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={appUrl}
                    onFocus={(e) => e.currentTarget.select()}
                    aria-label="App install URL"
                    className="flex-1 min-w-0 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
