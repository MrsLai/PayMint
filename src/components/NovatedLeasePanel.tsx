import { Car, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  buildNovatedPartnerUrl,
  NOVATED_LEASE_PARTNERS,
} from '../data/affiliatePartners';
import { getCurrencyOption } from '../data/currencies';
import { useI18n } from '../i18n';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import { formatCurrency } from '../utils/format';
import {
  computeNovatedLeaseEstimate,
  NovatedVehicleType,
} from '../utils/novatedLease';

interface NovatedLeasePanelProps {
  settings: PaySettings;
  breakdown: SalaryBreakdown;
}

const LEASE_BUDGET_PRESETS = [12000, 15000, 20000, 25000];

export function NovatedLeasePanel({
  settings,
  breakdown,
}: NovatedLeasePanelProps) {
  const { t } = useI18n();
  const [isEnabled, setIsEnabled] = useState(false);
  const [annualLeaseCost, setAnnualLeaseCost] = useState<number>(15000);
  const [vehicleType, setVehicleType] =
    useState<NovatedVehicleType>('ev_fbt_exempt');

  const sym = settings.currencySymbol;
  const decimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const hasAmount = settings.inputAmount > 0;

  const estimate = useMemo(
    () =>
      computeNovatedLeaseEstimate(
        settings,
        breakdown,
        annualLeaseCost,
        vehicleType
      ),
    [settings, breakdown, annualLeaseCost, vehicleType]
  );

  return (
    <section
      aria-label={t('partner.novatedToggle')}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
    >
      {/* Toggle Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('partner.novatedToggle')}
              </h2>
              {hasAmount && isEnabled && estimate.annualTaxSaved > 0 && (
                <span className="text-xs font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                  Est. {formatCurrency(estimate.annualTaxSaved, sym, 0)}/yr tax saved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('partner.novatedDesc')}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          aria-label={t('partner.novatedToggle')}
          onClick={() => setIsEnabled((prev) => !prev)}
          className="inline-flex items-center gap-2.5 self-start sm:self-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-xl p-1"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
            {isEnabled ? 'On' : 'Off'}
          </span>
          <span
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEnabled ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Expanded Estimator & Affiliate Partner Quote Handoff */}
      {isEnabled && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* Vehicle Type Segmented Control */}
            <div className="md:col-span-5">
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Vehicle &amp; FBT Packaging Mode
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setVehicleType('ev_fbt_exempt')}
                  className={`px-2.5 py-2 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer truncate ${
                    vehicleType === 'ev_fbt_exempt'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  EV (100% Pre-Tax)
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleType('ice_ecm')}
                  className={`px-2.5 py-2 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer truncate ${
                    vehicleType === 'ice_ecm'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Hybrid / Petrol (~60%)
                </button>
              </div>
            </div>

            {/* Annual Vehicle Lease + Running Budget */}
            <div className="md:col-span-4">
              <label
                htmlFor="novated-annual-budget"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                Annual Lease &amp; Running Budget
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                  {sym}
                </span>
                <input
                  id="novated-annual-budget"
                  type="number"
                  min={0}
                  step={1000}
                  value={annualLeaseCost}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setAnnualLeaseCost(Number.isNaN(v) || v < 0 ? 0 : v);
                  }}
                  className="w-full pl-8 pr-10 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                  /yr
                </span>
              </div>
            </div>

            {/* Quick Budget Presets */}
            <div className="md:col-span-3 flex flex-wrap gap-1.5">
              {LEASE_BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAnnualLeaseCost(preset)}
                  className={`px-2.5 py-2 text-[11px] font-mono font-semibold rounded-xl border transition-colors cursor-pointer ${
                    annualLeaseCost === preset
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-500'
                  }`}
                >
                  {sym}
                  {preset / 1000}k
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Comparison Output */}
          {!hasAmount ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              Enter your salary above to calculate your estimated pre-tax lease tax savings, or preview partner quotes below.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/70 p-3.5">
              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Est. Annual Tax &amp; Levy Saved
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-0.5">
                  +{formatCurrency(estimate.annualTaxSaved, sym, decimals)}
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                  {estimate.taxSavingsPctOfLease.toFixed(1)}% effective tax discount
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Net Effective Lease Cost
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-0.5">
                  {formatCurrency(estimate.netOutOfPocketAnnual, sym, decimals)}/yr
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatCurrency(
                    Math.abs(estimate.monthlyNetPayDifference),
                    sym,
                    decimals
                  )}
                  /mo impact on take-home
                </div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Packaged Taxable Gross
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 mt-0.5">
                  {formatCurrency(estimate.packagedTaxableGross, sym, 0)}
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 mt-0.5">
                  Down from {formatCurrency(estimate.baselineTaxableGross, sym, 0)}
                </div>
              </div>
            </div>
          )}

          {/* Partner Quote Handoff Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {t('partner.novatedPartnersTitle', {
                gross: hasAmount
                  ? formatCurrency(breakdown.annualTaxableGross, sym, 0)
                  : `${sym}0`,
              })}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {NOVATED_LEASE_PARTNERS.map((partner) => {
                const href = buildNovatedPartnerUrl(partner, {
                  annualGross: breakdown.annualTaxableGross,
                  annualLeaseCost,
                  vehicleType,
                  estimatedTaxSaved: estimate.annualTaxSaved,
                  currencyCode: settings.currencyCode,
                  countryCode: settings.countryCode,
                });
                return (
                  <a
                    key={partner.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-white dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                        <span className="truncate">{partner.name}</span>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 truncate">
                          · {partner.bestFor}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {partner.tagline}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0 transition-colors" />
                  </a>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {t('partner.novatedNote')} · {t('partner.disclosure')}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
