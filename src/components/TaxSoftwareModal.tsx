import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  buildTaxPartnerUrl,
  TAX_SOFTWARE_PARTNERS,
} from '../data/affiliatePartners';
import { getCountryPreset } from '../data/countryPresets';
import { getCurrencyOption } from '../data/currencies';
import { useI18n } from '../i18n';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import {
  buildTaxSummaryText,
  downloadTaxSummaryJson,
} from '../utils/exportSalary';
import { formatCurrency } from '../utils/format';
import { getActiveAuthorityLabel } from '../utils/taxYearRules';

interface TaxSoftwareModalProps {
  isOpen: boolean;
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  onClose: () => void;
  onAnnounce?: (message: string) => void;
}

export function TaxSoftwareModal({
  isOpen,
  settings,
  breakdown,
  onClose,
  onAnnounce,
}: TaxSoftwareModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sym = settings.currencySymbol;
  const decimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const countryPreset = getCountryPreset(settings.countryCode);
  const authorityLabel = getActiveAuthorityLabel(settings);

  const handleCopySummary = async () => {
    const text = buildTaxSummaryText(settings, breakdown);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const input = document.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', '');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      onAnnounce?.('Copied annual tax summary');
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard error
    }
  };

  const handleDownloadJson = () => {
    const filename = downloadTaxSummaryJson(settings, breakdown);
    onAnnounce?.(`Downloaded ${filename}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs no-print"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tax-software-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="tax-software-modal-title"
                className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
              >
                {t('partner.taxModalTitle')}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {countryPreset.name} ({settings.currencyCode}) · {authorityLabel}
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

        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Annual Tax Summary Preview */}
          <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400">
                Annual Taxable Gross
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(breakdown.annualTaxableGross, sym, decimals)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400">
                Estimated Income Tax &amp; Levies
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                -{formatCurrency(breakdown.annualTotalTax, sym, decimals)}{' '}
                <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                  ({breakdown.effectiveTaxRate.toFixed(1)}% eff.)
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400">
                {settings.retirementLabel} ({settings.superRate}%)
              </span>
              <span className="font-mono tabular-nums font-semibold text-sky-700 dark:text-sky-400">
                +{formatCurrency(breakdown.annualSuper, sym, decimals)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                Annual Cash Take-Home
              </span>
              <span className="font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                {formatCurrency(breakdown.annualNetPocket, sym, decimals)}
              </span>
            </div>
          </div>

          {/* Portable Summary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Summary Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Tax Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Tax JSON</span>
            </button>
          </div>

          {/* Tax & Accounting Partner Handoffs */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {t('partner.taxPartnersHeading')}
            </div>

            <div className="space-y-2">
              {TAX_SOFTWARE_PARTNERS.map((partner) => {
                const href = buildTaxPartnerUrl(partner, {
                  annualGross: breakdown.annualTaxableGross,
                  annualTax: breakdown.annualTotalTax,
                  annualSuper: breakdown.annualSuper,
                  effectiveTaxRate: breakdown.effectiveTaxRate,
                  currencyCode: settings.currencyCode,
                  countryCode: settings.countryCode,
                });
                return (
                  <a
                    key={partner.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/55 border border-slate-200/90 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-white dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        <span>{partner.name}</span>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                          · {partner.bestFor}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {partner.tagline}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Disclosure */}
        <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{t('partner.taxModalPrivacy')}</span>
        </div>
      </div>
    </div>
  );
}
