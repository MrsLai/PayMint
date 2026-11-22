export interface RetirementProjectionInput {
  startingSavings: number;
  monthlyPersonalSavings: number;
  monthlyEmployerRetirement: number;
  annualReturnPct: number;
  annualInflationPct: number;
  years: number;
}

export interface RetirementYearPoint {
  year: number;
  totalContributions: number;
  personalAdded: number;
  employerAdded: number;
  nominalBalance: number;
  nominalInterest: number;
  realBalance: number;
  realContributions: number;
  realInterest: number;
}

export interface RetirementProjectionResult {
  points: RetirementYearPoint[];
  finalNominal: number;
  finalReal: number;
  totalContributions: number;
  totalPersonalAdded: number;
  totalEmployerAdded: number;
  totalInterestNominal: number;
  totalInterestReal: number;
  interestShareNominalPct: number;
  interestShareRealPct: number;
  monthlyIncome4PctNominal: number;
  monthlyIncome4PctReal: number;
}

export function computeRetirementProjection(
  input: RetirementProjectionInput
): RetirementProjectionResult {
  const years = Math.max(1, Math.min(50, Math.round(input.years || 1)));
  const startingSavings = Math.max(0, input.startingSavings || 0);
  const monthlyPersonal = Math.max(0, input.monthlyPersonalSavings || 0);
  const monthlyEmployer = Math.max(0, input.monthlyEmployerRetirement || 0);
  const monthlyTotal = monthlyPersonal + monthlyEmployer;

  const monthlyRate = Math.max(0, input.annualReturnPct || 0) / 100 / 12;
  const inflationRate = Math.max(0, input.annualInflationPct || 0) / 100;

  const points: RetirementYearPoint[] = [
    {
      year: 0,
      totalContributions: startingSavings,
      personalAdded: 0,
      employerAdded: 0,
      nominalBalance: startingSavings,
      nominalInterest: 0,
      realBalance: startingSavings,
      realContributions: startingSavings,
      realInterest: 0,
    },
  ];

  let balance = startingSavings;
  let totalContributions = startingSavings;
  let personalAdded = 0;
  let employerAdded = 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyTotal;
      totalContributions += monthlyTotal;
      personalAdded += monthlyPersonal;
      employerAdded += monthlyEmployer;
    }

    const discountFactor = Math.pow(1 + inflationRate, y);
    const nominalInterest = Math.max(0, balance - totalContributions);
    const realBalance = balance / discountFactor;
    const realContributions = totalContributions / discountFactor;
    const realInterest = Math.max(0, realBalance - realContributions);

    points.push({
      year: y,
      totalContributions,
      personalAdded,
      employerAdded,
      nominalBalance: balance,
      nominalInterest,
      realBalance,
      realContributions,
      realInterest,
    });
  }

  const last = points[points.length - 1];
  const interestShareNominalPct =
    last.nominalBalance > 0
      ? (last.nominalInterest / last.nominalBalance) * 100
      : 0;
  const interestShareRealPct =
    last.realBalance > 0 ? (last.realInterest / last.realBalance) * 100 : 0;

  return {
    points,
    finalNominal: last.nominalBalance,
    finalReal: last.realBalance,
    totalContributions: last.totalContributions,
    totalPersonalAdded: last.personalAdded,
    totalEmployerAdded: last.employerAdded,
    totalInterestNominal: last.nominalInterest,
    totalInterestReal: last.realInterest,
    interestShareNominalPct,
    interestShareRealPct,
    monthlyIncome4PctNominal: (last.nominalBalance * 0.04) / 12,
    monthlyIncome4PctReal: (last.realBalance * 0.04) / 12,
  };
}
