import { PaySettings } from '../types/wage';
import { getLatestCountryRules } from '../utils/taxYearRules';
import { getCountryPreset } from './countryPresets';

export { ATO_2026_27_BRACKETS } from './countryPresets';

export function createDefaultPaySettings(
  now: Date = new Date()
): PaySettings {
  const auPreset = getCountryPreset('AU');
  const latestAu = getLatestCountryRules('AU', now);

  return {
    countryCode: 'AU',
    currencySymbol: auPreset.currencySymbol,
    currencyCode: auPreset.currencyCode,

    targetCurrency: '',
    exchangeRate: 0.655,
    favoriteCurrencies: [],

    inputMode: 'hourly',
    inputAmount: 0,

    employmentType: 'full_time',
    hasCasualLoading: false,
    casualLoadingPct: 25,
    agreedWeeklyHours: 24,
    claimTaxFreeThreshold: true,
    overtimeHoursWeekly: 0,
    overtimeMultiplier: 1.5,
    saturdayHoursWeekly: 0,
    saturdayMultiplier: 1.25,
    sundayHoursWeekly: 0,
    sundayMultiplier: 1.5,
    publicHolidayHoursWeekly: 0,
    publicHolidayMultiplier: 2.25,
    casualPenaltyMethod: 'compounding',

    standardHoursPerDay: auPreset.standardHoursPerDay,
    standardDaysPerWeek: auPreset.standardDaysPerWeek,
    weeksPerYear: auPreset.weeksPerYear,

    retirementLabel: auPreset.retirementLabel,
    superRate: latestAu.superRate,
    superMode: latestAu.superMode,

    autoLatestRules: true,
    taxMode: 'country_scale',
    atoFinancialYear: latestAu.atoFinancialYear,
    useAtoPaygRounding: true,
    customFlatTaxRate: 24,
    customBrackets: latestAu.brackets,
    levyLabel: auPreset.levyLabel,
    includeMedicareLevy: latestAu.includeMedicareLevy,
    medicareLevyRate: latestAu.levyRate,
    includeMedicareSurcharge: false,
    hasHecsHelp: false,
    vnDependents: 0,

    hasPrivateHealth: false,
    phiMonthlyCost: 148,
    otherMonthlyDeduction: 0,
    otherMonthlyDeductionLabel: 'Other Deduction',
  };
}

export const DEFAULT_PAY_SETTINGS: PaySettings = createDefaultPaySettings();
