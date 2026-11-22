import { ExternalLink, Heart, Lock, ShieldAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

interface SupportModalProps {
  isOpen: boolean;
  currencyCode: string;
  onClose: () => void;
}

interface StripeConfigResponse {
  checkoutEnabled: boolean;
  paymentLinkUrl: string;
}

const PRESET_AMOUNTS = [5, 10, 25, 50];
const SUPPORTED_STRIPE_CURRENCIES = new Set([
  'AUD',
  'USD',
  'SGD',
  'GBP',
  'EUR',
  'CAD',
  'NZD',
]);

function resolveTipCurrency(code: string): string {
  const upper = code.toUpperCase();
  return SUPPORTED_STRIPE_CURRENCIES.has(upper) ? upper : 'AUD';
}

export function SupportModal({
  isOpen,
  currencyCode,
  onClose,
}: SupportModalProps) {
  const { t } = useI18n();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(10);
  const [customInput, setCustomInput] = useState<string>('');
  const [config, setConfig] = useState<StripeConfigResponse | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(false);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tipCurrency = resolveTipCurrency(currencyCode);
  const parsedCustom = Number(customInput);
  const activeAmount =
    selectedPreset !== null
      ? selectedPreset
      : Number.isFinite(parsedCustom)
        ? parsedCustom
        : 0;
  const isAmountValid =
    Number.isFinite(activeAmount) && activeAmount >= 1 && activeAmount <= 500;

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setErrorMessage(null);
    setIsLoadingConfig(true);

    fetch('/api/stripe/config')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return (await res.json()) as StripeConfigResponse;
      })
      .then((data) => {
        if (!cancelled) {
          setConfig(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          const fallbackPaymentLink = (
            import.meta.env.VITE_STRIPE_DONATION_URL || ''
          ).trim();
          setConfig({
            checkoutEnabled: false,
            paymentLinkUrl: fallbackPaymentLink,
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingConfig(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

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

  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: tipCurrency,
    maximumFractionDigits: activeAmount % 1 === 0 ? 0 : 2,
  }).format(isAmountValid ? activeAmount : 0);

  const isStripeConfigured = Boolean(
    config?.checkoutEnabled || config?.paymentLinkUrl
  );

  const handleContinueToStripe = async () => {
    setErrorMessage(null);

    if (config?.checkoutEnabled) {
      if (!isAmountValid) return;
      setIsRedirecting(true);
      try {
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: activeAmount,
            currency: tipCurrency.toLowerCase(),
          }),
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          setErrorMessage(data.error || t('support.errorGeneric'));
          setIsRedirecting(false);
          return;
        }
        window.location.assign(data.url);
      } catch {
        setErrorMessage(t('support.errorGeneric'));
        setIsRedirecting(false);
      }
      return;
    }

    if (config?.paymentLinkUrl) {
      setIsRedirecting(true);
      window.location.assign(config.paymentLinkUrl);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="support-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
              >
                {t('support.modalTitle')}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {t('support.modalSubtitle')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t('legal.close')}
            className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {!isLoadingConfig && !isStripeConfigured ? (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800/70 bg-amber-50/70 dark:bg-amber-950/30 p-4 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                <p className="font-semibold">{t('support.notConfiguredTitle')}</p>
                <p className="mt-1 text-amber-800 dark:text-amber-300/90">
                  {t('support.notConfiguredDesc')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t('support.chooseAmount', { currency: tipCurrency })}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = selectedPreset === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(amt);
                          setCustomInput('');
                          setErrorMessage(null);
                        }}
                        className={`py-2.5 px-2 rounded-xl border text-sm font-bold font-mono tabular-nums transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-600'
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {config?.checkoutEnabled && (
                <div>
                  <label
                    htmlFor="support-custom-amount"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t('support.customAmount')} ({tipCurrency})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-slate-500">
                      $
                    </span>
                    <input
                      id="support-custom-amount"
                      type="number"
                      min={1}
                      max={500}
                      step="1"
                      placeholder="15"
                      value={customInput}
                      onFocus={() => setSelectedPreset(null)}
                      onChange={(e) => {
                        setSelectedPreset(null);
                        setCustomInput(e.target.value);
                        setErrorMessage(null);
                      }}
                      className="w-full pl-8 pr-16 py-2.5 text-sm font-mono tabular-nums rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      {tipCurrency}
                    </span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <p
                  role="alert"
                  className="text-xs font-medium text-rose-600 dark:text-rose-400"
                >
                  {errorMessage}
                </p>
              )}

              <button
                type="button"
                disabled={
                  isLoadingConfig ||
                  isRedirecting ||
                  (config?.checkoutEnabled && !isAmountValid)
                }
                onClick={handleContinueToStripe}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-[0.99] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <span>
                  {isRedirecting
                    ? t('support.redirecting')
                    : t('support.payButton', { amount: formattedAmount })}
                </span>
                <ExternalLink className="w-4 h-4 shrink-0" />
              </button>
            </>
          )}

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span>{t('support.secureNote')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
