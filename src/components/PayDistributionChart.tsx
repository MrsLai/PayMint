import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getCurrencyOption } from '../data/currencies';
import {
  InputFrequency,
  PaySettings,
  PeriodRateRow,
  SalaryBreakdown,
} from '../types/wage';
import { formatConvertedCurrency, formatCurrency } from '../utils/format';
import {
  getLevyTooltipCopy,
  getRetirementTooltipCopy,
  getTaxTooltipCopy,
} from '../utils/regulationInfo';
import { ThemeMode } from '../data/themePresets';
import { TranslationKey, useI18n } from '../i18n';
import { InfoTooltip } from './InfoTooltip';

interface PayDistributionChartProps {
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  isDark: boolean;
  themeMode?: ThemeMode;
}

interface SliceItem {
  key: string;
  name: string;
  amount: number;
  pct: number;
  color: string;
  dotClass: string;
  textClass: string;
  detail: string;
}

const PERIOD_OPTIONS: Array<{
  mode: InputFrequency;
  labelKey: TranslationKey;
  periodName: PeriodRateRow['period'];
}> = [
  { mode: 'annual', labelKey: 'period.Annual', periodName: 'Annual' },
  { mode: 'monthly', labelKey: 'period.Monthly', periodName: 'Monthly' },
  {
    mode: 'fortnightly',
    labelKey: 'period.Fortnightly',
    periodName: 'Fortnightly',
  },
  { mode: 'weekly', labelKey: 'period.Weekly', periodName: 'Weekly' },
  { mode: 'daily', labelKey: 'period.Daily', periodName: 'Daily' },
  { mode: 'hourly', labelKey: 'period.Hourly', periodName: 'Hourly' },
];

interface DonutTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: SliceItem }>;
  sym: string;
  decimals: number;
  targetCurrency: ReturnType<typeof getCurrencyOption>;
  exchangeRate: number;
}

function DonutTooltip({
  active,
  payload,
  sym,
  decimals,
  targetCurrency,
  exchangeRate,
}: DonutTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-lg text-xs space-y-1">
      <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
        <span
          className="w-2.5 h-2.5 rounded-xs shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span>{item.name}</span>
      </div>
      <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
        {formatCurrency(item.amount, sym, decimals)}{' '}
        <span className="font-normal text-slate-500 dark:text-slate-400">
          ({item.pct.toFixed(1)}%)
        </span>
      </div>
      {targetCurrency && (
        <div className="font-mono tabular-nums font-semibold text-teal-700 dark:text-teal-300">
          {formatConvertedCurrency(
            item.amount,
            exchangeRate,
            targetCurrency.symbol,
            targetCurrency.decimals
          )}{' '}
          {targetCurrency.code}
        </div>
      )}
    </div>
  );
}

export function PayDistributionChart({
  settings,
  breakdown,
  isDark,
  themeMode = isDark ? 'dark' : 'light',
}: PayDistributionChartProps) {
  const { t } = useI18n();
  const isMidnight = themeMode === 'midnight';
  const [chartPeriod, setChartPeriod] = useState<InputFrequency>('annual');

  const sym = settings.currencySymbol;
  const baseDecimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const targetCurrencyOpt = getCurrencyOption(settings.targetCurrency);
  const hasAmount = settings.inputAmount > 0;
  const taxTooltip = getTaxTooltipCopy(settings, breakdown);
  const levyTooltip = getLevyTooltipCopy(settings);
  const retirementTooltip = getRetirementTooltipCopy(settings);

  const activePeriodMeta =
    PERIOD_OPTIONS.find((p) => p.mode === chartPeriod) ?? PERIOD_OPTIONS[0];

  const periodFactor = useMemo(() => {
    const annualRow = breakdown.rows.find((r) => r.period === 'Annual');
    const selectedRow = breakdown.rows.find(
      (r) => r.period === activePeriodMeta.periodName
    );
    if (!annualRow || !selectedRow || annualRow.gross <= 0) return 1;
    return selectedRow.gross / annualRow.gross;
  }, [breakdown.rows, activePeriodMeta.periodName]);

  const { slices, totalPackagePeriod, takeHomeSharePct } = useMemo(() => {
    const net = Math.max(0, breakdown.annualNetPocket * periodFactor);
    const incomeTax = Math.max(0, breakdown.annualPaygTax * periodFactor);
    const leviesAndHecs = Math.max(
      0,
      (breakdown.annualMedicareLevy +
        breakdown.annualMedicareSurcharge +
        breakdown.annualHecsRepayment) *
        periodFactor
    );
    const phiOther = Math.max(
      0,
      (breakdown.annualPhi + breakdown.annualOtherDeductions) * periodFactor
    );
    const retirement = Math.max(0, breakdown.annualSuper * periodFactor);

    const total = net + incomeTax + leviesAndHecs + phiOther + retirement;
    const denom = total > 0 ? total : 1;

    const rawSlices: SliceItem[] = [
      {
        key: 'net',
        name: t('calc.cashTakeHome'),
        amount: net,
        pct: total > 0 ? (net / denom) * 100 : 0,
        color: isMidnight ? '#34d399' : isDark ? '#10b981' : '#059669',
        dotClass: 'bg-emerald-600 dark:bg-emerald-500',
        textClass: 'text-emerald-700 dark:text-emerald-400',
        detail: 'Spendable & saveable net pay',
      },
      {
        key: 'income_tax',
        name: t('chart.incomeTax'),
        amount: incomeTax,
        pct: total > 0 ? (incomeTax / denom) * 100 : 0,
        color: isMidnight ? '#e2e8f0' : isDark ? '#94a3b8' : '#334155',
        dotClass: 'bg-slate-700 dark:bg-slate-400',
        textClass: 'text-slate-800 dark:text-slate-200',
        detail: `${settings.countryCode} progressive/flat scale`,
      },
      {
        key: 'levies',
        name:
          breakdown.annualHecsRepayment > 0
            ? `${settings.levyLabel} & HECS`
            : settings.levyLabel,
        amount: leviesAndHecs,
        pct: total > 0 ? (leviesAndHecs / denom) * 100 : 0,
        color: isMidnight ? '#cbd5e1' : isDark ? '#cbd5e1' : '#64748b',
        dotClass: 'bg-slate-500 dark:bg-slate-300',
        textClass: 'text-slate-700 dark:text-slate-300',
        detail:
          breakdown.annualHecsRepayment > 0
            ? 'Statutory levies & student loan'
            : 'Social, health or statutory levy',
      },
      {
        key: 'retirement',
        name: settings.retirementLabel,
        amount: retirement,
        pct: total > 0 ? (retirement / denom) * 100 : 0,
        color: isMidnight ? '#38bdf8' : isDark ? '#38bdf8' : '#0284c7',
        dotClass: 'bg-sky-600 dark:bg-sky-400',
        textClass: 'text-sky-700 dark:text-sky-400',
        detail:
          settings.superMode === 'employer_paid'
            ? `${settings.superRate}% paid on top`
            : `${settings.superRate}% included in package`,
      },
      {
        key: 'phi_other',
        name: 'Private Health & Other',
        amount: phiOther,
        pct: total > 0 ? (phiOther / denom) * 100 : 0,
        color: isMidnight ? '#fde047' : isDark ? '#fbbf24' : '#d97706',
        dotClass: 'bg-amber-600 dark:bg-amber-400',
        textClass: 'text-amber-700 dark:text-amber-400',
        detail: 'Optional post-tax deductions',
      },
    ];

    const visibleSlices = rawSlices.filter(
      (s) => s.key === 'net' || s.key === 'income_tax' || s.amount > 0.005
    );

    return {
      slices: visibleSlices,
      totalPackagePeriod: total,
      takeHomeSharePct: total > 0 ? (net / total) * 100 : 0,
    };
  }, [breakdown, periodFactor, settings, isDark, isMidnight]);

  const chartData = hasAmount
    ? slices.filter((s) => s.amount > 0)
    : [
        {
          key: 'empty',
          name: 'No Data',
          amount: 1,
          pct: 0,
          color: isMidnight ? '#272b38' : isDark ? '#1e293b' : '#e2e8f0',
          dotClass: 'bg-slate-200 dark:bg-slate-700',
          textClass: 'text-slate-400 dark:text-slate-500',
          detail: '',
        },
      ];

  return (
    <section
      aria-label="Pay and Tax Proportion Breakdown"
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.45)] space-y-5 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {t('chart.title')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('chart.subtitle', {
              period: t(activePeriodMeta.labelKey).toLowerCase(),
              currency: settings.currencyCode,
              label: settings.retirementLabel,
            })}
          </p>
        </div>

        <div
          className="inline-flex flex-wrap p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto shrink-0"
          role="group"
          aria-label="Proportion chart period"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              onClick={() => setChartPeriod(opt.mode)}
              className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                chartPeriod === opt.mode
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {!hasAmount ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 py-10 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('chart.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Recharts Donut Chart */}
          <div className="lg:col-span-5 relative h-[240px] sm:h-[260px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={chartData.length > 1 ? 2 : 0}
                  stroke={
                    isMidnight ? '#090a0f' : isDark ? '#0f172a' : '#ffffff'
                  }
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => (
                    <DonutTooltip
                      active={props.active}
                      payload={
                        props.payload as ReadonlyArray<{ payload?: SliceItem }>
                      }
                      sym={sym}
                      decimals={baseDecimals}
                      targetCurrency={targetCurrencyOpt}
                      exchangeRate={settings.exchangeRate}
                    />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered KPI inside Donut Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8 text-center">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Cash Take-Home
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400 mt-0.5">
                {takeHomeSharePct.toFixed(1)}%
              </span>
              <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                of {formatCurrency(totalPackagePeriod, sym, baseDecimals)}
              </span>
            </div>
          </div>

          {/* Itemized Proportion Bars */}
          <div className="lg:col-span-7 space-y-3.5 min-w-0">
            {slices.map((slice) => {
              const tooltipCopy =
                slice.key === 'income_tax'
                  ? taxTooltip
                  : slice.key === 'levies'
                    ? levyTooltip
                    : slice.key === 'retirement'
                      ? retirementTooltip
                      : null;
              return (
                <div key={slice.key} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2.5 h-2.5 rounded-xs shrink-0 ${slice.dotClass}`}
                      />
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {slice.name}
                      </span>
                      {tooltipCopy && <InfoTooltip {...tooltipCopy} />}
                      <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        · {slice.detail}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 shrink-0 font-mono tabular-nums">
                      <span className={`font-bold ${slice.textClass}`}>
                        {formatCurrency(slice.amount, sym, baseDecimals)}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 w-12 text-right">
                        {slice.pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${Math.max(slice.amount > 0 ? 1.5 : 0, Math.min(100, slice.pct))}%`,
                        backgroundColor: slice.color,
                      }}
                    />
                  </div>

                  {targetCurrencyOpt && slice.amount > 0 && (
                    <div className="text-[11px] font-mono tabular-nums text-teal-700 dark:text-teal-300 text-right">
                      {formatConvertedCurrency(
                        slice.amount,
                        settings.exchangeRate,
                        targetCurrencyOpt.symbol,
                        targetCurrencyOpt.decimals
                      )}{' '}
                      {targetCurrencyOpt.code}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
              <span>
                {t('chart.totalPackage', {
                  period: t(activePeriodMeta.labelKey),
                  label: settings.retirementLabel,
                })}
              </span>
              <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(totalPackagePeriod, sym, baseDecimals)}
                {targetCurrencyOpt && (
                  <span className="ml-2 text-teal-700 dark:text-teal-300 font-semibold">
                    (
                    {formatConvertedCurrency(
                      totalPackagePeriod,
                      settings.exchangeRate,
                      targetCurrencyOpt.symbol,
                      targetCurrencyOpt.decimals
                    )}{' '}
                    {targetCurrencyOpt.code})
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
