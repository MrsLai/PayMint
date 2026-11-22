import { getCountryPreset } from '../data/countryPresets';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import {
  getActiveAuthorityLabel,
  getLatestCountryRules,
} from './taxYearRules';

export interface RegulationTooltipCopy {
  title: string;
  subtitle: string;
  description: string;
  formula?: string;
}

export function getRetirementTooltipCopy(
  settings: PaySettings
): RegulationTooltipCopy {
  const preset = getCountryPreset(settings.countryCode);
  const modeNote =
    settings.superMode === 'employer_paid'
      ? `Employer-paid (+ On Top): calculated as ${settings.superRate}% on top of your before-tax gross salary without reducing your cash take-home.`
      : `Included in Total Package: backed out from your total package so taxable gross plus ${settings.superRate}% ${settings.retirementLabel} equals your package amount.`;

  let countryNote = '';
  switch (settings.countryCode) {
    case 'AU':
      countryNote =
        'Under FY 2026–27 Australian Superannuation Guarantee rules, employers contribute 12% of Ordinary Time Earnings (OTE), which includes ordinary hours, casual loading, and ordinary shift penalties, and excludes overtime hours.';
      break;
    case 'NZ':
      countryNote =
        'Default KiwiSaver employer/employee baseline in New Zealand is 3.5% (adjustable if you contribute 4%–10%).';
      break;
    case 'SG':
      countryNote =
        'Reflects Singapore CPF contribution preset (adjustable for age tier or voluntary top-ups).';
      break;
    case 'HK':
      countryNote =
        'Reflects Hong Kong Mandatory Provident Fund (MPF) standard 5% contribution rate.';
      break;
    case 'MY':
      countryNote =
        'Reflects Malaysia EPF (KWSP) retirement contribution rate preset.';
      break;
    case 'VN':
      countryNote =
        'Represents employer/supplementary retirement allocation; statutory 10.5% employee BHXH/BHYT/BHTN is deducted pre-tax under levies.';
      break;
    case 'US':
      countryNote =
        'Models your configurable 401(k) retirement contribution percentage on top of or within your package.';
      break;
    case 'UK':
      countryNote =
        'Models UK workplace pension contributions alongside HMRC PAYE & National Insurance.';
      break;
    default:
      countryNote = `Uses ${preset.name}'s ${settings.retirementLabel} preset (${preset.superRate}% default, editable anytime).`;
  }

  const latest = getLatestCountryRules(settings.countryCode);
  const authorityLabel = getActiveAuthorityLabel(settings);

  return {
    title: `${settings.retirementLabel} (${settings.superRate}%)`,
    subtitle: `${preset.name} · ${authorityLabel}`,
    description: `${countryNote} ${modeNote} (Latest ${latest.taxYearLabel} default: ${latest.superRate}%.)`,
    formula:
      settings.superMode === 'employer_paid'
        ? `${settings.retirementLabel} = Ordinary Time Earnings × ${settings.superRate}%`
        : `Taxable OTE + Overtime + ${settings.retirementLabel} = Total Package`,
  };
}

export function getTaxTooltipCopy(
  settings: PaySettings,
  breakdown?: SalaryBreakdown
): RegulationTooltipCopy {
  const preset = getCountryPreset(settings.countryCode);

  const authorityLabel = getActiveAuthorityLabel(settings);

  let modeDesc = '';
  if (settings.taxMode === 'custom_flat') {
    modeDesc = `Custom Flat Tax Mode: applies a flat ${settings.customFlatTaxRate}% income tax across all taxable gross income.`;
  } else if (settings.taxMode === 'custom_brackets') {
    modeDesc = `Custom Brackets Mode: calculates progressive tax using your ${settings.customBrackets.length} configured marginal brackets.`;
  } else {
    switch (settings.countryCode) {
      case 'AU':
        modeDesc = `Uses ATO FY 2026–27 (15% second bracket) progressive resident brackets ${settings.claimTaxFreeThreshold !== false ? 'with the $18,200 tax-free threshold' : 'without claiming the $18,200 tax-free threshold (PAYG No-Threshold scale)'}${settings.useAtoPaygRounding ? ' and ATO monthly PAYG withholding rounding' : ''}.${settings.hasHecsHelp ? ' Includes marginal HECS-HELP repayment above $69,528.' : ''}${settings.includeMedicareSurcharge && !settings.hasPrivateHealth ? ' Includes Medicare Levy Surcharge above $105,000.' : ''}`;
        break;
      case 'VN':
        modeDesc = `Deducts ${settings.medicareLevyRate}% BHXH/BHYT/BHTN pre-tax plus ₫15.5M/mo personal relief${settings.vnDependents > 0 ? ` and ${settings.vnDependents} × ₫6.2M/mo dependent relief` : ''}, then applies Vietnam's 2026–27 5-tier progressive PIT scale (5%–35%).`;
        break;
      case 'IN':
        modeDesc =
          'Applies India FY 2026–27 New Tax Regime with a ₹75,000 standard deduction, Section 87A zero-tax rebate up to ₹12.75L gross (₹12L taxable), and 4% Health & Education Cess above.';
        break;
      case 'BR':
        modeDesc =
          'Applies Brazil Law 15,270/2025 (2026–27): full IRPF exemption up to R$60,000/yr (R$5,000/mo), linear phase-in to R$88,200/yr, and standard progressive IRPF (7.5%–27.5%) after INSS deduction above.';
        break;
      default:
        modeDesc = `Calculated progressively across ${preset.name}'s ${preset.brackets.length} marginal income tax brackets under ${preset.authorityLabel} (2026–2027).`;
    }
  }

  const levyNote = settings.includeMedicareLevy
    ? preset.levyBrackets && settings.taxMode === 'country_scale'
      ? `${settings.levyLabel} is included using statutory tiered bands/caps.`
      : `${settings.levyLabel} is included at ${settings.medicareLevyRate}%.`
    : `${settings.levyLabel} is currently excluded.`;

  const formula =
    breakdown && breakdown.annualTaxableGross > 0
      ? `Effective Tax Rate: ${breakdown.effectiveTaxRate.toFixed(1)}% · Marginal Tier: ${breakdown.marginalTaxRate}%`
      : `Income Tax + ${settings.levyLabel}${settings.countryCode === 'AU' && settings.hasHecsHelp ? ' + HECS-HELP' : ''}`;

  return {
    title: `Income Tax & ${settings.levyLabel}`,
    subtitle: `${preset.name} · ${authorityLabel}`,
    description: `${modeDesc} ${levyNote}`,
    formula,
  };
}

export function getLevyTooltipCopy(
  settings: PaySettings
): RegulationTooltipCopy {
  const preset = getCountryPreset(settings.countryCode);
  const authorityLabel = getActiveAuthorityLabel(settings);
  const usesTiered =
    settings.taxMode === 'country_scale' &&
    Boolean(preset.levyBrackets && preset.levyBrackets.length > 0);

  return {
    title: settings.levyLabel,
    subtitle: `${preset.name} · ${authorityLabel}`,
    description: usesTiered
      ? `${settings.levyLabel} is calculated using ${preset.name}'s progressive statutory thresholds and contribution caps rather than a single flat rate.`
      : `${settings.levyLabel} is applied at ${settings.medicareLevyRate}% of taxable gross pay${settings.countryCode === 'VN' ? ' and is deducted before Personal Income Tax (PIT)' : ''}.`,
    formula: usesTiered
      ? 'Tiered statutory bands & contribution cap'
      : `Annual Levy = Taxable Gross × ${settings.medicareLevyRate}%`,
  };
}
