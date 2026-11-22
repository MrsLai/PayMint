export type InputFrequency =
  | 'annual'
  | 'monthly'
  | 'fortnightly'
  | 'weekly'
  | 'daily'
  | 'hourly';

export type EmploymentType = 'full_time' | 'part_time' | 'casual';

export type CasualPenaltyMethod = 'compounding' | 'cumulative';

export type TaxMode = 'country_scale' | 'custom_flat' | 'custom_brackets';

export type SuperMode = 'employer_paid' | 'included_in_package';

export type CountryCode =
  | 'AU'
  | 'NZ'
  | 'SG'
  | 'JP'
  | 'KR'
  | 'HK'
  | 'TW'
  | 'MY'
  | 'TH'
  | 'ID'
  | 'PH'
  | 'VN'
  | 'IN'
  | 'CN'
  | 'BR'
  | 'MX'
  | 'CO'
  | 'CL'
  | 'AR'
  | 'PE'
  | 'CR'
  | 'UY'
  | 'UK'
  | 'US'
  | 'CA'
  | 'CUSTOM';

export interface TaxBracket {
  id: string;
  min: number;
  max: number | null;
  rate: number; // percentage e.g. 15 for 15%
  baseTax: number;
}

export interface CountryPreset {
  code: CountryCode;
  name: string;
  region: 'Asia Pacific' | 'Latin America' | 'Other Regions';
  authorityLabel: string;
  currencyCode: string;
  currencySymbol: string;
  standardHoursPerDay: number;
  standardDaysPerWeek: number;
  weeksPerYear: number;
  retirementLabel: string;
  superRate: number;
  superMode: SuperMode;
  levyLabel: string;
  includeLevy: boolean;
  levyRate: number;
  levyBrackets?: TaxBracket[]; // optional tiered levy e.g. UK National Insurance or HK MPF cap
  brackets: TaxBracket[];
  supportsPaygRounding?: boolean;
  supportsHecs?: boolean;
}

export interface PaySettings {
  countryCode: CountryCode;
  currencySymbol: string;
  currencyCode: string;

  // Exchange Rate Converter
  targetCurrency: string; // '' when disabled, or currency code like 'USD', 'THB'
  exchangeRate: number; // 1 baseCurrency = X targetCurrency
  favoriteCurrencies: string[]; // up to 5 pinned target currency codes

  // Core Compensation Input (persisted locally in browser localStorage)
  inputMode: InputFrequency;
  inputAmount: number;

  // Employment Type, Hours & Casual/Penalty/Overtime Rules
  employmentType: EmploymentType;
  hasCasualLoading: boolean;
  casualLoadingPct: number;
  agreedWeeklyHours: number;
  claimTaxFreeThreshold: boolean;
  overtimeHoursWeekly: number;
  overtimeMultiplier: number;
  saturdayHoursWeekly: number;
  saturdayMultiplier: number;
  sundayHoursWeekly: number;
  sundayMultiplier: number;
  publicHolidayHoursWeekly: number;
  publicHolidayMultiplier: number;
  casualPenaltyMethod: CasualPenaltyMethod;

  // Work Schedule Assumptions
  standardHoursPerDay: number;
  standardDaysPerWeek: number;
  weeksPerYear: number;

  // Retirement / Superannuation
  retirementLabel: string;
  superRate: number;
  superMode: SuperMode;

  // Tax & Levies
  autoLatestRules: boolean;
  taxMode: TaxMode;
  atoFinancialYear: '2026-27';
  useAtoPaygRounding: boolean;
  customFlatTaxRate: number;
  customBrackets: TaxBracket[];
  levyLabel: string;
  includeMedicareLevy: boolean;
  medicareLevyRate: number;
  includeMedicareSurcharge: boolean;
  hasHecsHelp: boolean;
  vnDependents: number;

  // Private Health & Other Deductions
  hasPrivateHealth: boolean;
  phiMonthlyCost: number;
  otherMonthlyDeduction: number;
  otherMonthlyDeductionLabel: string;
}

export interface PeriodRateRow {
  period: 'Hourly' | 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Annual';
  gross: number;
  taxAndLevies: number;
  afterTax: number;
  privateHealthAndOther: number;
  superAmount: number;
  netPocket: number;
}

export interface SalaryBreakdown {
  baseHourlyRate: number;
  effectiveLoadedHourlyRate: number;
  dailyGross: number;
  weeklyGross: number;
  fortnightlyGross: number;
  monthlyGross: number;
  ordinaryHoursWeekly: number;
  totalHoursWeekly: number;
  ordinaryBaseAnnual: number;
  casualLoadingAnnual: number;
  penaltyAnnual: number;
  overtimeAnnual: number;
  ordinaryTimeEarningsAnnual: number;
  annualLeaveHoursPerYear: number;
  personalLeaveHoursPerYear: number;
  proRataRatio: number;
  annualGrossPackage: number;
  annualTaxableGross: number;
  annualPaygTax: number;
  annualMedicareLevy: number;
  annualMedicareSurcharge: number;
  annualHecsRepayment: number;
  annualTotalTax: number;
  annualAfterTax: number;
  annualSuper: number;
  annualPhi: number;
  annualOtherDeductions: number;
  annualNetPocket: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  rows: PeriodRateRow[];
}

export interface SavedJobComparison {
  id: string;
  name: string;
  savedAt: string;
  countryCode: CountryCode;
  currencyCode: string;
  currencySymbol: string;
  currentMode: InputFrequency;
  currentAmount: number;
  targetMode: InputFrequency;
  targetAmount: number;
  targetDriver: 'amount' | 'percent';
  targetRaisePct: number;
}
