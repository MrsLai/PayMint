import { ArrowLeft, PiggyBank } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getCurrencyOption } from '../data/currencies';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import {
  formatConvertedCurrency,
  formatCurrency,
} from '../utils/format';
import { computeRetirementProjection } from '../utils/retirementEngine';
import { getRetirementTooltipCopy } from '../utils/regulationInfo';
import { AccentColorId, ThemeMode } from '../data/themePresets';
import { useI18n } from '../i18n';
import { CurrencyConverterBar } from './CurrencyConverterBar';
import { InfoTooltip } from './InfoTooltip';
import { RetirementGrowthChart } from './RetirementGrowthChart';

interface RetirementProjectionsSectionProps {
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  startingSavings: number;
  onChangeStartingSavings: (amt: number) => void;
  savingsRatePct: number;
  onChangeSavingsRatePct: (pct: number) => void;
  includeEmployerRetirement: boolean;
  onChangeIncludeEmployerRetirement: (val: boolean) => void;
  annualReturnPct: number;
  onChangeAnnualReturnPct: (pct: number) => void;
  annualInflationPct: number;
  onChangeAnnualInflationPct: (pct: number) => void;
  years: number;
  onChangeYears: (yrs: number) => void;
  valueMode: 'nominal' | 'real';
  onChangeValueMode: (mode: 'nominal' | 'real') => void;
  onUpdateSettings: (patch: Partial<PaySettings>) => void;
  onOpenCalculator: () => void;
  isDark: boolean;
  themeMode?: ThemeMode;
  accentColor?: AccentColorId;
}

const HORIZON_PRESETS = [10, 20, 25, 30, 40];
const SAVINGS_RATE_PRESETS = [10, 15, 20, 30];

export function RetirementProjectionsSection({
  settings,
  breakdown,
  startingSavings,
  onChangeStartingSavings,
  savingsRatePct,
  onChangeSavingsRatePct,
  includeEmployerRetirement,
  onChangeIncludeEmployerRetirement,
  annualReturnPct,
  onChangeAnnualReturnPct,
  annualInflationPct,
  onChangeAnnualInflationPct,
  years,
  onChangeYears,
  valueMode,
  onChangeValueMode,
  onUpdateSettings,
  onOpenCalculator,
  isDark,
  themeMode,
  accentColor,
}: RetirementProjectionsSectionProps) {
  const { t } = useI18n();
  const [inspectedYear, setInspectedYear] = useState<number | null>(null);

  const sym = settings.currencySymbol;
  const baseDecimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const inputPadClass =
    sym.length >= 4 ? 'pl-12' : sym.length >= 2 ? 'pl-9' : 'pl-7';
  const targetCurrencyOpt = getCurrencyOption(settings.targetCurrency);
  const retirementTooltip = getRetirementTooltipCopy(settings);

  const hasSalary = settings.inputAmount > 0;
  const monthlyNetCash = breakdown.annualNetPocket / 12;
  const monthlyPersonalSavings =
    monthlyNetCash * (Math.max(0, Math.min(100, savingsRatePct)) / 100);
  const monthlyEmployerRetirement = includeEmployerRetirement
    ? breakdown.annualSuper / 12
    : 0;
  const totalMonthlyContribution =
    monthlyPersonalSavings + monthlyEmployerRetirement;

  const projection = useMemo(
    () =>
      computeRetirementProjection({
        startingSavings,
        monthlyPersonalSavings,
        monthlyEmployerRetirement,
        annualReturnPct,
        annualInflationPct,
        years,
      }),
    [
      startingSavings,
      monthlyPersonalSavings,
      monthlyEmployerRetirement,
      annualReturnPct,
      annualInflationPct,
      years,
    ]
  );

  const hasInputs = startingSavings > 0 || totalMonthlyContribution > 0;
  const safeInspectedYear =
    inspectedYear !== null
      ? Math.max(0, Math.min(years, inspectedYear))
      : years;
  const activePoint =
    projection.points[safeInspectedYear] ??
    projection.points[projection.points.length - 1];

  const isReal = valueMode === 'real';
  const displayedFinalBalance = isReal
    ? projection.finalReal
    : projection.finalNominal;
  const displayedPrincipal = isReal
    ? (projection.points[projection.points.length - 1]?.realContributions ?? 0)
    : projection.totalContributions;
  const displayedInterest = isReal
    ? projection.totalInterestReal
    : projection.totalInterestNominal;
  const displayedInterestPct = isReal
    ? projection.interestShareRealPct
    : projection.interestShareNominalPct;
  const displayedMonthly4Pct = isReal
    ? projection.monthlyIncome4PctReal
    : projection.monthlyIncome4PctNominal;

  const milestonePoints = useMemo(() => {
    const candidateYears = new Set<number>([
      1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
    ]);
    return projection.points.filter(
      (pt) => pt.year > 0 && (candidateYears.has(pt.year) || pt.year === years)
    );
  }, [projection.points, years]);

  return (
    <div className="space-y-6">
      {/* Page Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
            {t('retirement.heroTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Estimate long-term compound wealth from your monthly net savings
            {includeEmployerRetirement && settings.superRate > 0
              ? ` and ${settings.superRate}% ${settings.retirementLabel}`
              : ''}
            , and convert your future nest egg into any currency.
          </p>
        </div>

        <div className="inline-flex p-0.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-xs dark:shadow-none self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => onChangeValueMode('nominal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              valueMode === 'nominal'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('retirement.futureValue')}
          </button>
          <button
            type="button"
            onClick={() => onChangeValueMode('real')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              valueMode === 'real'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {t('retirement.todaysMoney')}
          </button>
        </div>
      </div>

      {/* Linked Pay Status Banner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm">
            {hasSalary ? (
              <>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  Linked to Calculator Take-Home Pay
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
                  Cash Take-Home:{' '}
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(monthlyNetCash, sym, baseDecimals)}/mo
                  </span>{' '}
                  · {settings.retirementLabel}:{' '}
                  <span className="font-semibold text-sky-700 dark:text-sky-400">
                    +{formatCurrency(breakdown.annualSuper / 12, sym, baseDecimals)}
                    /mo
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  No Salary Entered Yet
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter your pay in the Calculator to auto-calculate monthly net savings &amp; {settings.retirementLabel}, or enter your Current Net Savings below.
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCalculator}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{hasSalary ? 'Edit Pay in Calculator' : 'Enter Pay in Calculator'}</span>
        </button>
      </section>

      {/* Compound Model Inputs Card */}
      <section
        aria-label="Retirement Projection Parameters"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Current Net Savings */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="ret-starting-savings"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Current Net Savings
              </label>
              {startingSavings > 0 && (
                <button
                  type="button"
                  onClick={() => onChangeStartingSavings(0)}
                  className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                {sym}
              </span>
              <input
                id="ret-starting-savings"
                type="number"
                min={0}
                step={1000}
                placeholder="0"
                value={startingSavings > 0 ? startingSavings : ''}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onChangeStartingSavings(Number.isNaN(v) || v < 0 ? 0 : v);
                }}
                className={`w-full ${inputPadClass} pr-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400`}
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Existing cash &amp; retirement balance
            </div>
          </div>

          {/* Monthly Net Pay Saved (%) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="ret-savings-rate"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Net Pay Saved (%)
              </label>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                {formatCurrency(monthlyPersonalSavings, sym, baseDecimals)}/mo
              </span>
            </div>
            <div className="relative">
              <input
                id="ret-savings-rate"
                type="number"
                min={0}
                max={100}
                step={1}
                value={savingsRatePct}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onChangeSavingsRatePct(
                    Number.isNaN(v) ? 0 : Math.max(0, Math.min(100, v))
                  );
                }}
                className="w-full px-3 pr-7 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                %
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 flex-wrap">
              {SAVINGS_RATE_PRESETS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onChangeSavingsRatePct(pct)}
                  className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                    savingsRatePct === pct
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-500'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Share of {formatCurrency(monthlyNetCash, sym, baseDecimals)}/mo take-home
            </div>
          </div>

          {/* Expected Annual Return */}
          <div>
            <label
              htmlFor="ret-annual-return"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Annual Return (%)
            </label>
            <div className="relative">
              <input
                id="ret-annual-return"
                type="number"
                min={0}
                max={25}
                step={0.5}
                value={annualReturnPct}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onChangeAnnualReturnPct(
                    Number.isNaN(v) ? 0 : Math.max(0, Math.min(25, v))
                  );
                }}
                className="w-full px-3 pr-7 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                %
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Compounded monthly
            </div>
          </div>

          {/* Inflation Rate */}
          <div>
            <label
              htmlFor="ret-inflation"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              Inflation Rate (%)
            </label>
            <div className="relative">
              <input
                id="ret-inflation"
                type="number"
                min={0}
                max={15}
                step={0.5}
                value={annualInflationPct}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  onChangeAnnualInflationPct(
                    Number.isNaN(v) ? 0 : Math.max(0, Math.min(15, v))
                  );
                }}
                className="w-full px-3 pr-7 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                %
              </span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Adjusts &quot;Today&apos;s Money&quot;
            </div>
          </div>

          {/* Horizon Years */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="ret-years"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                Horizon (Years)
              </label>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                1–50 yrs
              </span>
            </div>
            <div className="relative">
              <input
                id="ret-years"
                type="number"
                min={1}
                max={50}
                step={1}
                value={years}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  onChangeYears(
                    Number.isNaN(v) ? 1 : Math.max(1, Math.min(50, v))
                  );
                  setInspectedYear(null);
                }}
                className="w-full px-3 pr-10 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                yrs
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 flex-wrap">
              {HORIZON_PRESETS.map((presetYr) => (
                <button
                  key={presetYr}
                  type="button"
                  onClick={() => {
                    onChangeYears(presetYr);
                    setInspectedYear(null);
                  }}
                  className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md transition-colors cursor-pointer ${
                    years === presetYr
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-500'
                  }`}
                >
                  {presetYr}y
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="inline-flex items-center gap-1.5">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmployerRetirement}
                onChange={(e) =>
                  onChangeIncludeEmployerRetirement(e.target.checked)
                }
                className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
              />
              <span>
                Include {settings.retirementLabel} ({settings.superRate}%):{' '}
                <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                  +{formatCurrency(breakdown.annualSuper / 12, sym, baseDecimals)}
                  /mo
                </span>
              </span>
            </label>
            <InfoTooltip {...retirementTooltip} />
          </div>

          <div className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
            Total Monthly Contribution:{' '}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalMonthlyContribution, sym, baseDecimals)}/mo
            </span>
          </div>
        </div>
      </section>

      {/* Currency Exchange Converter directly for Retirement Projections */}
      <CurrencyConverterBar
        settings={settings}
        retirementData={{
          projectedWealth: displayedFinalBalance,
          totalContributions: displayedPrincipal,
          compoundInterest: displayedInterest,
          monthlyIncome4Pct: displayedMonthly4Pct,
          years,
          isReal,
          hasInputs,
        }}
        onUpdateSettings={onUpdateSettings}
      />

      {/* Projection KPIs */}
      <section
        aria-label="Retirement Wealth Summary"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1.5 min-w-0 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Projected Wealth (Year {years})
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums break-words ${
              hasInputs
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {formatCurrency(displayedFinalBalance, sym, 0)}
          </div>
          {targetCurrencyOpt && (
            <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 break-words">
              {formatConvertedCurrency(
                displayedFinalBalance,
                settings.exchangeRate,
                targetCurrencyOpt.symbol,
                targetCurrencyOpt.decimals
              )}{' '}
              {targetCurrencyOpt.code}
            </div>
          )}
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {isReal
              ? `Purchasing power in today's ${settings.currencyCode}`
              : `Future nominal value at ${annualReturnPct}%/yr`}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1.5 min-w-0 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Compound Interest Earned
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums break-words ${
              hasInputs
                ? 'text-teal-700 dark:text-teal-300'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            +{formatCurrency(displayedInterest, sym, 0)}
          </div>
          {targetCurrencyOpt && (
            <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 break-words">
              +
              {formatConvertedCurrency(
                displayedInterest,
                settings.exchangeRate,
                targetCurrencyOpt.symbol,
                targetCurrencyOpt.decimals
              )}{' '}
              {targetCurrencyOpt.code}
            </div>
          )}
          <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 break-words">
            Principal {formatCurrency(displayedPrincipal, sym, 0)} ·{' '}
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              {displayedInterestPct.toFixed(0)}% from compounding
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1.5 min-w-0 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>Est. Monthly Income (4% Rule)</span>
            <InfoTooltip
              title="4% Safe Withdrawal Rule"
              subtitle="Retirement Drawdown Guideline"
              description="Estimates sustainable monthly retirement income by drawing 4% of your projected nest egg each year, divided across 12 months."
              formula="Monthly Income = (Projected Wealth × 4%) ÷ 12"
            />
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums break-words ${
              hasInputs
                ? 'text-sky-700 dark:text-sky-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {formatCurrency(displayedMonthly4Pct, sym, baseDecimals)}/mo
          </div>
          {targetCurrencyOpt && (
            <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 break-words">
              {formatConvertedCurrency(
                displayedMonthly4Pct,
                settings.exchangeRate,
                targetCurrencyOpt.symbol,
                targetCurrencyOpt.decimals
              )}
              /mo {targetCurrencyOpt.code}
            </div>
          )}
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Sustainable 4% annual retirement drawdown
          </div>
        </div>
      </section>

      {/* Interactive Recharts Compound Growth Curve & Milestone Breakdown */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
        <RetirementGrowthChart
          points={projection.points}
          years={years}
          isReal={isReal}
          hasInputs={hasInputs}
          sym={sym}
          currencyCode={settings.currencyCode}
          retirementLabel={settings.retirementLabel}
          targetCurrency={settings.targetCurrency}
          exchangeRate={settings.exchangeRate}
          inspectedYear={safeInspectedYear}
          onInspectYear={(yr) => setInspectedYear(yr)}
          isDark={isDark}
          themeMode={themeMode}
          accentColor={accentColor}
        />

        {/* Milestone Accumulation Schedule */}
        <div>
          <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60">
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Milestone Growth Schedule
            </h3>
          </div>

          {/* Mobile Stacked Milestone Cards (< 768px) */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {milestonePoints.map((pt) => {
              const bal = isReal ? pt.realBalance : pt.nominalBalance;
              const contrib = isReal
                ? pt.realContributions
                : pt.totalContributions;
              const interest = isReal ? pt.realInterest : pt.nominalInterest;
              return (
                <div key={pt.year} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Year {pt.year}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isReal ? "Today's Value" : 'Projected Balance'}
                      </div>
                    </div>
                    <div className="text-right min-w-0">
                      <div
                        className={`text-base font-bold font-mono tabular-nums break-words ${
                          hasInputs
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {formatCurrency(bal, sym, 0)}
                      </div>
                      {targetCurrencyOpt && (
                        <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 break-words">
                          {formatConvertedCurrency(
                            bal,
                            settings.exchangeRate,
                            targetCurrencyOpt.symbol,
                            targetCurrencyOpt.decimals
                          )}{' '}
                          {targetCurrencyOpt.code}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 p-3 text-xs">
                    <div className="min-w-0">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Contributions
                      </div>
                      <div className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-100 break-words mt-0.5">
                        {formatCurrency(contrib, sym, 0)}
                      </div>
                    </div>
                    <div className="min-w-0 text-right">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Compound Interest
                      </div>
                      <div className="font-mono tabular-nums font-semibold text-teal-700 dark:text-teal-300 break-words mt-0.5">
                        +{formatCurrency(interest, sym, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop & Tablet Table (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/70 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-6">Year</th>
                  <th className="py-3 px-4 text-right">Total Contributions</th>
                  <th className="py-3 px-4 text-right">Compound Interest</th>
                  <th className="py-3 px-4 text-right">
                    {isReal ? "Today's Value (Real)" : 'Projected Balance'} (
                    {settings.currencyCode})
                  </th>
                  <th className="py-3 px-4 text-right">
                    {isReal ? 'Future Nominal' : "Today's Value (Real)"}
                  </th>
                  {targetCurrencyOpt && (
                    <th className="py-3 px-6 text-right">
                      Converted ({targetCurrencyOpt.code})
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {milestonePoints.map((pt) => {
                  const primaryBal = isReal
                    ? pt.realBalance
                    : pt.nominalBalance;
                  const secondaryBal = isReal
                    ? pt.nominalBalance
                    : pt.realBalance;
                  const contrib = isReal
                    ? pt.realContributions
                    : pt.totalContributions;
                  const interest = isReal
                    ? pt.realInterest
                    : pt.nominalInterest;
                  return (
                    <tr
                      key={pt.year}
                      className="hover:bg-teal-50/25 dark:hover:bg-teal-950/30 transition-colors"
                    >
                      <td className="py-3 px-6 font-semibold text-slate-900 dark:text-slate-100">
                        Year {pt.year}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {formatCurrency(contrib, sym, 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-teal-700 dark:text-teal-300 font-medium">
                        +{formatCurrency(interest, sym, 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(primaryBal, sym, 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        {formatCurrency(secondaryBal, sym, 0)}
                      </td>
                      {targetCurrencyOpt && (
                        <td className="py-3 px-6 text-right font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">
                          {formatConvertedCurrency(
                            primaryBal,
                            settings.exchangeRate,
                            targetCurrencyOpt.symbol,
                            targetCurrencyOpt.decimals
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
