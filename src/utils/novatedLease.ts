import { PaySettings, SalaryBreakdown } from '../types/wage';
import { computeAnnualTaxBundle } from './taxEngine';

export type NovatedVehicleType = 'ev_fbt_exempt' | 'ice_ecm';

export interface NovatedLeaseEstimate {
  annualLeaseCost: number;
  vehicleType: NovatedVehicleType;
  preTaxDeduction: number;
  postTaxDeduction: number;
  baselineTaxableGross: number;
  packagedTaxableGross: number;
  baselineTotalTax: number;
  packagedTotalTax: number;
  annualTaxSaved: number;
  netOutOfPocketAnnual: number;
  monthlyNetPayDifference: number;
  taxSavingsPctOfLease: number;
}

/**
 * Estimates pre-tax novated lease savings by reducing taxable gross income
 * using PayMint's active country tax engine.
 * - EV (FBT-Exempt): 100% of eligible lease & running budget treated as pre-tax.
 * - Petrol / Hybrid (ECM): ~60% pre-tax, ~40% post-tax Employee Contribution Method estimate.
 */
export function computeNovatedLeaseEstimate(
  settings: PaySettings,
  breakdown: SalaryBreakdown,
  annualLeaseCost: number,
  vehicleType: NovatedVehicleType
): NovatedLeaseEstimate {
  const safeLease = Math.max(0, annualLeaseCost);
  const baselineTaxableGross = Math.max(0, breakdown.annualTaxableGross);
  const preTaxShare = vehicleType === 'ev_fbt_exempt' ? 1.0 : 0.6;
  const rawPreTax = safeLease * preTaxShare;
  const preTaxDeduction = Math.min(baselineTaxableGross, rawPreTax);
  const postTaxDeduction = Math.max(0, safeLease - preTaxDeduction);

  const packagedTaxableGross = Math.max(
    0,
    baselineTaxableGross - preTaxDeduction
  );

  // Evaluate tax on the reduced taxable gross without shrinking employer super contribution
  const packagedSettings: PaySettings = {
    ...settings,
    superMode: 'employer_paid',
  };
  const packagedBundle = computeAnnualTaxBundle(
    packagedTaxableGross,
    packagedSettings
  );

  const baselineTotalTax = breakdown.annualTotalTax;
  const packagedTotalTax = packagedBundle.annualTotalTax;
  const annualTaxSaved = Math.max(0, baselineTotalTax - packagedTotalTax);
  const netOutOfPocketAnnual = Math.max(0, safeLease - annualTaxSaved);

  const baselineNet = breakdown.annualNetPocket;
  const packagedNet = Math.max(
    0,
    packagedTaxableGross -
      packagedTotalTax -
      breakdown.annualPhi -
      breakdown.annualOtherDeductions -
      postTaxDeduction
  );

  const monthlyNetPayDifference = (packagedNet - baselineNet) / 12;
  const taxSavingsPctOfLease =
    safeLease > 0 ? (annualTaxSaved / safeLease) * 100 : 0;

  return {
    annualLeaseCost: safeLease,
    vehicleType,
    preTaxDeduction,
    postTaxDeduction,
    baselineTaxableGross,
    packagedTaxableGross,
    baselineTotalTax,
    packagedTotalTax,
    annualTaxSaved,
    netOutOfPocketAnnual,
    monthlyNetPayDifference,
    taxSavingsPctOfLease,
  };
}
