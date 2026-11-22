import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getCurrencyOption } from '../data/currencies';
import {
  AccentColorId,
  getAccentPreset,
  ThemeMode,
} from '../data/themePresets';
import { RetirementYearPoint } from '../utils/retirementEngine';
import {
  formatCompactCurrency,
  formatConvertedCurrency,
  formatCurrency,
} from '../utils/format';

interface RetirementGrowthChartProps {
  points: RetirementYearPoint[];
  years: number;
  isReal: boolean;
  hasInputs: boolean;
  isDark: boolean;
  themeMode?: ThemeMode;
  accentColor?: AccentColorId;
  sym: string;
  currencyCode: string;
  retirementLabel: string;
  targetCurrency: string;
  exchangeRate: number;
  inspectedYear: number;
  onInspectYear: (year: number) => void;
}

interface ChartDatum {
  year: number;
  yearLabel: string;
  totalBalance: number;
  contributions: number;
  interest: number;
  annualPersonal: number;
  annualEmployer: number;
  annualInterestGain: number;
}

interface GrowthTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ChartDatum }>;
  chartMode: 'cumulative' | 'annual';
  sym: string;
  targetCurrencyOpt: ReturnType<typeof getCurrencyOption>;
  exchangeRate: number;
  retirementLabel: string;
}

function RetirementTooltip({
  active,
  payload,
  chartMode,
  sym,
  targetCurrencyOpt,
  exchangeRate,
  retirementLabel,
}: GrowthTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-lg text-xs space-y-1.5 min-w-[200px]">
      <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-1">
        Year {d.year}
      </div>

      {chartMode === 'cumulative' ? (
        <>
          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
            <span className="text-slate-600 dark:text-slate-300 font-sans">
              Projected Wealth
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(d.totalBalance, sym, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
            <span className="text-slate-500 dark:text-slate-400 font-sans">
              Contributions
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {formatCurrency(d.contributions, sym, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
            <span className="text-teal-700 dark:text-teal-300 font-sans">
              Compound Interest
            </span>
            <span className="font-semibold text-teal-700 dark:text-teal-300">
              +{formatCurrency(d.interest, sym, 0)}
            </span>
          </div>
          {targetCurrencyOpt && (
            <div className="pt-1 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4 font-mono tabular-nums text-teal-700 dark:text-teal-300">
              <span className="font-sans font-medium">
                {targetCurrencyOpt.code}
              </span>
              <span className="font-bold">
                {formatConvertedCurrency(
                  d.totalBalance,
                  exchangeRate,
                  targetCurrencyOpt.symbol,
                  targetCurrencyOpt.decimals
                )}
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
            <span className="text-slate-600 dark:text-slate-300 font-sans">
              Personal Added
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              +{formatCurrency(d.annualPersonal, sym, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
            <span className="text-sky-700 dark:text-sky-400 font-sans truncate max-w-[110px]">
              {retirementLabel}
            </span>
            <span className="font-semibold text-sky-700 dark:text-sky-400">
              +{formatCurrency(d.annualEmployer, sym, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
            <span className="text-teal-700 dark:text-teal-300 font-sans">
              Interest That Year
            </span>
            <span className="font-bold text-teal-700 dark:text-teal-300">
              +{formatCurrency(d.annualInterestGain, sym, 0)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export function RetirementGrowthChart({
  points,
  years,
  isReal,
  hasInputs,
  isDark,
  themeMode = isDark ? 'dark' : 'light',
  accentColor = 'teal',
  sym,
  currencyCode,
  retirementLabel,
  targetCurrency,
  exchangeRate,
  inspectedYear,
  onInspectYear,
}: RetirementGrowthChartProps) {
  const [chartMode, setChartMode] = useState<'cumulative' | 'annual'>(
    'cumulative'
  );
  const targetCurrencyOpt = getCurrencyOption(targetCurrency);
  const accentPreset = getAccentPreset(accentColor);
  const isMidnight = themeMode === 'midnight';
  const activeAccentChartHex = isMidnight
    ? accentPreset.midnightChartHex
    : isDark
      ? accentPreset.darkChartHex
      : accentPreset.lightChartHex;

  const chartColors = {
    grid: isMidnight ? '#272b38' : isDark ? '#1e293b' : '#e2e8f0',
    axisLine: isMidnight ? '#525b73' : isDark ? '#334155' : '#cbd5e1',
    tick: isMidnight ? '#e2e8f0' : isDark ? '#94a3b8' : '#64748b',
    contribStroke: isMidnight ? '#cbd5e1' : isDark ? '#94a3b8' : '#64748b',
    interestStroke: activeAccentChartHex,
    interestStop: activeAccentChartHex,
    employerBar: isDark ? '#38bdf8' : '#0284c7',
    refLine: activeAccentChartHex,
  };

  const chartData = useMemo<ChartDatum[]>(() => {
    return points.map((pt, idx) => {
      const prev = idx > 0 ? points[idx - 1] : null;
      const totalBalance = isReal ? pt.realBalance : pt.nominalBalance;
      const contributions = isReal
        ? pt.realContributions
        : pt.totalContributions;
      const interest = isReal ? pt.realInterest : pt.nominalInterest;

      const prevInterest = prev
        ? isReal
          ? prev.realInterest
          : prev.nominalInterest
        : 0;
      const prevPersonal = prev ? prev.personalAdded : 0;
      const prevEmployer = prev ? prev.employerAdded : 0;

      const discountFactor =
        prev && isReal && pt.nominalBalance > 0
          ? pt.realBalance / pt.nominalBalance
          : 1;

      const annualPersonal = Math.max(
        0,
        (pt.personalAdded - prevPersonal) * discountFactor
      );
      const annualEmployer = Math.max(
        0,
        (pt.employerAdded - prevEmployer) * discountFactor
      );
      const annualInterestGain = Math.max(0, interest - prevInterest);

      return {
        year: pt.year,
        yearLabel: `Yr ${pt.year}`,
        totalBalance,
        contributions,
        interest,
        annualPersonal,
        annualEmployer,
        annualInterestGain,
      };
    });
  }, [points, isReal]);

  const annualChartData = useMemo(
    () => chartData.filter((d) => d.year > 0),
    [chartData]
  );

  const activeDatum =
    chartData[Math.max(0, Math.min(chartData.length - 1, inspectedYear))] ??
    chartData[chartData.length - 1];

  return (
    <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 space-y-4">
      {/* Header + Mode Switcher + Inspected Year Readout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0"
            role="group"
            aria-label="Retirement chart view"
          >
            <button
              type="button"
              onClick={() => setChartMode('cumulative')}
              className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                chartMode === 'cumulative'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Cumulative Wealth
            </button>
            <button
              type="button"
              onClick={() => setChartMode('annual')}
              className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                chartMode === 'annual'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Annual Growth Mix
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
            {chartMode === 'cumulative' ? (
              <>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-500 dark:bg-slate-400 shrink-0" />
                  Total Contributions
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 dark:bg-teal-400 shrink-0" />
                  Compound Interest
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-500 dark:bg-slate-400 shrink-0" />
                  Personal Saved/yr
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-sky-600 dark:bg-sky-400 shrink-0" />
                  {retirementLabel}/yr
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 dark:bg-teal-400 shrink-0" />
                  Interest/yr
                </span>
              </>
            )}
          </div>
        </div>

        {activeDatum && (
          <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              Year {activeDatum.year}:
            </span>{' '}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(activeDatum.totalBalance, sym, 0)}
            </span>{' '}
            <span className="text-slate-400 dark:text-slate-500">
              (Contrib. {formatCurrency(activeDatum.contributions, sym, 0)} +
              Interest{' '}
              <span className="text-teal-700 dark:text-teal-300 font-semibold">
                {formatCurrency(activeDatum.interest, sym, 0)}
              </span>
              )
            </span>
          </div>
        )}
      </div>

      {!hasInputs ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 py-10 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          Enter your salary in Calculator or enter Current Net Savings above to
          visualize your compound growth trajectory over {years} years (
          {currencyCode}).
        </div>
      ) : (
        <div className="space-y-3">
          <div className="h-[260px] sm:h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              {chartMode === 'cumulative' ? (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 12, left: 4, bottom: 4 }}
                  onClick={(state) => {
                    const idx =
                      typeof state?.activeTooltipIndex === 'number'
                        ? state.activeTooltipIndex
                        : null;
                    if (idx !== null && chartData[idx]) {
                      onInspectYear(chartData[idx].year);
                    }
                  }}
                >
                  <defs>
                    <linearGradient
                      id="paymintInterestFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColors.interestStop}
                        stopOpacity={isDark ? 0.44 : 0.38}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColors.interestStop}
                        stopOpacity={isDark ? 0.08 : 0.08}
                      />
                    </linearGradient>
                    <linearGradient
                      id="paymintContribFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColors.contribStroke}
                        stopOpacity={isDark ? 0.34 : 0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartColors.contribStroke}
                        stopOpacity={0.06}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                  />
                  <XAxis
                    dataKey="yearLabel"
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                    tickLine={false}
                    axisLine={{ stroke: chartColors.axisLine }}
                    minTickGap={24}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatCompactCurrency(v, sym)}
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={68}
                  />
                  <Tooltip
                    content={(props) => (
                      <RetirementTooltip
                        active={props.active}
                        payload={
                          props.payload as ReadonlyArray<{
                            payload?: ChartDatum;
                          }>
                        }
                        chartMode="cumulative"
                        sym={sym}
                        targetCurrencyOpt={targetCurrencyOpt}
                        exchangeRate={exchangeRate}
                        retirementLabel={retirementLabel}
                      />
                    )}
                  />
                  <ReferenceLine
                    x={`Yr ${inspectedYear}`}
                    stroke={chartColors.refLine}
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    stackId="wealth"
                    name="Total Contributions"
                    stroke={chartColors.contribStroke}
                    strokeWidth={1.75}
                    fill="url(#paymintContribFill)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stackId="wealth"
                    name="Compound Interest"
                    stroke={chartColors.interestStroke}
                    strokeWidth={2.5}
                    fill="url(#paymintInterestFill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={annualChartData}
                  margin={{ top: 10, right: 12, left: 4, bottom: 4 }}
                  onClick={(state) => {
                    const idx =
                      typeof state?.activeTooltipIndex === 'number'
                        ? state.activeTooltipIndex
                        : null;
                    if (idx !== null && annualChartData[idx]) {
                      onInspectYear(annualChartData[idx].year);
                    }
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartColors.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="yearLabel"
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                    tickLine={false}
                    axisLine={{ stroke: chartColors.axisLine }}
                    minTickGap={24}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatCompactCurrency(v, sym)}
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={68}
                  />
                  <Tooltip
                    content={(props) => (
                      <RetirementTooltip
                        active={props.active}
                        payload={
                          props.payload as ReadonlyArray<{
                            payload?: ChartDatum;
                          }>
                        }
                        chartMode="annual"
                        sym={sym}
                        targetCurrencyOpt={targetCurrencyOpt}
                        exchangeRate={exchangeRate}
                        retirementLabel={retirementLabel}
                      />
                    )}
                  />
                  <Bar
                    dataKey="annualPersonal"
                    stackId="annual"
                    name="Personal Saved/yr"
                    fill={chartColors.contribStroke}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="annualEmployer"
                    stackId="annual"
                    name={`${retirementLabel}/yr`}
                    fill={chartColors.employerBar}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="annualInterestGain"
                    stackId="annual"
                    name="Interest/yr"
                    fill={chartColors.interestStop}
                    radius={[3, 3, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
              Inspect Year:
            </span>
            <input
              type="range"
              min={0}
              max={years}
              value={inspectedYear}
              aria-label="Inspect projection year"
              onChange={(e) => onInspectYear(Number(e.target.value))}
              className="w-full accent-teal-600 dark:accent-teal-400 cursor-pointer"
            />
            <span className="text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-300 shrink-0 w-10 text-right">
              Yr {inspectedYear}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
