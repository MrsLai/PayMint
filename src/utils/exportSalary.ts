import { getCountryPreset } from '../data/countryPresets';
import { getCurrencyOption } from '../data/currencies';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import { getActiveAuthorityLabel } from './taxYearRules';

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function roundForCurrency(value: number, decimals: number): string {
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  return decimals === 0 ? String(Math.round(rounded)) : rounded.toFixed(decimals);
}

export function buildSalaryBreakdownCsv(
  settings: PaySettings,
  breakdown: SalaryBreakdown
): string {
  const preset = getCountryPreset(settings.countryCode);
  const baseDecimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const targetCurrencyOpt = getCurrencyOption(settings.targetCurrency);
  const authorityLabel = getActiveAuthorityLabel(settings);
  const exportDate = new Date().toISOString().slice(0, 10);

  const lines: string[][] = [];

  lines.push(['PocketWage Salary & Net Take-Home Report']);
  lines.push(['Generated On', exportDate]);
  lines.push(['Country / Jurisdiction', `${preset.name} (${settings.currencyCode})`]);
  lines.push(['Tax Authority & Rules', authorityLabel]);
  lines.push([
    'Employment Type',
    `${settings.employmentType.replace('_', ' ')}${
      settings.employmentType === 'casual' && settings.hasCasualLoading
        ? ` (+${settings.casualLoadingPct}% loading)`
        : ''
    }`,
  ]);
  lines.push([
    'Work Schedule',
    `${settings.standardHoursPerDay} h/day, ${settings.standardDaysPerWeek} days/wk, ${settings.weeksPerYear} wks/yr (${breakdown.ordinaryHoursWeekly} ord. hrs/wk)`,
  ]);
  lines.push([
    settings.retirementLabel,
    `${settings.superRate}% on OTE (${
      settings.superMode === 'employer_paid'
        ? 'Paid on top of base pay'
        : 'Included in total package'
    })`,
  ]);
  lines.push([
    'Effective Tax Rate',
    `${breakdown.effectiveTaxRate.toFixed(2)}%`,
    'Marginal Tax Rate',
    `${breakdown.marginalTaxRate}%`,
  ]);
  lines.push([]);

  const tableHeaders = [
    'Period',
    `Before Tax Gross (${settings.currencyCode})`,
    `Tax & Levies (${settings.currencyCode})`,
    `After-Tax Pay (${settings.currencyCode})`,
    `Private Health & Other (${settings.currencyCode})`,
    `${settings.retirementLabel} (${settings.currencyCode})`,
    `Cash Take-Home (${settings.currencyCode})`,
  ];

  if (targetCurrencyOpt) {
    tableHeaders.push(`Converted Cash Take-Home (${targetCurrencyOpt.code})`);
  }

  lines.push(tableHeaders);

  for (const row of breakdown.rows) {
    const rowCells = [
      row.period,
      roundForCurrency(row.gross, baseDecimals),
      roundForCurrency(row.taxAndLevies, baseDecimals),
      roundForCurrency(row.afterTax, baseDecimals),
      roundForCurrency(row.privateHealthAndOther, baseDecimals),
      roundForCurrency(row.superAmount, baseDecimals),
      roundForCurrency(row.netPocket, baseDecimals),
    ];
    if (targetCurrencyOpt) {
      rowCells.push(
        roundForCurrency(
          row.netPocket * settings.exchangeRate,
          targetCurrencyOpt.decimals
        )
      );
    }
    lines.push(rowCells);
  }

  lines.push([]);
  lines.push(['Annual Deduction & Package Summary', `Amount (${settings.currencyCode})`]);
  lines.push([
    'Annual Total Package (incl. Retirement)',
    roundForCurrency(breakdown.annualGrossPackage, baseDecimals),
  ]);
  lines.push([
    'Annual Taxable Gross',
    roundForCurrency(breakdown.annualTaxableGross, baseDecimals),
  ]);
  lines.push([
    'Ordinary Time Earnings (OTE — Superable)',
    roundForCurrency(breakdown.ordinaryTimeEarningsAnnual, baseDecimals),
  ]);
  if (breakdown.overtimeAnnual > 0) {
    lines.push([
      'Overtime Pay (Excl. from Super OTE)',
      roundForCurrency(breakdown.overtimeAnnual, baseDecimals),
    ]);
  }
  lines.push([
    'Annual Income Tax',
    roundForCurrency(breakdown.annualPaygTax, baseDecimals),
  ]);
  lines.push([
    `Annual ${settings.levyLabel}`,
    roundForCurrency(breakdown.annualMedicareLevy, baseDecimals),
  ]);
  if (breakdown.annualMedicareSurcharge > 0) {
    lines.push([
      'Annual Medicare Levy Surcharge',
      roundForCurrency(breakdown.annualMedicareSurcharge, baseDecimals),
    ]);
  }
  if (breakdown.annualHecsRepayment > 0) {
    lines.push([
      'Annual HECS-HELP Repayment',
      roundForCurrency(breakdown.annualHecsRepayment, baseDecimals),
    ]);
  }
  lines.push([
    'Annual Total Tax & Levies',
    roundForCurrency(breakdown.annualTotalTax, baseDecimals),
  ]);
  lines.push([
    `Annual ${settings.retirementLabel} (on OTE)`,
    roundForCurrency(breakdown.annualSuper, baseDecimals),
  ]);
  if (breakdown.annualPhi > 0) {
    lines.push([
      'Annual Private Health Insurance',
      roundForCurrency(breakdown.annualPhi, baseDecimals),
    ]);
  }
  if (breakdown.annualOtherDeductions > 0) {
    lines.push([
      `Annual ${settings.otherMonthlyDeductionLabel || 'Other Deductions'}`,
      roundForCurrency(breakdown.annualOtherDeductions, baseDecimals),
    ]);
  }
  lines.push([
    'Annual Cash Take-Home',
    roundForCurrency(breakdown.annualNetPocket, baseDecimals),
  ]);
  lines.push([
    'Estimated Annual Leave Accrual',
    `${breakdown.annualLeaveHoursPerYear.toFixed(1)} hrs/yr`,
  ]);
  lines.push([
    'Estimated Personal Leave Accrual',
    `${breakdown.personalLeaveHoursPerYear.toFixed(1)} hrs/yr`,
  ]);

  return lines.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}

export function downloadSalaryCsv(
  settings: PaySettings,
  breakdown: SalaryBreakdown
): string {
  const csv = buildSalaryBreakdownCsv(settings, breakdown);
  const bom = '\uFEFF';
  const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStamp = new Date().toISOString().slice(0, 10);
  const filename = `pocketwage-salary-${settings.countryCode.toLowerCase()}-${dateStamp}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}

export function buildTaxSummaryText(
  settings: PaySettings,
  breakdown: SalaryBreakdown
): string {
  const preset = getCountryPreset(settings.countryCode);
  const decimals = getCurrencyOption(settings.currencyCode)?.decimals ?? 2;
  const authorityLabel = getActiveAuthorityLabel(settings);
  const fmt = (n: number) =>
    `${settings.currencySymbol}${roundForCurrency(n, decimals)}`;

  const lines = [
    `PocketWage Annual Tax & Income Summary`,
    `Jurisdiction: ${preset.name} (${settings.currencyCode})`,
    `Rules: ${authorityLabel}`,
    `Taxable Gross Income: ${fmt(breakdown.annualTaxableGross)}`,
    `Estimated Income Tax: ${fmt(breakdown.annualPaygTax)}`,
    `${settings.levyLabel}: ${fmt(breakdown.annualMedicareLevy)}`,
  ];

  if (breakdown.annualMedicareSurcharge > 0) {
    lines.push(
      `Medicare Levy Surcharge: ${fmt(breakdown.annualMedicareSurcharge)}`
    );
  }
  if (breakdown.annualHecsRepayment > 0) {
    lines.push(`HECS-HELP Repayment: ${fmt(breakdown.annualHecsRepayment)}`);
  }

  lines.push(
    `Total Tax & Levies: ${fmt(breakdown.annualTotalTax)} (${breakdown.effectiveTaxRate.toFixed(1)}% effective / ${breakdown.marginalTaxRate}% marginal)`,
    `${settings.retirementLabel} (${settings.superRate}%): ${fmt(breakdown.annualSuper)}`,
    `Net Annual Take-Home Cash: ${fmt(breakdown.annualNetPocket)}`
  );

  return lines.join('\n');
}

export function downloadTaxSummaryJson(
  settings: PaySettings,
  breakdown: SalaryBreakdown
): string {
  const preset = getCountryPreset(settings.countryCode);
  const authorityLabel = getActiveAuthorityLabel(settings);
  const dateStamp = new Date().toISOString().slice(0, 10);

  const payload = {
    source: 'PocketWage',
    exportedAt: new Date().toISOString(),
    jurisdiction: {
      countryCode: settings.countryCode,
      countryName: preset.name,
      currencyCode: settings.currencyCode,
      authorityLabel,
    },
    annualSummary: {
      totalPackageInclRetirement: breakdown.annualGrossPackage,
      taxableGrossIncome: breakdown.annualTaxableGross,
      incomeTax: breakdown.annualPaygTax,
      levyLabel: settings.levyLabel,
      levyAmount: breakdown.annualMedicareLevy,
      medicareSurcharge: breakdown.annualMedicareSurcharge,
      hecsHelpRepayment: breakdown.annualHecsRepayment,
      totalTaxAndLevies: breakdown.annualTotalTax,
      effectiveTaxRatePct: Number(breakdown.effectiveTaxRate.toFixed(2)),
      marginalTaxRatePct: breakdown.marginalTaxRate,
      retirementLabel: settings.retirementLabel,
      retirementRatePct: settings.superRate,
      retirementAmount: breakdown.annualSuper,
      privateHealthDeduction: breakdown.annualPhi,
      otherDeductions: breakdown.annualOtherDeductions,
      netCashTakeHome: breakdown.annualNetPocket,
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const filename = `pocketwage-tax-summary-${settings.countryCode.toLowerCase()}-${dateStamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return filename;
}

