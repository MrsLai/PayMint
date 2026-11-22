import { ArrowRight, ExternalLink, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  buildSuperPartnerUrl,
  SUPER_ETF_PARTNERS,
} from '../data/affiliatePartners';
import { getCurrencyOption } from '../data/currencies';
import { useI18n } from '../i18n';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import { formatCurrency } from '../utils/format';
import { computeRetirementProjection } from '../utils/retirementEngine';

interface SuperEtfCalloutProps {
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  onOpenRetirement: () => void;
}

const SACRIFICE_PRESETS = [0, 2500, 5000, 10000];

export function SuperEtfCallout({
  settings,
  breakdown,
  onOpenRetirement,
}: SuperEtfCalloutProps) {
  const { t } = useI18n();
  const [extraSacrificeAnnual, setExtraSacrificeAnnual] = useState<number>(2500);

  const sym = settings.currencySymbol;
  const decimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const hasAmount = settings.inputAmount > 0;
  const annualSuper = breakdown.annualSuper;

  const { base25Yr, boosted25Yr, extraGain25Yr } = useMemo(() => {
    const monthlyBaseSuper = annualSuper / 12;
    const monthlySacrifice = extraSacrificeAnnual / 12;

    const baseProj = computeRetirementProjection({
      startingSavings: 0,
      monthlyPersonalSavings: 0,
      monthlyEmployerRetirement: monthlyBaseSuper,
      annualReturnPct: 7.0,
      annualInflationPct: 2.5,
      years: 25,
    });

    const boostedProj = computeRetirementProjection({
      startingSavings: 0,
      monthlyPersonalSavings: monthlySacrifice,
      monthlyEmployerRetirement: monthlyBaseSuper,
      annualReturnPct: 7.0,
      annualInflationPct: 2.5,
      years: 25,
    });

    return {
      base25Yr: baseProj.finalNominal,
      boosted25Yr: boostedProj.finalNominal,
      extraGain25Yr: Math.max(0, boostedProj.finalNominal - baseProj.finalNominal),
    };
  }, [annualSuper, extraSacrificeAnnual]);

  return (
    <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/35 px-4 sm:px-6 py-4 sm:py-5 space-y-4">
      {/* Contextual Headline tied directly to the calculated Superannuation / Retirement figure */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/70 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs sm:text-sm">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {settings.retirementLabel} ({formatCurrency(annualSuper, sym, decimals)}/yr)
              </span>
              <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300">
                {t('partner.superPrompt', { label: settings.retirementLabel })}
              </span>
            </div>

            {hasAmount && (
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  25-yr forecast at 7% p.a.:{' '}
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(boosted25Yr, sym, 0)}
                  </span>
                  {extraSacrificeAnnual > 0 && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono tabular-nums font-semibold ml-1">
                      (+{formatCurrency(extraGain25Yr, sym, 0)} vs{' '}
                      {formatCurrency(base25Yr, sym, 0)} base)
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Extra Salary-Sacrifice Preview + Retirement Tab Link */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div
            role="group"
            aria-label="Extra annual contribution preview"
            className="inline-flex items-center p-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            {SACRIFICE_PRESETS.map((amt) => {
              const active = extraSacrificeAnnual === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setExtraSacrificeAnnual(amt)}
                  className={`px-2 py-1 text-[11px] font-mono font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {amt === 0 ? '+0/yr' : `+${sym}${(amt / 1000).toFixed(amt % 1000 === 0 ? 0 : 1)}k`}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenRetirement}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{t('partner.openRetirement')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Superannuation & ETF Partner Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SUPER_ETF_PARTNERS.map((partner) => {
          const href = buildSuperPartnerUrl(partner, {
            annualSuper,
            annualGross: breakdown.annualTaxableGross,
            currencyCode: settings.currencyCode,
            countryCode: settings.countryCode,
          });
          return (
            <a
              key={partner.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
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
        {t('partner.disclosure')}
      </p>
    </div>
  );
}
