import {
  ATO_2026_27_BRACKETS,
  ATO_2026_27_NO_THRESHOLD_BRACKETS,
  getCountryPreset,
} from '../data/countryPresets';
import { CountryCode, PaySettings, TaxBracket } from '../types/wage';

export type AtoFinancialYear = '2026-27';

/**
 * Resolves the latest Australian financial year based on the current date.
 * Australian financial years run from 1 July to 30 June.
 */
export function getLatestAtoFinancialYear(
  _now: Date = new Date()
): AtoFinancialYear {
  return '2026-27';
}

/**
 * Resolves the statutory Australian Superannuation Guarantee rate (12% from 1 July 2025 onward).
 */
export function getLatestAuSuperRate(_now: Date = new Date()): number {
  return 12;
}

/**
 * Returns the latest active tax year label for a given jurisdiction.
 */
export function getLatestTaxYearLabel(
  countryCode: CountryCode,
  _now: Date = new Date()
): string {
  if (countryCode === 'AU' || countryCode === 'IN') {
    return 'FY 2026–27';
  }
  if (countryCode === 'SG') {
    return 'YA 2026–27';
  }
  return '2026–27';
}

/**
 * Returns the latest available year's brackets for a jurisdiction.
 */
export function getEffectiveScaleBrackets(
  settings: Pick<PaySettings, 'countryCode' | 'claimTaxFreeThreshold'>
): TaxBracket[] {
  if (settings.countryCode === 'AU') {
    return settings.claimTaxFreeThreshold === false
      ? ATO_2026_27_NO_THRESHOLD_BRACKETS
      : ATO_2026_27_BRACKETS;
  }
  return getCountryPreset(settings.countryCode).brackets;
}

/**
 * Returns the latest statutory tax & retirement rule snapshot for a country
 * at the current date.
 */
export function getLatestCountryRules(
  countryCode: CountryCode,
  now: Date = new Date()
) {
  const preset = getCountryPreset(countryCode);
  const atoFinancialYear = getLatestAtoFinancialYear(now);
  const superRate =
    countryCode === 'AU' ? getLatestAuSuperRate(now) : preset.superRate;
  const brackets =
    countryCode === 'AU' ? ATO_2026_27_BRACKETS : preset.brackets;

  return {
    atoFinancialYear,
    superRate,
    superMode: preset.superMode,
    levyRate: preset.levyRate,
    includeMedicareLevy: preset.includeLevy,
    brackets,
    taxYearLabel: getLatestTaxYearLabel(countryCode, now),
  };
}

/**
 * Returns the human-readable tax authority & active year label for display.
 */
export function getActiveAuthorityLabel(
  settings: Pick<PaySettings, 'countryCode' | 'taxMode'>
): string {
  const preset = getCountryPreset(settings.countryCode);
  if (settings.countryCode === 'AU' && settings.taxMode === 'country_scale') {
    return 'ATO Resident Tax (FY 2026–27)';
  }
  return preset.authorityLabel;
}
