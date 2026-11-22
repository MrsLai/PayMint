import { User } from 'firebase/auth';
import {
  ArrowRight,
  BookmarkPlus,
  Cloud,
  FolderOpen,
  LogOut,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { getCurrencyOption } from '../data/currencies';
import { CloudSyncStatus } from '../hooks/useWageStore';
import {
  InputFrequency,
  PaySettings,
  PeriodRateRow,
  SalaryBreakdown,
  SavedJobComparison,
} from '../types/wage';
import { formatConvertedCurrency, formatCurrency } from '../utils/format';
import {
  getRetirementTooltipCopy,
  getTaxTooltipCopy,
} from '../utils/regulationInfo';
import { resolveSalaryBreakdown } from '../utils/taxEngine';
import { getActiveAuthorityLabel } from '../utils/taxYearRules';
import { useI18n } from '../i18n';
import { CurrencyConverterBar } from './CurrencyConverterBar';
import { InfoTooltip } from './InfoTooltip';

interface PayriseCompareViewProps {
  settings: PaySettings;
  currentMode: InputFrequency;
  currentAmount: number;
  targetMode: InputFrequency;
  targetAmount: number;
  targetDriver: 'amount' | 'percent';
  targetRaisePct: number;
  savedComparisons: SavedJobComparison[];
  onChangeCurrentMode: (m: InputFrequency) => void;
  onChangeCurrentAmount: (amt: number) => void;
  onChangeTargetMode: (m: InputFrequency) => void;
  onChangeTargetAmount: (amt: number) => void;
  onChangeTargetDriver: (driver: 'amount' | 'percent') => void;
  onChangeTargetRaisePct: (pct: number) => void;
  onSaveComparison: (
    entry: Omit<SavedJobComparison, 'id' | 'savedAt'>
  ) => SavedJobComparison;
  onLoadComparison: (entry: SavedJobComparison) => void;
  onDeleteComparison: (id: string) => void;
  onClearSavedComparisons: () => void;
  onUpdateSettings: (patch: Partial<PaySettings>) => void;
  onAnnounce?: (message: string) => void;
  cloudSyncRequested: boolean;
  cloudUser: User | null;
  cloudSyncStatus: CloudSyncStatus;
  cloudSyncError: string | null;
  isSigningIn: boolean;
  onRequestCloudSync: (requested: boolean) => void;
  onSignInForCloudSync: () => Promise<User | null>;
  onSignOutCloudSync: () => Promise<void>;
  onSyncNow: () => Promise<boolean>;
}

const RAISE_PCT_PRESETS = [5, 10, 15, 20, 25];

const FREQ_OPTIONS: Array<{
  id: InputFrequency;
  period: PeriodRateRow['period'];
}> = [
  { id: 'hourly', period: 'Hourly' },
  { id: 'daily', period: 'Daily' },
  { id: 'weekly', period: 'Weekly' },
  { id: 'fortnightly', period: 'Fortnightly' },
  { id: 'monthly', period: 'Monthly' },
  { id: 'annual', period: 'Annual' },
];

function getConvertedInputForMode(
  breakdown: SalaryBreakdown,
  nextMode: InputFrequency,
  settings: PaySettings
): number {
  if (nextMode === 'annual') {
    const val =
      settings.superMode === 'included_in_package'
        ? breakdown.annualGrossPackage
        : breakdown.annualTaxableGross;
    return Math.round(val * 100) / 100;
  }
  if (nextMode === 'monthly') {
    const val =
      settings.superMode === 'included_in_package'
        ? breakdown.annualGrossPackage / 12
        : breakdown.monthlyGross;
    return Math.round(val * 100) / 100;
  }
  if (nextMode === 'fortnightly') {
    return Math.round(breakdown.fortnightlyGross * 100) / 100;
  }
  if (nextMode === 'weekly') {
    return Math.round(breakdown.weeklyGross * 100) / 100;
  }
  if (nextMode === 'daily') {
    return Math.round(breakdown.dailyGross * 100) / 100;
  }
  return Math.round(breakdown.baseHourlyRate * 100) / 100;
}

function computeTargetFromPct(
  currentBreakdown: SalaryBreakdown,
  targetMode: InputFrequency,
  settings: PaySettings,
  raisePct: number,
  decimals: number
): number {
  const baseInTargetMode = getConvertedInputForMode(
    currentBreakdown,
    targetMode,
    settings
  );
  const raw = baseInTargetMode * (1 + raisePct / 100);
  const factor = decimals === 0 ? 1 : 100;
  return Math.max(0, Math.round(raw * factor) / factor);
}

export function PayriseCompareView({
  settings,
  currentMode,
  currentAmount,
  targetMode,
  targetAmount,
  targetDriver,
  targetRaisePct,
  savedComparisons,
  onChangeCurrentMode,
  onChangeCurrentAmount,
  onChangeTargetMode,
  onChangeTargetAmount,
  onChangeTargetDriver,
  onChangeTargetRaisePct,
  onSaveComparison,
  onLoadComparison,
  onDeleteComparison,
  onClearSavedComparisons,
  onUpdateSettings,
  onAnnounce,
  cloudSyncRequested,
  cloudUser,
  cloudSyncStatus,
  cloudSyncError,
  isSigningIn,
  onRequestCloudSync,
  onSignInForCloudSync,
  onSignOutCloudSync,
  onSyncNow,
}: PayriseCompareViewProps) {
  const { languageOption, t } = useI18n();
  const [pctDraft, setPctDraft] = useState<string | null>(null);
  const [saveLabel, setSaveLabel] = useState<string>('');

  const sym = settings.currencySymbol;
  const baseDecimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const inputPadClass =
    sym.length >= 4 ? 'pl-14' : sym.length >= 2 ? 'pl-11' : 'pl-9';
  const targetCurrencyOpt = getCurrencyOption(settings.targetCurrency);
  const retirementTooltip = getRetirementTooltipCopy(settings);

  const currentBreakdown = useMemo(
    () => resolveSalaryBreakdown(settings, currentMode, currentAmount),
    [settings, currentMode, currentAmount]
  );

  const effectiveTargetAmount = useMemo(() => {
    if (targetDriver === 'percent') {
      if (currentAmount <= 0) return 0;
      return computeTargetFromPct(
        currentBreakdown,
        targetMode,
        settings,
        targetRaisePct,
        baseDecimals
      );
    }
    return targetAmount;
  }, [
    targetDriver,
    currentAmount,
    currentBreakdown,
    targetMode,
    settings,
    targetRaisePct,
    baseDecimals,
    targetAmount,
  ]);

  const targetBreakdown = useMemo(
    () => resolveSalaryBreakdown(settings, targetMode, effectiveTargetAmount),
    [settings, targetMode, effectiveTargetAmount]
  );

  const hasBoth = currentAmount > 0 && effectiveTargetAmount > 0;
  const grossAnnualDiff =
    targetBreakdown.annualTaxableGross - currentBreakdown.annualTaxableGross;
  const netAnnualDiff =
    targetBreakdown.annualNetPocket - currentBreakdown.annualNetPocket;
  const superAnnualDiff =
    targetBreakdown.annualSuper - currentBreakdown.annualSuper;
  const pctRaise =
    currentBreakdown.annualTaxableGross > 0
      ? (grossAnnualDiff / currentBreakdown.annualTaxableGross) * 100
      : 0;

  const targetHourlyRow = targetBreakdown.rows.find(
    (r) => r.period === 'Hourly'
  )!;
  const currentHourlyRow = currentBreakdown.rows.find(
    (r) => r.period === 'Hourly'
  )!;
  const targetMonthlyRow = targetBreakdown.rows.find(
    (r) => r.period === 'Monthly'
  )!;
  const currentMonthlyRow = currentBreakdown.rows.find(
    (r) => r.period === 'Monthly'
  )!;

  const hourlyNetDiff = targetHourlyRow.netPocket - currentHourlyRow.netPocket;
  const monthlyNetDiff =
    targetMonthlyRow.netPocket - currentMonthlyRow.netPocket;

  const handleSwitchMode = (
    side: 'current' | 'target',
    nextMode: InputFrequency
  ) => {
    if (side === 'current') {
      if (nextMode === currentMode) return;
      if (currentAmount > 0) {
        onChangeCurrentAmount(
          getConvertedInputForMode(currentBreakdown, nextMode, settings)
        );
      }
      onChangeCurrentMode(nextMode);
    } else {
      if (nextMode === targetMode) return;
      if (targetDriver === 'percent') {
        if (currentAmount > 0) {
          onChangeTargetAmount(
            computeTargetFromPct(
              currentBreakdown,
              nextMode,
              settings,
              targetRaisePct,
              baseDecimals
            )
          );
        }
      } else if (effectiveTargetAmount > 0) {
        onChangeTargetAmount(
          getConvertedInputForMode(targetBreakdown, nextMode, settings)
        );
      }
      onChangeTargetMode(nextMode);
    }
  };

  const handleApplyRaisePct = (pct: number) => {
    const clamped = Math.max(-99, Math.min(500, pct));
    onChangeTargetDriver('percent');
    onChangeTargetRaisePct(clamped);
    if (currentAmount > 0) {
      onChangeTargetAmount(
        computeTargetFromPct(
          currentBreakdown,
          targetMode,
          settings,
          clamped,
          baseDecimals
        )
      );
    }
  };

  const impliedPctRounded = Math.round(pctRaise * 10) / 10;
  const pctInputValue =
    pctDraft !== null
      ? pctDraft
      : targetDriver === 'percent'
        ? String(targetRaisePct)
        : hasBoth
          ? String(impliedPctRounded)
          : '';

  const canSaveComparison = currentAmount > 0 || effectiveTargetAmount > 0;

  const handleSaveCurrentComparison = () => {
    if (!canSaveComparison) return;
    const trimmed = saveLabel.trim();
    const fallbackName = `${settings.countryCode} · ${formatCurrency(
      currentAmount,
      sym,
      baseDecimals
    )} → ${formatCurrency(effectiveTargetAmount, sym, baseDecimals)}`;
    const finalName = trimmed || fallbackName;

    onSaveComparison({
      name: finalName,
      countryCode: settings.countryCode,
      currencyCode: settings.currencyCode,
      currencySymbol: settings.currencySymbol,
      currentMode,
      currentAmount,
      targetMode,
      targetAmount: effectiveTargetAmount,
      targetDriver,
      targetRaisePct,
    });
    setSaveLabel('');
    onAnnounce?.(t('notice.comparisonSaved', { name: finalName }));
  };

  const renderCardBreakdown = (
    breakdown: SalaryBreakdown,
    activeMode: InputFrequency,
    amount: number
  ) => {
    const hasVal = amount > 0;
    return (
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-1">
          <span className="col-span-4">Rate</span>
          <span className="col-span-4 text-right">Before Tax</span>
          <span className="col-span-4 text-right">Take-Home</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 overflow-hidden">
          {breakdown.rows.map((row) => {
            const matchedFreq = FREQ_OPTIONS.find(
              (f) => f.period === row.period
            );
            const isDriver = matchedFreq?.id === activeMode && hasVal;
            return (
              <div
                key={row.period}
                className={`grid grid-cols-12 items-center gap-1 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs font-mono tabular-nums ${
                  isDriver ? 'bg-teal-50/75 dark:bg-teal-950/50' : ''
                }`}
              >
                <span className="col-span-4 font-sans font-medium text-slate-700 dark:text-slate-200 truncate">
                  {t(`period.${row.period}`)}
                  {row.period === 'Daily' && (
                    <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500 ml-1">
                      ({settings.standardHoursPerDay}h)
                    </span>
                  )}
                </span>
                <span className="col-span-4 text-right text-slate-700 dark:text-slate-300 truncate">
                  {formatCurrency(row.gross, sym, baseDecimals)}
                </span>
                <span
                  className={`col-span-4 text-right font-semibold truncate ${
                    hasVal
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {formatCurrency(row.netPocket, sym, baseDecimals)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] font-mono tabular-nums px-1 pt-0.5 text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span>
              Tax -{formatCurrency(breakdown.annualTotalTax / 12, sym, baseDecimals)}/mo
            </span>
            <InfoTooltip {...getTaxTooltipCopy(settings, breakdown)} />
          </span>
          <span className="inline-flex items-center gap-1 text-sky-700 dark:text-sky-400 font-medium">
            <span>
              {settings.retirementLabel} ({settings.superRate}%): +
              {formatCurrency(breakdown.annualSuper, sym, 0)}/yr
            </span>
            <InfoTooltip {...retirementTooltip} />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
          {t('compare.heroTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          {t('compare.heroSubtitle', {
            currency: settings.currencyCode,
            authority: getActiveAuthorityLabel(settings),
          })}
        </p>
      </div>

      {/* Side-by-Side Inputs with Full 4-Period Auto-Calculation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Current Pay Card */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t('compare.currentPay')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('calc.beforeTaxGross')}
              </p>
            </div>
            {currentAmount > 0 && (
              <button
                type="button"
                onClick={() => onChangeCurrentAmount(0)}
                className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {FREQ_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleSwitchMode('current', f.id)}
                className={`py-1.5 px-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                  currentMode === f.id
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t(`period.${f.period}`)}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
              {sym}
            </span>
            <input
              id="compare-current-amount"
              type="number"
              min={0}
              step={currentMode === 'hourly' ? '0.5' : '500'}
              placeholder={`Enter current ${currentMode} amount (e.g. ${currentMode === 'annual' ? '100000' : '58'})`}
              aria-label="Current pay amount"
              value={currentAmount > 0 ? currentAmount : ''}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onChangeCurrentAmount(Number.isNaN(v) || v < 0 ? 0 : v);
              }}
              className={`w-full ${inputPadClass} pr-4 py-3 text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/25 dark:focus:ring-teal-400/25 focus:border-teal-600 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-800 transition-all`}
            />
          </div>

          {renderCardBreakdown(currentBreakdown, currentMode, currentAmount)}
        </section>

        {/* Target / New Offer Card */}
        <section className="bg-white dark:bg-slate-900 border border-teal-300/90 dark:border-teal-700/80 ring-1 ring-teal-500/10 dark:ring-teal-400/15 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-teal-900 dark:text-teal-200">
                {t('compare.targetOffer')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('calc.beforeTaxGross')}
              </p>
            </div>
            {(effectiveTargetAmount > 0 || targetDriver === 'percent') && (
              <button
                type="button"
                onClick={() => {
                  setPctDraft(null);
                  onChangeTargetDriver('amount');
                  onChangeTargetRaisePct(0);
                  onChangeTargetAmount(0);
                }}
                className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {FREQ_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleSwitchMode('target', f.id)}
                className={`py-1.5 px-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors whitespace-nowrap truncate cursor-pointer ${
                  targetMode === f.id
                    ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {t(`period.${f.period}`)}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
              {sym}
            </span>
            <input
              type="number"
              min={0}
              step={targetMode === 'hourly' ? '0.5' : '500'}
              placeholder={`Enter target ${targetMode} amount (e.g. ${targetMode === 'annual' ? '120000' : '70'})`}
              aria-label="Target pay amount"
              value={effectiveTargetAmount > 0 ? effectiveTargetAmount : ''}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setPctDraft(null);
                onChangeTargetDriver('amount');
                onChangeTargetAmount(Number.isNaN(v) || v < 0 ? 0 : v);
              }}
              className={`w-full ${inputPadClass} pr-4 py-3 text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/25 dark:focus:ring-teal-400/25 focus:border-teal-600 dark:focus:border-teal-400 focus:bg-white dark:focus:bg-slate-800 transition-all`}
            />
          </div>

          {/* Target Increase (%) Input & Quick Presets */}
          <div className="rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/80 p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="target-payrise-pct"
                className="text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {t('compare.targetIncreasePct')}
              </label>
              <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                {currentAmount <= 0
                  ? 'Enter Current Pay to apply %'
                  : targetDriver === 'percent'
                    ? `Synced at ${targetRaisePct >= 0 ? '+' : ''}${targetRaisePct}% over Current`
                    : hasBoth
                      ? `Implied ${pctRaise >= 0 ? '+' : ''}${pctRaise.toFixed(1)}% vs Current`
                      : 'Enter % or exact amount'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-24 sm:w-28 shrink-0">
                <input
                  id="target-payrise-pct"
                  type="number"
                  min={-99}
                  max={500}
                  step={0.5}
                  placeholder="0"
                  aria-label="Target payrise percentage"
                  value={pctInputValue}
                  onFocus={(e) => {
                    setPctDraft(pctInputValue);
                    e.currentTarget.select();
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setPctDraft(raw);
                    if (raw === '' || raw === '-' || raw === '.') return;
                    const parsed = parseFloat(raw);
                    if (!Number.isNaN(parsed)) {
                      handleApplyRaisePct(parsed);
                    }
                  }}
                  onBlur={() => {
                    if (pctDraft === '' || pctDraft === '-' || pctDraft === '.') {
                      if (targetDriver === 'percent') {
                        handleApplyRaisePct(0);
                      }
                    }
                    setPctDraft(null);
                  }}
                  className={`w-full px-3 pr-7 py-1.5 text-xs font-mono tabular-nums font-bold rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-600 dark:focus:border-teal-400 transition-all ${
                    targetDriver === 'percent'
                      ? 'bg-white dark:bg-slate-900 border-teal-400 dark:border-teal-500 text-teal-800 dark:text-teal-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                  }`}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                  %
                </span>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {RAISE_PCT_PRESETS.map((pct) => {
                  const isActivePreset =
                    targetDriver === 'percent' && targetRaisePct === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setPctDraft(null);
                        handleApplyRaisePct(pct);
                      }}
                      className={`px-2 py-1 text-[11px] font-mono font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isActivePreset
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300'
                      }`}
                    >
                      +{pct}%
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {renderCardBreakdown(
            targetBreakdown,
            targetMode,
            effectiveTargetAmount
          )}
        </section>
      </div>

      {/* Currency Exchange Converter */}
      <CurrencyConverterBar
        settings={settings}
        compareData={{
          currentBreakdown,
          targetBreakdown,
          hasCurrent: currentAmount > 0,
          hasTarget: effectiveTargetAmount > 0,
        }}
        onUpdateSettings={onUpdateSettings}
      />

      {/* Difference KPIs */}
      <section
        aria-label="Payrise Impact Summary"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Before-Tax Raise
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {hasBoth
              ? `${grossAnnualDiff >= 0 ? '+' : ''}${formatCurrency(grossAnnualDiff, sym, 0)}/yr`
              : '—'}
          </div>
          <div className="mt-1.5 text-xs font-mono tabular-nums text-teal-700 dark:text-teal-300 font-semibold">
            {hasBoth
              ? `${pctRaise >= 0 ? '+' : ''}${pctRaise.toFixed(1)}% change`
              : 'Enter both amounts'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('compare.netGainHourly')}
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {hasBoth
              ? `${hourlyNetDiff >= 0 ? '+' : ''}${formatCurrency(hourlyNetDiff, sym, baseDecimals)}`
              : '—'}
          </div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Net after tax & deductions
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {t('compare.netGainMonthly')}
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {hasBoth
              ? `${monthlyNetDiff >= 0 ? '+' : ''}${formatCurrency(monthlyNetDiff, sym, baseDecimals)}`
              : '—'}
          </div>
          <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            Added directly to pocket
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>
              {t('compare.netGainAnnual')} · {settings.retirementLabel}
            </span>
            <InfoTooltip {...retirementTooltip} />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
            {hasBoth
              ? `${netAnnualDiff >= 0 ? '+' : ''}${formatCurrency(netAnnualDiff, sym, 0)}`
              : '—'}
          </div>
          <div className="mt-1.5 text-xs font-mono tabular-nums text-sky-700 dark:text-sky-400 font-medium">
            {hasBoth
              ? `${superAnnualDiff >= 0 ? '+' : ''}${formatCurrency(superAnnualDiff, sym, 0)} ${settings.retirementLabel} (${settings.superRate}%)`
              : `${settings.retirementLabel} calculated automatically`}
          </div>
        </div>
      </section>

      {/* Saved Job-Offer Comparisons (localStorage + explicit opt-in Cloud Sync) */}
      <section
        aria-labelledby="saved-comparisons-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="saved-comparisons-heading"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                {t('compare.savedTitle')}
              </h2>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${
                  cloudUser && cloudSyncRequested
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/70'
                    : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/70 dark:border-teal-800/70'
                }`}
              >
                {cloudUser && cloudSyncRequested
                  ? cloudSyncStatus === 'syncing'
                    ? t('sync.syncing')
                    : t('sync.synced')
                  : t('compare.savedBadge')}
              </span>
              {!cloudSyncRequested && !cloudUser && (
                <button
                  type="button"
                  onClick={() => onRequestCloudSync(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50/70 dark:hover:bg-teal-950/50 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  <Cloud className="w-3 h-3" />
                  <span>{t('sync.askSyncBtn')}</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('compare.savedDesc')}
            </p>
          </div>

          {savedComparisons.length > 0 && (
            <button
              type="button"
              onClick={onClearSavedComparisons}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('compare.clearSavedBtn')}</span>
            </button>
          )}
        </div>

        {/* Inline Google Sign-In / Sync Bar — ONLY revealed when user explicitly asks to sync across devices */}
        {(cloudSyncRequested || cloudUser) && (
          <div className="space-y-2">
            {!cloudUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 px-3.5 py-2.5">
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {t('sync.freeNote')}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isSigningIn}
                    onClick={async () => {
                      const user = await onSignInForCloudSync();
                      if (user) {
                        onAnnounce?.(
                          t('notice.syncEnabled', {
                            name:
                              user.email ||
                              user.displayName ||
                              'Google account',
                          })
                        );
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <svg
                      className="w-3.5 h-3.5 shrink-0"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>
                      {isSigningIn
                        ? t('sync.signingIn')
                        : t('sync.signInGoogle')}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestCloudSync(false)}
                    aria-label={t('sync.localOnly')}
                    title={t('sync.localOnly')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-teal-50/45 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-800/70 px-3.5 py-2">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                  {t('sync.signedInAs', {
                    email:
                      cloudUser.email ||
                      cloudUser.displayName ||
                      'Google account',
                  })}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={cloudSyncStatus === 'syncing'}
                    onClick={async () => {
                      const ok = await onSyncNow();
                      if (ok) {
                        onAnnounce?.(t('notice.syncedNow'));
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${
                        cloudSyncStatus === 'syncing' ? 'animate-spin' : ''
                      }`}
                    />
                    <span>{t('sync.syncNow')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await onSignOutCloudSync();
                      onAnnounce?.(t('notice.syncDisabled'));
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>{t('sync.signOut')}</span>
                  </button>
                </div>
              </div>
            )}

            {cloudSyncError && (
              <div
                role="alert"
                className="rounded-xl border border-amber-300/80 dark:border-amber-700/80 bg-amber-50/80 dark:bg-amber-950/40 px-3 py-2 text-xs text-amber-900 dark:text-amber-200"
              >
                {cloudSyncError}
              </div>
            )}
          </div>
        )}

        {/* Save Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveCurrentComparison();
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
        >
          <input
            type="text"
            maxLength={64}
            value={saveLabel}
            onChange={(e) => setSaveLabel(e.target.value)}
            placeholder={t('compare.savePlaceholder')}
            aria-label={t('compare.savePlaceholder')}
            className="flex-1 min-w-0 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-600 dark:focus:border-teal-400"
          />
          <button
            type="submit"
            disabled={!canSaveComparison}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-200/80 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl shadow-xs disabled:shadow-none transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{t('compare.saveBtn')}</span>
          </button>
        </form>

        {/* Saved List */}
        {savedComparisons.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700/80 px-4 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
            {t('compare.savedEmpty')}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedComparisons.map((item) => {
              const itemDecimals =
                getCurrencyOption(item.currencyCode)?.decimals ?? 2;
              const isCurrentActive =
                item.countryCode === settings.countryCode &&
                item.currentMode === currentMode &&
                item.currentAmount === currentAmount &&
                item.targetMode === targetMode &&
                item.targetAmount === effectiveTargetAmount;
              const curPeriodFreq = FREQ_OPTIONS.find(
                (f) => f.id === item.currentMode
              );
              const tgtPeriodFreq = FREQ_OPTIONS.find(
                (f) => f.id === item.targetMode
              );
              const formattedDate = new Date(item.savedAt).toLocaleDateString(
                languageOption.code,
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              );

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3.5 flex flex-col justify-between gap-3 transition-colors ${
                    isCurrentActive
                      ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/35 dark:border-teal-600'
                      : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {item.countryCode} · {item.currencyCode}
                        </span>
                        <span>·</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteComparison(item.id)}
                      aria-label={`${t('compare.deleteBtn')} ${item.name}`}
                      title={t('compare.deleteBtn')}
                      className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
                    <div className="text-xs font-mono tabular-nums text-slate-700 dark:text-slate-200">
                      <span>
                        {formatCurrency(
                          item.currentAmount,
                          item.currencySymbol,
                          itemDecimals
                        )}
                        <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 ml-0.5">
                          /{curPeriodFreq ? t(`period.${curPeriodFreq.period}`) : item.currentMode}
                        </span>
                      </span>
                      <span className="mx-1.5 text-teal-600 dark:text-teal-400">
                        →
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(
                          item.targetAmount,
                          item.currencySymbol,
                          itemDecimals
                        )}
                        <span className="text-[10px] font-sans text-slate-400 dark:text-slate-500 ml-0.5">
                          /{tgtPeriodFreq ? t(`period.${tgtPeriodFreq.period}`) : item.targetMode}
                        </span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onLoadComparison(item);
                        onAnnounce?.(
                          t('notice.comparisonLoaded', { name: item.name })
                        );
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>{t('compare.loadBtn')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Side-by-Side Comparison Matrix */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Period-by-Period Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Hourly, Daily ({settings.standardHoursPerDay}h), Monthly, and Annual before-tax vs cash take-home comparison
          </p>
        </div>

        {/* Mobile Stacked Comparison Cards (< 768px) — zero horizontal overflow */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {currentBreakdown.rows.map((curRow, idx) => {
            const tgtRow = targetBreakdown.rows[idx];
            const netDiff = tgtRow.netPocket - curRow.netPocket;
            return (
              <div key={curRow.period} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {t(`period.${curRow.period}`)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Net Difference
                    </div>
                  </div>
                  <div className="text-right min-w-0">
                    <div
                      className={`text-base font-bold font-mono tabular-nums break-words ${
                        !hasBoth
                          ? 'text-slate-400 dark:text-slate-500'
                          : netDiff >= 0
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {hasBoth
                        ? `${netDiff >= 0 ? '+' : ''}${formatCurrency(netDiff, sym, baseDecimals)}`
                        : '—'}
                    </div>
                    {targetCurrencyOpt && (
                      <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 break-words">
                        {hasBoth
                          ? `${netDiff >= 0 ? '+' : ''}${formatConvertedCurrency(
                              netDiff,
                              settings.exchangeRate,
                              targetCurrencyOpt.symbol,
                              targetCurrencyOpt.decimals
                            )} ${targetCurrencyOpt.code}`
                          : '—'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 p-2.5 space-y-1.5 min-w-0">
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      Current
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        Gross
                      </div>
                      <div className="font-mono tabular-nums text-slate-600 dark:text-slate-300 break-words">
                        {formatCurrency(curRow.gross, sym, baseDecimals)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        Take-Home
                      </div>
                      <div className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-100 break-words">
                        {formatCurrency(curRow.netPocket, sym, baseDecimals)}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-teal-50/55 dark:bg-teal-950/45 p-2.5 space-y-1.5 min-w-0">
                    <div className="text-[11px] font-semibold text-teal-800 dark:text-teal-300">
                      Target
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Gross
                      </div>
                      <div className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100 break-words">
                        {formatCurrency(tgtRow.gross, sym, baseDecimals)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Take-Home
                      </div>
                      <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100 break-words">
                        {formatCurrency(tgtRow.netPocket, sym, baseDecimals)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet & Desktop Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/70 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-5">{t('calc.colPeriod')}</th>
                <th className="py-3 px-4 text-right">Current Gross</th>
                <th className="py-3 px-4 text-right">Target Gross</th>
                <th className="py-3 px-4 text-right">Current Take-Home</th>
                <th className="py-3 px-4 text-right">Target Take-Home</th>
                <th className="py-3 px-5 text-right">Net Difference</th>
                {targetCurrencyOpt && (
                  <th className="py-3 px-5 text-right">
                    Converted Gain ({targetCurrencyOpt.code})
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {currentBreakdown.rows.map((curRow, idx) => {
                const tgtRow = targetBreakdown.rows[idx];
                const netDiff = tgtRow.netPocket - curRow.netPocket;
                return (
                  <tr
                    key={curRow.period}
                    className="hover:bg-teal-50/25 dark:hover:bg-teal-950/30 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-slate-100">
                      {t(`period.${curRow.period}`)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                      {formatCurrency(curRow.gross, sym, baseDecimals)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-teal-400" />
                        {formatCurrency(tgtRow.gross, sym, baseDecimals)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {formatCurrency(curRow.netPocket, sym, baseDecimals)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(tgtRow.netPocket, sym, baseDecimals)}
                    </td>
                    <td
                      className={`py-3.5 px-5 text-right font-mono tabular-nums font-bold ${
                        !hasBoth
                          ? 'text-slate-400 dark:text-slate-500'
                          : netDiff >= 0
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {hasBoth
                        ? `${netDiff >= 0 ? '+' : ''}${formatCurrency(netDiff, sym, baseDecimals)}`
                        : '—'}
                    </td>
                    {targetCurrencyOpt && (
                      <td className="py-3.5 px-5 text-right font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">
                        {hasBoth
                          ? `${netDiff >= 0 ? '+' : ''}${formatConvertedCurrency(
                              netDiff,
                              settings.exchangeRate,
                              targetCurrencyOpt.symbol,
                              targetCurrencyOpt.decimals
                            )}`
                          : '—'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
