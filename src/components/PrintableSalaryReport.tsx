import { getCountryPreset } from '../data/countryPresets';
import { getCurrencyOption } from '../data/currencies';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import { useI18n } from '../i18n';
import { formatConvertedCurrency, formatCurrency } from '../utils/format';
import { getActiveAuthorityLabel } from '../utils/taxYearRules';

interface PrintableSalaryReportProps {
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  isPreview?: boolean;
}

export function PrintableSalaryReport({
  settings,
  breakdown,
  isPreview = false,
}: PrintableSalaryReportProps) {
  const { languageOption, t } = useI18n();
  const preset = getCountryPreset(settings.countryCode);
  const sym = settings.currencySymbol;
  const baseDecimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const targetCurrencyOpt = getCurrencyOption(settings.targetCurrency);
  const authorityLabel = getActiveAuthorityLabel(settings);
  const generatedDate = new Date().toLocaleDateString(languageOption.code, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const grossBase = Math.max(1, breakdown.annualTaxableGross);
  const netPct =
    settings.inputAmount > 0
      ? Math.max(0, Math.min(100, (breakdown.annualNetPocket / grossBase) * 100))
      : 0;
  const taxPct =
    settings.inputAmount > 0
      ? Math.max(
          0,
          Math.min(100 - netPct, (breakdown.annualTotalTax / grossBase) * 100)
        )
      : 0;
  const otherPct =
    settings.inputAmount > 0
      ? Math.max(
          0,
          Math.min(
            100 - netPct - taxPct,
            ((breakdown.annualPhi + breakdown.annualOtherDeductions) / grossBase) *
              100
          )
        )
      : 0;
  const annualTotalDeductions =
    breakdown.annualTotalTax +
    breakdown.annualPhi +
    breakdown.annualOtherDeductions;

  const empLabel =
    settings.employmentType === 'casual'
      ? t('calc.casual')
      : settings.employmentType === 'part_time'
        ? t('calc.partTime')
        : t('calc.fullTime');

  return (
    <article
      aria-hidden={!isPreview ? true : undefined}
      className={
        isPreview
          ? 'text-slate-900 bg-white space-y-5 rounded-xl border border-slate-200 p-5 sm:p-7 shadow-xs'
          : 'hidden print:block print-only text-slate-900 bg-white space-y-6'
      }
    >
      {/* Report Header */}
      <header className="flex items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
        <div>
          <div className="text-2xl font-extrabold tracking-tight text-slate-900">
            Pocket<span className="text-teal-700">Wage</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            {t('pdf.reportTitle')}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {preset.name} ({settings.currencyCode}) · {empLabel} ·{' '}
            {authorityLabel} · {settings.superRate}% {settings.retirementLabel}
          </p>
        </div>

        <div className="text-right text-xs text-slate-600 space-y-0.5">
          <div className="font-semibold text-slate-900">
            {t('pdf.generated', { date: generatedDate })}
          </div>
          <div>
            {breakdown.ordinaryHoursWeekly}h/wk ord ·{' '}
            {settings.standardHoursPerDay}h/day · {settings.weeksPerYear} wks/yr
          </div>
          <div>
            {settings.retirementLabel}:{' '}
            {settings.superMode === 'employer_paid'
              ? t('calc.paidOnTop')
              : t('calc.includedInPackage')}
            {settings.employmentType !== 'casual' &&
              ` · ${t('calc.annualLeaveEst')}: ${Math.round(breakdown.annualLeaveHoursPerYear * 10) / 10}h/yr`}
          </div>
        </div>
      </header>

      {/* Executive Summary KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 print-avoid-break">
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-[11px] font-semibold text-slate-500">
            {t('pdf.annualNet')}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-emerald-700 mt-1">
            {formatCurrency(breakdown.annualNetPocket, sym, baseDecimals)}
          </div>
          {targetCurrencyOpt && (
            <div className="text-[11px] font-mono tabular-nums text-teal-700 font-semibold mt-0.5">
              {formatConvertedCurrency(
                breakdown.annualNetPocket,
                settings.exchangeRate,
                targetCurrencyOpt.symbol,
                targetCurrencyOpt.decimals
              )}{' '}
              {targetCurrencyOpt.code}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-[11px] font-semibold text-slate-500">
            {t('pdf.annualGross')}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-1">
            {formatCurrency(breakdown.annualTaxableGross, sym, baseDecimals)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Pkg: {formatCurrency(breakdown.annualGrossPackage, sym, baseDecimals)}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-[11px] font-semibold text-slate-500">
            {t('pdf.annualTaxLevies')}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-slate-800 mt-1">
            -{formatCurrency(breakdown.annualTotalTax, sym, baseDecimals)}
          </div>
          <div className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
            Eff. {breakdown.effectiveTaxRate.toFixed(1)}% · Marg.{' '}
            {breakdown.marginalTaxRate}%
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <div className="text-[11px] font-semibold text-slate-500">
            {t('pdf.annualRetirement', { label: settings.retirementLabel })}
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-sky-700 mt-1">
            +{formatCurrency(breakdown.annualSuper, sym, baseDecimals)}
          </div>
          <div className="text-[11px] font-mono tabular-nums text-slate-500 mt-0.5">
            {settings.superRate}% on OTE (
            {formatCurrency(breakdown.ordinaryTimeEarningsAnnual, sym, 0)})
          </div>
        </div>
      </section>

      {/* Visual Take-Home Share Bar */}
      <section className="rounded-xl border border-slate-200 p-4 space-y-2.5 print-avoid-break">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
          <span>{t('pdf.grossPayAllocation')}</span>
          <span className="font-mono tabular-nums text-emerald-700">
            {t('calc.takeHomeRatio')} {netPct.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${netPct}%` }} className="bg-emerald-600 h-full" />
          <div style={{ width: `${taxPct}%` }} className="bg-slate-700 h-full" />
          <div style={{ width: `${otherPct}%` }} className="bg-amber-500 h-full" />
        </div>
        <div className="flex flex-wrap gap-5 text-[11px] text-slate-600">
          <span>{t('calc.cashTakeHome')} ({netPct.toFixed(1)}%)</span>
          <span>{t('calc.colTaxLevies')} ({taxPct.toFixed(1)}%)</span>
          {otherPct > 0 && (
            <span>{t('calc.colPhiOther')} ({otherPct.toFixed(1)}%)</span>
          )}
        </div>
      </section>

      {/* 4-Period Pay Breakdown Table */}
      <section className="rounded-xl border border-slate-200 overflow-hidden print-avoid-break">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-900">
          {t('pdf.payBreakdownByPeriod', { currency: settings.currencyCode })}
        </div>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600">
              <th className="py-2 px-3">{t('calc.colPeriod')}</th>
              <th className="py-2 px-3 text-right">{t('calc.colGross')}</th>
              <th className="py-2 px-3 text-right">{t('calc.colTaxLevies')}</th>
              <th className="py-2 px-3 text-right">{t('calc.colAfterTax')}</th>
              <th className="py-2 px-3 text-right">{t('calc.colPhiOther')}</th>
              <th className="py-2 px-3 text-right">{settings.retirementLabel}</th>
              <th className="py-2 px-3 text-right">{t('calc.cashTakeHome')}</th>
              {targetCurrencyOpt && (
                <th className="py-2 px-3 text-right">
                  {t('calc.colConverted', { code: targetCurrencyOpt.code })}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {breakdown.rows.map((row) => (
              <tr key={row.period}>
                <td className="py-2 px-3 font-semibold text-slate-900">
                  {t(`period.${row.period}`)}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums">
                  {formatCurrency(row.gross, sym, baseDecimals)}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                  -{formatCurrency(row.taxAndLevies, sym, baseDecimals)}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-medium">
                  {formatCurrency(row.afterTax, sym, baseDecimals)}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-600">
                  -{formatCurrency(row.privateHealthAndOther, sym, baseDecimals)}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums text-sky-700">
                  +{formatCurrency(row.superAmount, sym, baseDecimals)}
                </td>
                <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-emerald-700">
                  {formatCurrency(row.netPocket, sym, baseDecimals)}
                </td>
                {targetCurrencyOpt && (
                  <td className="py-2 px-3 text-right font-mono tabular-nums font-bold text-teal-700">
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
      </section>

      {/* Itemized Annual Deduction Summary */}
      <section className="rounded-xl border border-slate-200 overflow-hidden print-avoid-break">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-900">
          {t('pdf.annualDeductionSummary')}
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="flex justify-between px-4 py-2">
            <span className="text-slate-600">
              {t('chart.incomeTax')} ({authorityLabel})
            </span>
            <span className="font-mono tabular-nums font-semibold">
              -{formatCurrency(breakdown.annualPaygTax, sym, baseDecimals)}
            </span>
          </div>
          {settings.includeMedicareLevy && (
            <div className="flex justify-between px-4 py-2">
              <span className="text-slate-600">
                {settings.levyLabel}
                {preset.levyBrackets ? '' : ` (${settings.medicareLevyRate}%)`}
              </span>
              <span className="font-mono tabular-nums font-semibold">
                -{formatCurrency(breakdown.annualMedicareLevy, sym, baseDecimals)}
              </span>
            </div>
          )}
          {breakdown.annualMedicareSurcharge > 0 && (
            <div className="flex justify-between px-4 py-2">
              <span className="text-slate-600">Medicare Levy Surcharge</span>
              <span className="font-mono tabular-nums font-semibold">
                -
                {formatCurrency(
                  breakdown.annualMedicareSurcharge,
                  sym,
                  baseDecimals
                )}
              </span>
            </div>
          )}
          {breakdown.annualHecsRepayment > 0 && (
            <div className="flex justify-between px-4 py-2">
              <span className="text-slate-600">HECS-HELP Repayment</span>
              <span className="font-mono tabular-nums font-semibold">
                -{formatCurrency(breakdown.annualHecsRepayment, sym, baseDecimals)}
              </span>
            </div>
          )}
          {breakdown.annualPhi > 0 && (
            <div className="flex justify-between px-4 py-2">
              <span className="text-slate-600">Private Health Insurance</span>
              <span className="font-mono tabular-nums font-semibold">
                -{formatCurrency(breakdown.annualPhi, sym, baseDecimals)}
              </span>
            </div>
          )}
          {breakdown.annualOtherDeductions > 0 && (
            <div className="flex justify-between px-4 py-2">
              <span className="text-slate-600">
                {settings.otherMonthlyDeductionLabel || 'Other Monthly Deductions'}
              </span>
              <span className="font-mono tabular-nums font-semibold">
                -
                {formatCurrency(
                  breakdown.annualOtherDeductions,
                  sym,
                  baseDecimals
                )}
              </span>
            </div>
          )}
          <div className="flex justify-between px-4 py-2 bg-slate-50/80 font-semibold text-slate-800">
            <span>{t('pdf.totalAnnualDeductions')}</span>
            <span className="font-mono tabular-nums">
              -{formatCurrency(annualTotalDeductions, sym, baseDecimals)}
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 bg-emerald-50/70 font-bold text-emerald-900">
            <span>{t('pdf.netAnnualTakeHomeCash')}</span>
            <span className="font-mono tabular-nums">
              {formatCurrency(breakdown.annualNetPocket, sym, baseDecimals)}
            </span>
          </div>
        </div>
      </section>

      <footer className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>
            Generated by PocketWage · Estimates based on {preset.name}{' '}
            {authorityLabel} rules.
          </span>
          <span>
            {targetCurrencyOpt
              ? `FX Rate: 1 ${settings.currencyCode} = ${settings.exchangeRate} ${targetCurrencyOpt.code}`
              : 'Session-only private calculation'}
          </span>
        </div>
        <p>{t('legal.disclaimer')}</p>
      </footer>
    </article>
  );
}
