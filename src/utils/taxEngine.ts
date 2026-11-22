import { getCountryPreset } from '../data/countryPresets';
import {
  InputFrequency,
  PaySettings,
  PeriodRateRow,
  SalaryBreakdown,
  TaxBracket,
} from '../types/wage';
import { getEffectiveScaleBrackets } from './taxYearRules';

export function computeProgressiveTax(
  annualTaxableIncome: number,
  brackets: TaxBracket[]
): { tax: number; marginalRate: number } {
  const income = Math.max(0, annualTaxableIncome);
  const sorted = [...brackets].sort((a, b) => a.min - b.min);
  if (sorted.length === 0) return { tax: 0, marginalRate: 0 };

  let matched = sorted[0];
  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];
    const inBracket =
      b.max === null ? income >= b.min : income >= b.min && income <= b.max;
    if (inBracket) {
      matched = b;
      break;
    }
  }

  let floorTax = 0;
  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];
    if (b.id === matched.id) break;
    if (b.max !== null) {
      floorTax += Math.max(0, b.max - b.min) * (b.rate / 100);
    }
  }

  const tax =
    floorTax + Math.max(0, income - matched.min) * (matched.rate / 100);
  return { tax, marginalRate: matched.rate };
}

// ATO FY 2026-27 Marginal HECS-HELP Repayment System
export function computeHecsRepayment(annualTaxableIncome: number): number {
  const inc = Math.max(0, annualTaxableIncome);
  if (inc <= 69528) return 0;
  if (inc <= 129717) return (inc - 69528) * 0.15;
  if (inc <= 186050) return 9028 + (inc - 129717) * 0.17;
  return inc * 0.1;
}

// ATO FY 2026-27 Medicare Levy Surcharge (Single thresholds)
export function computeMedicareSurcharge(
  annualTaxableIncome: number,
  hasPrivateHealth: boolean,
  includeSurcharge: boolean
): number {
  if (hasPrivateHealth || !includeSurcharge) return 0;
  if (annualTaxableIncome <= 105000) return 0;
  if (annualTaxableIncome <= 123000) return annualTaxableIncome * 0.01;
  if (annualTaxableIncome <= 164000) return annualTaxableIncome * 0.0125;
  return annualTaxableIncome * 0.015;
}

function computeSocialOrHealthLevy(
  annualTaxableGross: number,
  settings: PaySettings
): number {
  if (!settings.includeMedicareLevy) return 0;
  const countryPreset = getCountryPreset(settings.countryCode);
  if (
    settings.taxMode === 'country_scale' &&
    countryPreset.levyBrackets &&
    countryPreset.levyBrackets.length > 0
  ) {
    return computeProgressiveTax(annualTaxableGross, countryPreset.levyBrackets)
      .tax;
  }
  return annualTaxableGross * (Math.max(0, settings.medicareLevyRate) / 100);
}

export function computeAnnualTaxBundle(
  annualGrossInput: number,
  settings: PaySettings,
  oteFraction = 1
) {
  const safeGross = Math.max(0, annualGrossInput);
  const superDecimal = Math.max(0, settings.superRate) / 100;
  const safeOteFraction = Math.max(0, Math.min(1, oteFraction));
  const isAustralia = settings.countryCode === 'AU';

  let annualTaxableGross = safeGross;
  let annualSuper = safeGross * safeOteFraction * superDecimal;

  if (settings.superMode === 'included_in_package') {
    annualTaxableGross = safeGross / (1 + safeOteFraction * superDecimal);
    annualSuper = safeGross - annualTaxableGross;
  }

  let activeBrackets: TaxBracket[] = settings.customBrackets;
  if (settings.taxMode === 'country_scale') {
    activeBrackets = getEffectiveScaleBrackets(settings);
  }

  let annualPaygTax = 0;
  let marginalTaxRate = 0;
  let annualMedicareLevy = 0;
  let annualMedicareSurcharge = 0;
  let annualHecsRepayment = 0;

  if (
    isAustralia &&
    settings.taxMode === 'country_scale' &&
    settings.useAtoPaygRounding &&
    annualTaxableGross > 0
  ) {
    const monthlyGross = annualTaxableGross / 12;
    const weeklyEquiv = Math.floor((monthlyGross * 3) / 13) + 0.99;
    const annualizedEquiv = weeklyEquiv * 52;

    const eqRes = computeProgressiveTax(annualizedEquiv, activeBrackets);
    marginalTaxRate = eqRes.marginalRate;

    const eqMedicare = settings.includeMedicareLevy
      ? annualizedEquiv * (Math.max(0, settings.medicareLevyRate) / 100)
      : 0;
    const eqSurcharge = computeMedicareSurcharge(
      annualizedEquiv,
      settings.hasPrivateHealth,
      settings.includeMedicareSurcharge
    );
    const eqHecs = settings.hasHecsHelp
      ? computeHecsRepayment(annualizedEquiv)
      : 0;

    const weeklyTotalTax = Math.round(
      (eqRes.tax + eqMedicare + eqSurcharge + eqHecs) / 52
    );
    const monthlyTotalTax = Math.round((weeklyTotalTax * 13) / 3);
    const annualWithheldTotal = monthlyTotalTax * 12;

    annualMedicareLevy = computeSocialOrHealthLevy(
      annualTaxableGross,
      settings
    );
    annualMedicareSurcharge = computeMedicareSurcharge(
      annualTaxableGross,
      settings.hasPrivateHealth,
      settings.includeMedicareSurcharge
    );
    annualHecsRepayment = settings.hasHecsHelp
      ? computeHecsRepayment(annualTaxableGross)
      : 0;
    annualPaygTax = Math.max(
      0,
      annualWithheldTotal -
        annualMedicareLevy -
        annualMedicareSurcharge -
        annualHecsRepayment
    );
  } else {
    annualMedicareLevy = computeSocialOrHealthLevy(
      annualTaxableGross,
      settings
    );

    if (settings.taxMode === 'custom_flat') {
      const rate = Math.max(0, Math.min(100, settings.customFlatTaxRate));
      annualPaygTax = annualTaxableGross * (rate / 100);
      marginalTaxRate = rate;
    } else if (
      settings.countryCode === 'VN' &&
      settings.taxMode === 'country_scale'
    ) {
      const vnSelfDeduction = 186000000; // 15.5M VND/month
      const vnDepDeduction = Math.max(0, settings.vnDependents) * 74400000; // 6.2M VND/month per dependent
      const vnTaxable = Math.max(
        0,
        annualTaxableGross -
          annualMedicareLevy -
          vnSelfDeduction -
          vnDepDeduction
      );
      if (vnTaxable <= 0) {
        annualPaygTax = 0;
        marginalTaxRate = 0;
      } else {
        const res = computeProgressiveTax(vnTaxable, activeBrackets);
        annualPaygTax = res.tax;
        marginalTaxRate = res.marginalRate;
      }
    } else if (
      settings.countryCode === 'IN' &&
      settings.taxMode === 'country_scale'
    ) {
      // FY 2026-27 India New Tax Regime: ₹75,000 standard deduction + Section 87A rebate up to ₹12L taxable (₹12.75L gross) + 4% Cess
      const inTaxable = Math.max(0, annualTaxableGross - 75000);
      if (inTaxable <= 1200000) {
        annualPaygTax = 0;
        marginalTaxRate = 0;
      } else {
        const res = computeProgressiveTax(inTaxable, activeBrackets);
        annualPaygTax = res.tax * 1.04; // includes 4% Health & Education Cess
        marginalTaxRate = res.marginalRate;
      }
    } else if (
      settings.countryCode === 'BR' &&
      settings.taxMode === 'country_scale'
    ) {
      // Brazil 2026-27 Law 15,270/2025: exempt up to R$60,000/yr (R$5k/mo), tapered up to R$88,200/yr, standard IRPF above
      const baseAfterInss = Math.max(0, annualTaxableGross - annualMedicareLevy);
      if (annualTaxableGross <= 60000) {
        annualPaygTax = 0;
        marginalTaxRate = 0;
      } else {
        const stdIrpfBrackets: TaxBracket[] = [
          { id: 'br-std1', min: 0, max: 29145.6, rate: 0, baseTax: 0 },
          { id: 'br-std2', min: 29145.6, max: 33919.8, rate: 7.5, baseTax: 0 },
          { id: 'br-std3', min: 33919.8, max: 45012.6, rate: 15, baseTax: 358.07 },
          { id: 'br-std4', min: 45012.6, max: 55976.16, rate: 22.5, baseTax: 2022.0 },
          { id: 'br-std5', min: 55976.16, max: null, rate: 27.5, baseTax: 4488.8 },
        ];
        const res = computeProgressiveTax(baseAfterInss, stdIrpfBrackets);
        if (annualTaxableGross <= 88200) {
          // Progressive reducer tapering linearly from full relief at R$60k to 0 at R$88.2k
          const phaseInRatio = (annualTaxableGross - 60000) / (88200 - 60000);
          annualPaygTax = res.tax * phaseInRatio;
          marginalTaxRate = res.marginalRate;
        } else {
          annualPaygTax = res.tax;
          marginalTaxRate = res.marginalRate;
        }
      }
    } else {
      const res = computeProgressiveTax(annualTaxableGross, activeBrackets);
      annualPaygTax = res.tax;
      marginalTaxRate = res.marginalRate;
    }

    annualMedicareSurcharge = isAustralia
      ? computeMedicareSurcharge(
          annualTaxableGross,
          settings.hasPrivateHealth,
          settings.includeMedicareSurcharge
        )
      : 0;

    annualHecsRepayment =
      isAustralia && settings.hasHecsHelp
        ? computeHecsRepayment(annualTaxableGross)
        : 0;
  }

  const annualTotalTax =
    annualPaygTax +
    annualMedicareLevy +
    annualMedicareSurcharge +
    annualHecsRepayment;

  const annualAfterTax = annualTaxableGross - annualTotalTax;

  const annualPhi =
    annualTaxableGross > 0 && settings.hasPrivateHealth
      ? Math.max(0, settings.phiMonthlyCost) * 12
      : 0;

  const annualOtherDeductions =
    annualTaxableGross > 0
      ? Math.max(0, settings.otherMonthlyDeduction) * 12
      : 0;

  const annualNetPocket = Math.max(
    0,
    annualAfterTax - annualPhi - annualOtherDeductions
  );

  const effectiveTaxRate =
    annualTaxableGross > 0 ? (annualTotalTax / annualTaxableGross) * 100 : 0;

  return {
    annualTaxableGross,
    annualSuper,
    annualPaygTax,
    annualMedicareLevy,
    annualMedicareSurcharge,
    annualHecsRepayment,
    annualTotalTax,
    annualAfterTax,
    annualPhi,
    annualOtherDeductions,
    annualNetPocket,
    effectiveTaxRate,
    marginalTaxRate,
  };
}

export function resolveSalaryBreakdown(
  settings: PaySettings,
  overrideMode?: InputFrequency,
  overrideAmount?: number
): SalaryBreakdown {
  const mode = overrideMode ?? settings.inputMode;
  const amount = Math.max(0, overrideAmount ?? settings.inputAmount);

  const hoursPerDay = Math.max(0.5, settings.standardHoursPerDay);
  const daysPerWeek = Math.max(1, settings.standardDaysPerWeek);
  const weeksPerYear = Math.max(1, settings.weeksPerYear);
  const standardWeeklyHours = hoursPerDay * daysPerWeek;
  const employmentType = settings.employmentType ?? 'full_time';

  const ordinaryHoursWeekly =
    employmentType === 'full_time'
      ? standardWeeklyHours
      : Math.max(1, settings.agreedWeeklyHours ?? standardWeeklyHours);

  const loadingDecimal =
    employmentType === 'casual' && settings.hasCasualLoading
      ? Math.max(0, Math.min(100, settings.casualLoadingPct ?? 25)) / 100
      : 0;
  const ordLoadedMult = 1 + loadingDecimal;

  const computeEffectiveShiftMult = (baseMult: number): number => {
    const safeMult = Math.max(1, baseMult);
    if (loadingDecimal <= 0) return safeMult;
    if (settings.casualPenaltyMethod === 'cumulative') {
      return 1 + loadingDecimal + Math.max(0, safeMult - 1);
    }
    return ordLoadedMult * safeMult;
  };

  const satHours = Math.max(0, settings.saturdayHoursWeekly ?? 0);
  const sunHours = Math.max(0, settings.sundayHoursWeekly ?? 0);
  const phHours = Math.max(0, settings.publicHolidayHoursWeekly ?? 0);
  const otHours = Math.max(0, settings.overtimeHoursWeekly ?? 0);

  const satMult = computeEffectiveShiftMult(settings.saturdayMultiplier ?? 1.25);
  const sunMult = computeEffectiveShiftMult(settings.sundayMultiplier ?? 1.5);
  const phMult = computeEffectiveShiftMult(
    settings.publicHolidayMultiplier ?? 2.25
  );
  const otMult = computeEffectiveShiftMult(settings.overtimeMultiplier ?? 1.5);

  const ordinaryBaseUnits = ordinaryHoursWeekly;
  const ordinaryLoadingUnits = ordinaryHoursWeekly * loadingDecimal;
  const satUnits = satHours * satMult;
  const sunUnits = sunHours * sunMult;
  const phUnits = phHours * phMult;
  const otUnits = otHours * otMult;

  const oteUnits =
    ordinaryBaseUnits + ordinaryLoadingUnits + satUnits + sunUnits + phUnits;
  const totalPayUnits = Math.max(1, oteUnits + otUnits);
  const oteFraction = oteUnits / totalPayUnits;
  const totalHoursWeekly =
    ordinaryHoursWeekly + satHours + sunHours + phHours + otHours;

  const superDecimal = Math.max(0, settings.superRate) / 100;
  const toPackage = (taxableAnnual: number) =>
    settings.superMode === 'included_in_package'
      ? taxableAnnual * (1 + oteFraction * superDecimal)
      : taxableAnnual;

  let annualGrossPackage = 0;
  if (mode === 'annual') {
    annualGrossPackage = amount;
  } else if (mode === 'monthly') {
    annualGrossPackage = amount * 12;
  } else if (mode === 'fortnightly') {
    annualGrossPackage = toPackage((amount / 2) * weeksPerYear);
  } else if (mode === 'weekly') {
    annualGrossPackage = toPackage(amount * weeksPerYear);
  } else if (mode === 'daily') {
    const dailyFactor = hoursPerDay * ordLoadedMult;
    const weeklyFromDaily = (amount / dailyFactor) * totalPayUnits;
    annualGrossPackage = toPackage(weeklyFromDaily * weeksPerYear);
  } else {
    annualGrossPackage = toPackage(amount * totalPayUnits * weeksPerYear);
  }

  const bundle = computeAnnualTaxBundle(
    annualGrossPackage,
    settings,
    oteFraction
  );
  const baseHourlyRate = bundle.annualTaxableGross / (totalPayUnits * weeksPerYear);
  const effectiveLoadedHourlyRate = baseHourlyRate * ordLoadedMult;
  const dailyGross = effectiveLoadedHourlyRate * hoursPerDay;
  const weeklyGross = bundle.annualTaxableGross / weeksPerYear;
  const fortnightlyGross = weeklyGross * 2;
  const monthlyGross = bundle.annualTaxableGross / 12;

  const ordinaryBaseAnnual = baseHourlyRate * ordinaryBaseUnits * weeksPerYear;
  const casualLoadingAnnual =
    baseHourlyRate * ordinaryLoadingUnits * weeksPerYear;
  const penaltyAnnual =
    baseHourlyRate * (satUnits + sunUnits + phUnits) * weeksPerYear;
  const overtimeAnnual = baseHourlyRate * otUnits * weeksPerYear;
  const ordinaryTimeEarningsAnnual = bundle.annualTaxableGross - overtimeAnnual;

  const proRataRatio =
    employmentType === 'full_time'
      ? 1
      : employmentType === 'part_time'
        ? Math.min(1, ordinaryHoursWeekly / Math.max(1, standardWeeklyHours))
        : 0;
  const annualLeaveHoursPerYear = standardWeeklyHours * 4 * proRataRatio;
  const personalLeaveHoursPerYear = standardWeeklyHours * 2 * proRataRatio;

  const buildRow = (
    period: PeriodRateRow['period'],
    divisor: number
  ): PeriodRateRow => {
    const safeDivisor = Math.max(0.0001, divisor);
    const gross = bundle.annualTaxableGross / safeDivisor;
    const taxAndLevies = bundle.annualTotalTax / safeDivisor;
    const afterTax = bundle.annualAfterTax / safeDivisor;
    const privateHealthAndOther =
      (bundle.annualPhi + bundle.annualOtherDeductions) / safeDivisor;
    const superAmount = bundle.annualSuper / safeDivisor;
    const netPocket = bundle.annualNetPocket / safeDivisor;
    return {
      period,
      gross,
      taxAndLevies,
      afterTax,
      privateHealthAndOther,
      superAmount,
      netPocket,
    };
  };

  const annualTotalHours = totalHoursWeekly * weeksPerYear;
  const dailyDivisor =
    bundle.annualTaxableGross > 0 && dailyGross > 0
      ? bundle.annualTaxableGross / dailyGross
      : daysPerWeek * weeksPerYear;

  const rows: PeriodRateRow[] = [
    buildRow('Hourly', annualTotalHours),
    buildRow('Daily', dailyDivisor),
    buildRow('Weekly', weeksPerYear),
    buildRow('Fortnightly', weeksPerYear / 2),
    buildRow('Monthly', 12),
    buildRow('Annual', 1),
  ];

  return {
    baseHourlyRate,
    effectiveLoadedHourlyRate,
    dailyGross,
    weeklyGross,
    fortnightlyGross,
    monthlyGross,
    ordinaryHoursWeekly,
    totalHoursWeekly,
    ordinaryBaseAnnual,
    casualLoadingAnnual,
    penaltyAnnual,
    overtimeAnnual,
    ordinaryTimeEarningsAnnual,
    annualLeaveHoursPerYear,
    personalLeaveHoursPerYear,
    proRataRatio,
    annualGrossPackage,
    ...bundle,
    rows,
  };
}
