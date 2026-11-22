import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  Download,
  FileSpreadsheet,
  PiggyBank,
  Printer,
} from 'lucide-react';
import { useState } from 'react';
import {
  ENABLE_NOVATED_LEASE_PANEL,
  ENABLE_SUPER_ETF_CALLOUT,
  ENABLE_TAX_EXPORT_MODAL,
} from '../data/affiliatePartners';
import { COUNTRY_PRESETS, getCountryPreset } from '../data/countryPresets';
import { getCurrencyOption } from '../data/currencies';
import {
  CasualPenaltyMethod,
  CountryCode,
  EmploymentType,
  InputFrequency,
  PaySettings,
  PeriodRateRow,
  SalaryBreakdown,
} from '../types/wage';
import { downloadSalaryCsv } from '../utils/exportSalary';
import { formatConvertedCurrency, formatCurrency } from '../utils/format';
import {
  getLevyTooltipCopy,
  getRetirementTooltipCopy,
  getTaxTooltipCopy,
} from '../utils/regulationInfo';
import {
  getActiveAuthorityLabel,
  getLatestCountryRules,
} from '../utils/taxYearRules';
import { ThemeMode } from '../data/themePresets';
import { useI18n } from '../i18n';
import { CurrencyConverterBar } from './CurrencyConverterBar';
import { InfoTooltip } from './InfoTooltip';
import { NovatedLeasePanel } from './NovatedLeasePanel';
import { PayDistributionChart } from './PayDistributionChart';
import { PdfReportModal } from './PdfReportModal';
import { PrintableSalaryReport } from './PrintableSalaryReport';
import { SuperEtfCallout } from './SuperEtfCallout';
import { TaxSoftwareModal } from './TaxSoftwareModal';

interface CalculatorViewProps {
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  isDark: boolean;
  themeMode?: ThemeMode;
  onUpdateSettings: (patch: Partial<PaySettings>) => void;
  onSelectCountry: (code: CountryCode) => void;
  onSyncLatestRules: () => void;
  onOpenCompare: () => void;
  onOpenRetirement: () => void;
  onStartTutorial?: () => void;
  onAnnounce?: (message: string) => void;
}

const PERIOD_CARDS: Array<{
  mode: InputFrequency;
  period: PeriodRateRow['period'];
  step: string;
}> = [
  { mode: 'hourly', period: 'Hourly', step: '0.5' },
  { mode: 'daily', period: 'Daily', step: '10' },
  { mode: 'weekly', period: 'Weekly', step: '50' },
  { mode: 'fortnightly', period: 'Fortnightly', step: '100' },
  { mode: 'monthly', period: 'Monthly', step: '100' },
  { mode: 'annual', period: 'Annual', step: '1000' },
];

function formatInputDisplay(
  value: number,
  mode: InputFrequency,
  decimals = 2
): string {
  if (value <= 0) return '';
  if (decimals === 0) {
    return String(Math.round(value));
  }
  if (mode === 'annual') return String(Math.round(value * 100) / 100);
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function CalculatorView({
  settings,
  breakdown,
  isDark,
  themeMode,
  onUpdateSettings,
  onSelectCountry,
  onSyncLatestRules,
  onOpenCompare,
  onOpenRetirement,
  onStartTutorial,
  onAnnounce,
}: CalculatorViewProps) {
  const { t } = useI18n();
  const [focusedMode, setFocusedMode] = useState<InputFrequency | null>(null);
  const [draftText, setDraftText] = useState<string>('');
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  const hasAnyShiftOrOvertime =
    settings.saturdayHoursWeekly > 0 ||
    settings.sundayHoursWeekly > 0 ||
    settings.publicHolidayHoursWeekly > 0 ||
    settings.overtimeHoursWeekly > 0;
  const [isShiftsOpen, setIsShiftsOpen] = useState(hasAnyShiftOrOvertime);

  const sym = settings.currencySymbol;
  const baseDecimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const inputPadClass =
    sym.length >= 4 ? 'pl-12' : sym.length >= 2 ? 'pl-9' : 'pl-7';
  const hasAmount = settings.inputAmount > 0;
  const targetCurrencyOpt = getCurrencyOption(settings.targetCurrency);
  const countryPreset = getCountryPreset(settings.countryCode);
  const latestRules = getLatestCountryRules(settings.countryCode);
  const activeAuthorityLabel = getActiveAuthorityLabel(settings);
  const retirementTooltip = getRetirementTooltipCopy(settings);
  const taxTooltip = getTaxTooltipCopy(settings, breakdown);
  const levyTooltip = getLevyTooltipCopy(settings);

  const grossBase = Math.max(1, breakdown.annualTaxableGross);
  const netPct = hasAmount
    ? Math.max(0, Math.min(100, (breakdown.annualNetPocket / grossBase) * 100))
    : 0;
  const taxPct = hasAmount
    ? Math.max(
        0,
        Math.min(100 - netPct, (breakdown.annualTotalTax / grossBase) * 100)
      )
    : 0;
  const phiOtherPct = hasAmount
    ? Math.max(
        0,
        Math.min(
          100 - netPct - taxPct,
          ((breakdown.annualPhi + breakdown.annualOtherDeductions) / grossBase) *
            100
        )
      )
    : 0;

  const handleCardInputFocus = (
    mode: InputFrequency,
    currentCardGross: number
  ) => {
    setFocusedMode(mode);
    setDraftText(
      settings.inputMode === mode
        ? settings.inputAmount > 0
          ? String(settings.inputAmount)
          : ''
        : formatInputDisplay(currentCardGross, mode, baseDecimals)
    );
  };

  const handleCardInputChange = (mode: InputFrequency, raw: string) => {
    setDraftText(raw);
    const parsed = parseFloat(raw);
    onUpdateSettings({
      inputMode: mode,
      inputAmount: Number.isNaN(parsed) || parsed < 0 ? 0 : parsed,
    });
  };

  const handleCardInputBlur = () => {
    setFocusedMode(null);
  };

  const handleDownloadCsv = () => {
    if (!hasAmount) return;
    const filename = downloadSalaryCsv(settings, breakdown);
    onAnnounce?.(`Downloaded ${filename}`);
  };

  const handlePrintPdf = () => {
    if (!hasAmount) return;
    setIsPdfPreviewOpen(true);
  };

  return (
    <>
      <div className="space-y-6 no-print">
        {/* Hero Title + Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
              {t('calc.heroTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              {countryPreset.name} ({settings.currencyCode}) · {activeAuthorityLabel} · {settings.superRate}% {settings.retirementLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {onStartTutorial && (
              <button
                type="button"
                onClick={onStartTutorial}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-500 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{t('calc.quickTour')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenRetirement}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <PiggyBank className="w-4 h-4" />
              <span>{t('calc.retirementBtn')}</span>
            </button>
            <button
              type="button"
              onClick={onOpenCompare}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 active:scale-[0.98] rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t('calc.compareOfferBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Synchronized Rate Input Cards */}
        <section
          aria-label="Synchronized Salary Inputs"
          data-tour="salary-inputs"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
        {PERIOD_CARDS.map((card) => {
          const row = breakdown.rows.find((r) => r.period === card.period)!;
          const isActiveDriver = settings.inputMode === card.mode;
          const isFocused = focusedMode === card.mode;

          const displayGrossValue =
            card.mode === 'hourly'
              ? breakdown.baseHourlyRate
              : card.mode === 'annual' &&
                  settings.superMode === 'included_in_package'
                ? breakdown.annualGrossPackage
                : card.mode === 'monthly' &&
                    settings.superMode === 'included_in_package'
                  ? breakdown.annualGrossPackage / 12
                  : row.gross;

          const inputValue = isFocused
            ? draftText
            : isActiveDriver
              ? settings.inputAmount > 0
                ? String(settings.inputAmount)
                : ''
              : formatInputDisplay(displayGrossValue, card.mode, baseDecimals);

          const subtitleText =
            card.mode === 'hourly'
              ? t('calc.perOrdinaryHour')
              : card.mode === 'daily'
                ? t('calc.workdayHours', {
                    hours: settings.standardHoursPerDay,
                  })
                : card.mode === 'weekly'
                  ? t('calc.perWeek')
                  : card.mode === 'fortnightly'
                    ? t('calc.perFortnight')
                    : card.mode === 'monthly'
                      ? t('calc.perCalendarMonth')
                      : t('calc.weeksPerYear', {
                          weeks: settings.weeksPerYear,
                        });

          return (
            <div
              key={card.mode}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all flex flex-col justify-between gap-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none ${
                isFocused || (isActiveDriver && hasAmount)
                  ? 'border-teal-500 ring-2 ring-teal-500/20 dark:border-teal-500 dark:ring-teal-400/25'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <label
                    htmlFor={`rate-input-${card.mode}`}
                    className={`text-sm font-bold cursor-pointer ${
                      isFocused || (isActiveDriver && hasAmount)
                        ? 'text-teal-700 dark:text-teal-300'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {t(`period.${card.period}`)}
                  </label>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {subtitleText}
                  </span>
                </div>

                <div className="mt-2.5 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                    {sym}
                  </span>
                  <input
                    id={`rate-input-${card.mode}`}
                    type="number"
                    min={0}
                    step={card.step}
                    placeholder="0.00"
                    value={inputValue}
                    onFocus={() =>
                      handleCardInputFocus(card.mode, displayGrossValue)
                    }
                    onChange={(e) =>
                      handleCardInputChange(card.mode, e.target.value)
                    }
                    onBlur={handleCardInputBlur}
                    className={`w-full ${inputPadClass} pr-3 py-2.5 text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 dark:focus:ring-teal-400/25 transition-all`}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                  <span>
                    {settings.superMode === 'included_in_package' &&
                    (card.mode === 'annual' || card.mode === 'monthly')
                      ? t('calc.totalPackageIncl', {
                          label: settings.retirementLabel,
                        })
                      : t('calc.beforeTaxGross')}
                  </span>
                  {card.mode === 'hourly' &&
                    settings.employmentType === 'casual' &&
                    settings.hasCasualLoading &&
                    hasAmount && (
                      <span className="font-mono tabular-nums text-teal-700 dark:text-teal-300 font-semibold">
                        {t('calc.loadedHourly', {
                          rate: formatCurrency(
                            breakdown.effectiveLoadedHourlyRate,
                            sym,
                            baseDecimals
                          ),
                          pct: settings.casualLoadingPct,
                        })}
                      </span>
                    )}
                </div>
              </div>

              <div
                key={`res-${card.mode}-${settings.inputAmount}`}
                className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-result-fade"
              >
                <div
                  className={`flex items-baseline justify-between gap-2 rounded-xl px-3 py-2 ${
                    hasAmount
                      ? 'bg-emerald-50/75 dark:bg-emerald-950/45'
                      : 'bg-slate-50/80 dark:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {t('calc.cashTakeHome')}
                  </span>
                  <span
                    className={`text-lg font-bold font-mono tabular-nums ${
                      hasAmount
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {formatCurrency(row.netPocket, sym, baseDecimals)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  <span>
                    {t('calc.taxShort')} -{formatCurrency(row.taxAndLevies, sym, baseDecimals)}
                  </span>
                  <span className="text-sky-700 dark:text-sky-400 font-medium truncate max-w-[125px]">
                    {settings.retirementLabel.split(' ')[0]} +
                    {formatCurrency(row.superAmount, sym, baseDecimals)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Currency & Exchange Rate Converter */}
      <div data-tour="currency-converter">
        <CurrencyConverterBar
          settings={settings}
          breakdown={breakdown}
          onUpdateSettings={onUpdateSettings}
        />
      </div>

      {/* Inline Country, Super, Tax & Workweek Quick Controls */}
      <section
        aria-label="Country, Tax and Super Controls"
        data-tour="country-tax-controls"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        {/* Employment Type, Agreed Weekly Hours & Casual Loading */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {t('calc.employmentType')}
            </span>
            <div
              role="group"
              aria-label={t('calc.employmentType')}
              className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              {(
                [
                  { id: 'full_time', label: t('calc.fullTime') },
                  { id: 'part_time', label: t('calc.partTime') },
                  { id: 'casual', label: t('calc.casual') },
                ] as Array<{ id: EmploymentType; label: string }>
              ).map((emp) => {
                const isSelected = settings.employmentType === emp.id;
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      if (emp.id === 'casual') {
                        onUpdateSettings({
                          employmentType: 'casual',
                          hasCasualLoading: true,
                          casualLoadingPct:
                            settings.casualLoadingPct > 0
                              ? settings.casualLoadingPct
                              : 25,
                        });
                      } else {
                        onUpdateSettings({
                          employmentType: emp.id,
                          hasCasualLoading: false,
                        });
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {emp.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            {settings.employmentType !== 'full_time' && (
              <div className="min-w-[175px]">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <label
                    htmlFor="agreed-weekly-hours"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t('calc.agreedWeeklyHours')}
                  </label>
                  <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500">
                    {t('calc.fortnightlyEquiv', {
                      hours: (
                        Math.round(settings.agreedWeeklyHours * 20) / 10
                      ).toString(),
                    })}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="agreed-weekly-hours"
                    type="number"
                    min={1}
                    max={80}
                    step={0.5}
                    value={settings.agreedWeeklyHours}
                    onChange={(e) =>
                      onUpdateSettings({
                        agreedWeeklyHours: Math.max(
                          1,
                          Math.min(80, parseFloat(e.target.value) || 1)
                        ),
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                    h/wk
                  </span>
                </div>
              </div>
            )}

            {settings.employmentType === 'casual' && (
              <div className="min-w-[160px]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.hasCasualLoading}
                      onChange={(e) =>
                        onUpdateSettings({
                          hasCasualLoading: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                    />
                    <span>{t('calc.casualLoading')}</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    disabled={!settings.hasCasualLoading}
                    aria-label={t('calc.casualLoading')}
                    value={settings.casualLoadingPct}
                    onChange={(e) =>
                      onUpdateSettings({
                        casualLoadingPct: Math.max(
                          0,
                          Math.min(100, parseFloat(e.target.value) || 0)
                        ),
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Country Tax Rules Selector */}
          <div>
            <label
              htmlFor="country-tax-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              {t('calc.countryRulesLabel', { label: settings.retirementLabel })}
            </label>
            <select
              id="country-tax-select"
              value={settings.countryCode}
              onChange={(e) => onSelectCountry(e.target.value as CountryCode)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400 cursor-pointer"
            >
              <optgroup label="Asia Pacific">
                {COUNTRY_PRESETS.filter((c) => c.region === 'Asia Pacific').map(
                  (c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.currencyCode})
                    </option>
                  )
                )}
              </optgroup>
              <optgroup label="Latin America">
                {COUNTRY_PRESETS.filter(
                  (c) => c.region === 'Latin America'
                ).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currencyCode})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Europe, North America & Custom">
                {COUNTRY_PRESETS.filter(
                  (c) => c.region === 'Other Regions'
                ).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.currencyCode})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Adjustable Superannuation / Retirement % */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="inline-flex items-center gap-1 min-w-0">
                <label
                  htmlFor="quick-super-rate"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate"
                >
                  {settings.retirementLabel} (%)
                </label>
                <InfoTooltip {...retirementTooltip} />
              </div>
              {settings.superRate !== latestRules.superRate ? (
                <button
                  type="button"
                  onClick={onSyncLatestRules}
                  className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:underline shrink-0 cursor-pointer"
                >
                  {t('calc.latestPct', { pct: latestRules.superRate })}
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
                  {t('calc.latestPct', { pct: latestRules.superRate })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="quick-super-rate"
                  type="number"
                  min={0}
                  max={40}
                  step={0.5}
                  value={settings.superRate}
                  onChange={(e) =>
                    onUpdateSettings({
                      superRate: Math.max(
                        0,
                        Math.min(40, parseFloat(e.target.value) || 0)
                      ),
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                  %
                </span>
              </div>
              <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ superMode: 'employer_paid' })
                  }
                  className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    settings.superMode === 'employer_paid'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('calc.onTop')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ superMode: 'included_in_package' })
                  }
                  className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                    settings.superMode === 'included_in_package'
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {t('calc.included')}
                </button>
              </div>
            </div>
          </div>

          {/* Standard Workday & Week */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              {t('calc.workSchedule')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={16}
                  step={0.1}
                  aria-label="Standard hours per day"
                  value={settings.standardHoursPerDay}
                  onChange={(e) =>
                    onUpdateSettings({
                      standardHoursPerDay: Math.max(
                        1,
                        parseFloat(e.target.value) || 7.6
                      ),
                    })
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                  h/day
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={7}
                  step={0.5}
                  aria-label="Work days per week"
                  value={settings.standardDaysPerWeek}
                  onChange={(e) =>
                    onUpdateSettings({
                      standardDaysPerWeek: Math.max(
                        1,
                        Math.min(7, parseFloat(e.target.value) || 5)
                      ),
                    })
                  }
                  className="w-full px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                  d/wk
                </span>
              </div>
            </div>
          </div>

          {/* Private Health Insurance */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.hasPrivateHealth}
                  onChange={(e) =>
                    onUpdateSettings({ hasPrivateHealth: e.target.checked })
                  }
                  className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                />
                <span>{t('calc.privateHealth')}</span>
              </label>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {t('calc.optional')}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 dark:text-slate-500 pointer-events-none">
                {sym}
              </span>
              <input
                type="number"
                min={0}
                disabled={!settings.hasPrivateHealth}
                value={settings.phiMonthlyCost}
                onChange={(e) =>
                  onUpdateSettings({
                    phiMonthlyCost: Math.max(0, Number(e.target.value)),
                  })
                }
                aria-label="Private health monthly cost"
                className="w-full pl-6 pr-9 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 dark:text-slate-500 pointer-events-none">
                /mo
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Checkboxes Row */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-5">
            <div className="inline-flex items-center gap-1.5">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.includeMedicareLevy}
                  onChange={(e) =>
                    onUpdateSettings({ includeMedicareLevy: e.target.checked })
                  }
                  className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                />
                <span>
                  {settings.levyLabel}
                  {countryPreset.levyBrackets ? '' : ` (${settings.medicareLevyRate}%)`}
                </span>
              </label>
              <InfoTooltip {...levyTooltip} />
            </div>

            {settings.countryCode === 'AU' && (
              <>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.claimTaxFreeThreshold}
                    onChange={(e) =>
                      onUpdateSettings({
                        claimTaxFreeThreshold: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                  />
                  <span>{t('calc.taxFreeThreshold')}</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hasHecsHelp}
                    onChange={(e) =>
                      onUpdateSettings({ hasHecsHelp: e.target.checked })
                    }
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                  />
                  <span>HECS-HELP</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.useAtoPaygRounding}
                    onChange={(e) =>
                      onUpdateSettings({
                        useAtoPaygRounding: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                  />
                  <span>ATO Monthly PAYG Rounding</span>
                </label>
              </>
            )}

            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {settings.taxMode === 'country_scale' ? (
                <>
                  {t('calc.autoSynced', {
                    year: latestRules.taxYearLabel,
                    label: settings.retirementLabel,
                  })}
                </>
              ) : (
                <button
                  type="button"
                  onClick={onSyncLatestRules}
                  className="font-semibold text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
                >
                  {t('calc.syncLatestRules', {
                    year: latestRules.taxYearLabel,
                  })}
                </button>
              )}
            </span>

            {settings.countryCode === 'VN' && (
              <label className="inline-flex items-center gap-2">
                <span>{t('calc.dependents')}</span>
                <select
                  value={settings.vnDependents}
                  onChange={(e) =>
                    onUpdateSettings({
                      vnDependents: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className="px-2.5 py-1 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400 cursor-pointer"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          {hasAmount && (
            <div className="inline-flex items-center gap-1.5 font-mono tabular-nums text-slate-500 dark:text-slate-400">
              <span>
                {t('calc.effectiveTaxRate')}{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {breakdown.effectiveTaxRate.toFixed(1)}%
                </span>{' '}
                · {t('calc.marginal')}{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {breakdown.marginalTaxRate}%
                </span>
              </span>
              <InfoTooltip {...taxTooltip} />
            </div>
          )}
        </div>

        {/* Collapsible Overtime, Weekend & Public Holiday Shifts */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <button
            type="button"
            aria-expanded={isShiftsOpen}
            onClick={() => setIsShiftsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg py-0.5"
          >
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{t('calc.shiftsOvertimeToggle')}</span>
                {hasAnyShiftOrOvertime && (
                  <span className="font-mono tabular-nums text-[11px] font-medium text-teal-700 dark:text-teal-300">
                    · {(settings.saturdayHoursWeekly + settings.sundayHoursWeekly + settings.publicHolidayHoursWeekly + settings.overtimeHoursWeekly).toFixed(1).replace(/\.0$/, '')}h/wk
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t('calc.shiftsOvertimeDesc')}
              </p>
            </div>
            <span className="text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0">
              {isShiftsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          {isShiftsOpen && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Saturday */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="shift-sat-hours"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t('calc.saturdayHours')}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="shift-sat-hours"
                      type="number"
                      min={0}
                      max={60}
                      step={0.5}
                      value={settings.saturdayHoursWeekly}
                      onChange={(e) =>
                        onUpdateSettings({
                          saturdayHoursWeekly: Math.max(
                            0,
                            Math.min(60, parseFloat(e.target.value) || 0)
                          ),
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    <select
                      aria-label="Saturday multiplier"
                      value={settings.saturdayMultiplier}
                      onChange={(e) =>
                        onUpdateSettings({
                          saturdayMultiplier: parseFloat(e.target.value) || 1.25,
                        })
                      }
                      className="px-2 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 cursor-pointer"
                    >
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={1.75}>1.75x</option>
                      <option value={2}>2.0x</option>
                    </select>
                  </div>
                </div>

                {/* Sunday */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="shift-sun-hours"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t('calc.sundayHours')}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="shift-sun-hours"
                      type="number"
                      min={0}
                      max={60}
                      step={0.5}
                      value={settings.sundayHoursWeekly}
                      onChange={(e) =>
                        onUpdateSettings({
                          sundayHoursWeekly: Math.max(
                            0,
                            Math.min(60, parseFloat(e.target.value) || 0)
                          ),
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    <select
                      aria-label="Sunday multiplier"
                      value={settings.sundayMultiplier}
                      onChange={(e) =>
                        onUpdateSettings({
                          sundayMultiplier: parseFloat(e.target.value) || 1.5,
                        })
                      }
                      className="px-2 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 cursor-pointer"
                    >
                      <option value={1.5}>1.5x</option>
                      <option value={1.75}>1.75x</option>
                      <option value={2}>2.0x</option>
                    </select>
                  </div>
                </div>

                {/* Public Holiday */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="shift-ph-hours"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t('calc.publicHolidayHours')}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="shift-ph-hours"
                      type="number"
                      min={0}
                      max={60}
                      step={0.5}
                      value={settings.publicHolidayHoursWeekly}
                      onChange={(e) =>
                        onUpdateSettings({
                          publicHolidayHoursWeekly: Math.max(
                            0,
                            Math.min(60, parseFloat(e.target.value) || 0)
                          ),
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    <select
                      aria-label="Public holiday multiplier"
                      value={settings.publicHolidayMultiplier}
                      onChange={(e) =>
                        onUpdateSettings({
                          publicHolidayMultiplier:
                            parseFloat(e.target.value) || 2.25,
                        })
                      }
                      className="px-2 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 cursor-pointer"
                    >
                      <option value={2}>2.0x</option>
                      <option value={2.25}>2.25x</option>
                      <option value={2.5}>2.5x</option>
                    </select>
                  </div>
                </div>

                {/* Overtime */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="shift-ot-hours"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t('calc.overtimeHours')}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="shift-ot-hours"
                      type="number"
                      min={0}
                      max={60}
                      step={0.5}
                      value={settings.overtimeHoursWeekly}
                      onChange={(e) =>
                        onUpdateSettings({
                          overtimeHoursWeekly: Math.max(
                            0,
                            Math.min(60, parseFloat(e.target.value) || 0)
                          ),
                        })
                      }
                      className="w-full px-2.5 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    />
                    <select
                      aria-label="Overtime multiplier"
                      value={settings.overtimeMultiplier}
                      onChange={(e) =>
                        onUpdateSettings({
                          overtimeMultiplier: parseFloat(e.target.value) || 1.5,
                        })
                      }
                      className="px-2 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shrink-0 cursor-pointer"
                    >
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2.0x</option>
                    </select>
                  </div>
                </div>
              </div>

              {settings.employmentType === 'casual' && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {t('calc.casualPenaltyRule')}:
                    </span>
                    <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
                      {(
                        [
                          { id: 'compounding', label: t('calc.compounding') },
                          { id: 'cumulative', label: t('calc.cumulative') },
                        ] as Array<{ id: CasualPenaltyMethod; label: string }>
                      ).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() =>
                            onUpdateSettings({ casualPenaltyMethod: m.id })
                          }
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                            settings.casualPenaltyMethod === m.id
                              ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('calc.casualPhNote', {
                      mult: settings.publicHolidayMultiplier,
                    })}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leave Accrual & Super OTE Summary */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {t('calc.leaveTitle')}:
            </span>
            {settings.employmentType === 'casual' ? (
              <span className="text-slate-500 dark:text-slate-400">
                {t('calc.leaveCasualNone', {
                  pct: settings.hasCasualLoading
                    ? settings.casualLoadingPct
                    : 0,
                })}
              </span>
            ) : (
              <>
                <span className="font-mono tabular-nums">
                  <span className="font-sans text-slate-500 dark:text-slate-400">
                    {t('calc.annualLeaveEst')}:{' '}
                  </span>
                  <strong className="text-slate-900 dark:text-slate-100">
                    {t('calc.leaveHoursYr', {
                      hrs: (
                        Math.round(breakdown.annualLeaveHoursPerYear * 10) / 10
                      ).toString(),
                    })}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <span className="font-mono tabular-nums">
                  <span className="font-sans text-slate-500 dark:text-slate-400">
                    {t('calc.personalLeaveEst')}:{' '}
                  </span>
                  <strong className="text-slate-900 dark:text-slate-100">
                    {t('calc.leaveHoursYr', {
                      hrs: (
                        Math.round(breakdown.personalLeaveHoursPerYear * 10) / 10
                      ).toString(),
                    })}
                  </strong>
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono tabular-nums text-[11px]">
            <span className="text-sky-700 dark:text-sky-400 font-semibold">
              {t('calc.oteSuperLabel', {
                label: settings.retirementLabel,
                ote: formatCurrency(
                  breakdown.ordinaryTimeEarningsAnnual,
                  sym,
                  baseDecimals
                ),
              })}{' '}
              = +{formatCurrency(breakdown.annualSuper, sym, baseDecimals)}/yr
            </span>
            {breakdown.overtimeAnnual > 0 && (
              <span className="text-slate-500 dark:text-slate-400">
                ·{' '}
                {t('calc.overtimeExclNote', {
                  ot: formatCurrency(
                    breakdown.overtimeAnnual,
                    sym,
                    baseDecimals
                  ),
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Novated Leasing & Salary Packaging Toggle Estimator (hidden unless enabled) */}
      {ENABLE_NOVATED_LEASE_PANEL && (
        <NovatedLeasePanel settings={settings} breakdown={breakdown} />
      )}

      {/* Recharts Visual Breakdown: Tax vs. Net Pay Proportions */}
      <PayDistributionChart
        settings={settings}
        breakdown={breakdown}
        isDark={isDark}
        themeMode={themeMode}
      />

      {/* Full 4-Period Breakdown Table & Mobile Cards */}
      <section
        aria-label="Take-Home Breakdown"
        data-tour="breakdown-export"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t('calc.summaryTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {hasAmount && settings.countryCode === 'VN'
                  ? `Monthly deductions: ${settings.levyLabel} (${settings.medicareLevyRate}%): -${formatCurrency(breakdown.annualMedicareLevy / 12, sym, baseDecimals)} · PIT (after ₫15.5M self${settings.vnDependents > 0 ? ` + ${settings.vnDependents}×₫6.2M dep.` : ''}): -${formatCurrency(breakdown.annualPaygTax / 12, sym, baseDecimals)}`
                  : hasAmount
                    ? `Showing exact take-home cash after income tax${settings.includeMedicareLevy ? `, ${settings.levyLabel}` : ''}${settings.hasHecsHelp && settings.countryCode === 'AU' ? ', HECS-HELP' : ''}${settings.hasPrivateHealth ? ', and private health' : ''}`
                    : t('calc.summaryEmpty')}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {hasAmount && (
                <div
                  key={`ratio-res-${settings.inputAmount}`}
                  className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300 mr-1 animate-result-fade"
                >
                  {t('calc.takeHomeRatio')}{' '}
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {netPct.toFixed(1)}%
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={handleDownloadCsv}
                disabled={!hasAmount}
                title={
                  hasAmount
                    ? t('calc.downloadCsv')
                    : t('calc.summaryEmpty')
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 disabled:opacity-45 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('calc.downloadCsv')}</span>
              </button>
              {ENABLE_TAX_EXPORT_MODAL && (
                <button
                  type="button"
                  onClick={() => hasAmount && setIsTaxModalOpen(true)}
                  disabled={!hasAmount}
                  title={
                    hasAmount
                      ? t('partner.taxModalTitle')
                      : t('calc.summaryEmpty')
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 disabled:opacity-45 disabled:cursor-not-allowed rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>{t('calc.exportTaxApp')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handlePrintPdf}
                disabled={!hasAmount}
                title={
                  hasAmount
                    ? t('calc.exportPdf')
                    : t('calc.summaryEmpty')
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-200/80 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl shadow-xs disabled:shadow-none transition-colors cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('calc.exportPdf')}</span>
              </button>
            </div>
          </div>

          <div
            key={`bar-res-${settings.inputAmount}`}
            className="animate-result-fade"
          >
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${netPct}%` }}
                className="bg-emerald-500 h-full transition-all duration-200"
              />
              <div
                style={{ width: `${taxPct}%` }}
                className="bg-slate-700 dark:bg-slate-400 h-full transition-all duration-200"
              />
              <div
                style={{ width: `${phiOtherPct}%` }}
                className="bg-amber-500 h-full transition-all duration-200"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shrink-0" />
                {t('calc.cashTakeHome')} ({netPct.toFixed(1)}%)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-700 dark:bg-slate-400 shrink-0" />
                <span>{t('calc.colTaxLevies')} ({taxPct.toFixed(1)}%)</span>
                <InfoTooltip {...taxTooltip} />
              </span>
              {phiOtherPct > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 shrink-0" />
                  {t('calc.colPhiOther')} ({phiOtherPct.toFixed(1)}%)
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-sky-700 dark:text-sky-400 font-medium">
                <span>
                  {settings.retirementLabel}: {settings.superRate}%{' '}
                  {settings.superMode === 'employer_paid'
                    ? t('calc.paidOnTop')
                    : t('calc.includedInPackage')}
                </span>
                <InfoTooltip {...retirementTooltip} />
              </span>
            </div>
          </div>
        </div>

        {/* Mobile & Desktop Breakdown Results */}
        <div
          key={`rows-res-${settings.inputAmount}`}
          className="animate-result-fade"
        >
          {/* Mobile Stacked Period Cards (< 768px) — zero horizontal overflow */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {breakdown.rows.map((row) => (
            <div key={row.period} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {t(`period.${row.period}`)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('calc.cashTakeHome')} ({settings.currencyCode})
                  </div>
                </div>
                <div className="text-right min-w-0">
                  <div
                    className={`text-base font-bold font-mono tabular-nums break-words ${
                      hasAmount
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {formatCurrency(row.netPocket, sym, baseDecimals)}
                  </div>
                  {targetCurrencyOpt && (
                    <div className="text-xs font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300 break-words">
                      {formatConvertedCurrency(
                        row.netPocket,
                        settings.exchangeRate,
                        targetCurrencyOpt.symbol,
                        targetCurrencyOpt.decimals
                      )}{' '}
                      <span className="text-[10px] font-sans font-semibold">
                        {targetCurrencyOpt.code}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 p-3 text-xs">
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('calc.colGross')}
                  </div>
                  <div className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-100 break-words mt-0.5">
                    {formatCurrency(row.gross, sym, baseDecimals)}
                  </div>
                </div>
                <div className="min-w-0 text-right">
                  <div className="inline-flex items-center justify-end gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{t('calc.colTaxLevies')}</span>
                    <InfoTooltip {...taxTooltip} />
                  </div>
                  <div className="font-mono tabular-nums text-slate-600 dark:text-slate-300 break-words mt-0.5">
                    -{formatCurrency(row.taxAndLevies, sym, baseDecimals)}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t('calc.colAfterTax')}
                  </div>
                  <div className="font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100 break-words mt-0.5">
                    {formatCurrency(row.afterTax, sym, baseDecimals)}
                  </div>
                </div>
                <div className="min-w-0 text-right">
                  <div className="inline-flex items-center justify-end gap-1 max-w-full text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate">
                      {settings.retirementLabel} ({settings.superRate}%)
                    </span>
                    <InfoTooltip {...retirementTooltip} />
                  </div>
                  <div className="font-mono tabular-nums font-semibold text-sky-700 dark:text-sky-400 break-words mt-0.5">
                    +{formatCurrency(row.superAmount, sym, baseDecimals)}
                  </div>
                </div>
                {row.privateHealthAndOther > 0 && (
                  <div className="col-span-2 pt-2 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t('calc.colPhiOther')}
                    </span>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      -{formatCurrency(row.privateHealthAndOther, sym, baseDecimals)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop Table (>= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/70 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-3 px-5">{t('calc.colPeriod')}</th>
                <th className="py-3 px-4 text-right">{t('calc.colGross')}</th>
                <th className="py-3 px-4 text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    <span>{t('calc.colTaxLevies')}</span>
                    <InfoTooltip {...taxTooltip} />
                  </span>
                </th>
                <th className="py-3 px-4 text-right">{t('calc.colAfterTax')}</th>
                <th className="py-3 px-4 text-right">{t('calc.colPhiOther')}</th>
                <th className="py-3 px-4 text-right">
                  <span className="inline-flex items-center justify-end gap-1">
                    <span>
                      {settings.retirementLabel} ({settings.superRate}%)
                    </span>
                    <InfoTooltip {...retirementTooltip} />
                  </span>
                </th>
                <th className="py-3 px-5 text-right">
                  {t('calc.cashTakeHome')} ({settings.currencyCode})
                </th>
                {targetCurrencyOpt && (
                  <th className="py-3 px-5 text-right">
                    {t('calc.colConverted', { code: targetCurrencyOpt.code })}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {breakdown.rows.map((row) => (
                <tr
                  key={row.period}
                  className="hover:bg-teal-50/25 dark:hover:bg-teal-950/30 transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-slate-900 dark:text-slate-100">
                    {t(`period.${row.period}`)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {formatCurrency(row.gross, sym, baseDecimals)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    -{formatCurrency(row.taxAndLevies, sym, baseDecimals)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(row.afterTax, sym, baseDecimals)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    -{formatCurrency(row.privateHealthAndOther, sym, baseDecimals)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-sky-700 dark:text-sky-400 font-medium">
                    +{formatCurrency(row.superAmount, sym, baseDecimals)}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(row.netPocket, sym, baseDecimals)}
                  </td>
                  {targetCurrencyOpt && (
                    <td className="py-3.5 px-5 text-right font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">
                      {formatConvertedCurrency(
                        row.netPocket,
                        settings.exchangeRate,
                        targetCurrencyOpt.symbol,
                        targetCurrencyOpt.decimals
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {/* Contextual Superannuation & ETF Callout (hidden unless enabled) */}
        {ENABLE_SUPER_ETF_CALLOUT && (
          <SuperEtfCallout
            settings={settings}
            breakdown={breakdown}
            onOpenRetirement={onOpenRetirement}
          />
        )}
      </section>
      </div>

      <PdfReportModal
        isOpen={isPdfPreviewOpen}
        settings={settings}
        breakdown={breakdown}
        onClose={() => setIsPdfPreviewOpen(false)}
        onAnnounce={onAnnounce}
      />

      {ENABLE_TAX_EXPORT_MODAL && (
        <TaxSoftwareModal
          isOpen={isTaxModalOpen}
          settings={settings}
          breakdown={breakdown}
          onClose={() => setIsTaxModalOpen(false)}
          onAnnounce={onAnnounce}
        />
      )}

      <PrintableSalaryReport settings={settings} breakdown={breakdown} />
    </>
  );
}
