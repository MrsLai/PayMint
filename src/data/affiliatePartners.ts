import { CountryCode } from '../types/wage';

export interface AffiliatePartner {
  id: string;
  name: string;
  tagline: string;
  bestFor: string;
  baseUrl: string;
  envKey: string;
  campaign: string;
}

const env = import.meta.env as Record<string, string | undefined>;

// Keep hidden by default until ready to launch these affiliate programs
export const ENABLE_SUPER_ETF_CALLOUT =
  env.VITE_ENABLE_SUPER_ETF_CALLOUT === 'true';
export const ENABLE_NOVATED_LEASE_PANEL =
  env.VITE_ENABLE_NOVATED_LEASE_PANEL === 'true';
export const ENABLE_TAX_EXPORT_MODAL =
  env.VITE_ENABLE_TAX_EXPORT_MODAL === 'true';

function resolvePartnerBaseUrl(envKey: string, fallbackUrl: string): string {
  const custom = env[envKey]?.trim();
  return custom && custom.length > 0 ? custom : fallbackUrl;
}

function appendQueryParams(
  rawUrl: string,
  params: Record<string, string | number | undefined>
): string {
  try {
    const url = new URL(rawUrl);
    for (const [key, val] of Object.entries(params)) {
      if (val !== undefined && val !== '' && !url.searchParams.has(key)) {
        url.searchParams.set(key, String(val));
      }
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export const SUPER_ETF_PARTNERS: AffiliatePartner[] = [
  {
    id: 'stake-super',
    name: 'Stake Super',
    tagline: 'Low-fee SMSF & direct ASX / US ETF investing',
    bestFor: 'Self-directed super',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_STAKE_SUPER_URL',
      'https://hellostake.com/au/super'
    ),
    envKey: 'VITE_AFFILIATE_STAKE_SUPER_URL',
    campaign: 'super_callout',
  },
  {
    id: 'pearler',
    name: 'Pearler',
    tagline: 'Automated long-term ETF & micro-investing portfolios',
    bestFor: 'Automated ETFs',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_PEARLER_URL',
      'https://pearler.com'
    ),
    envKey: 'VITE_AFFILIATE_PEARLER_URL',
    campaign: 'super_callout',
  },
  {
    id: 'stockspot',
    name: 'Stockspot',
    tagline: 'Automated diversified ETF & super wealth management',
    bestFor: 'Hands-off portfolios',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_STOCKSPOT_URL',
      'https://www.stockspot.com.au'
    ),
    envKey: 'VITE_AFFILIATE_STOCKSPOT_URL',
    campaign: 'super_callout',
  },
];

export const NOVATED_LEASE_PARTNERS: AffiliatePartner[] = [
  {
    id: 'maxxia',
    name: 'Maxxia',
    tagline: 'Salary packaging & novated car lease quotes',
    bestFor: 'Public, health & corporate',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_MAXXIA_URL',
      'https://www.maxxia.com.au/novated-leasing'
    ),
    envKey: 'VITE_AFFILIATE_MAXXIA_URL',
    campaign: 'novated_lease',
  },
  {
    id: 'smartsalary',
    name: 'Smartsalary',
    tagline: 'Pre-tax EV & vehicle novated lease calculator',
    bestFor: 'EV & salary packaging',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_SMARTSALARY_URL',
      'https://www.smartsalary.com.au/novated-leasing'
    ),
    envKey: 'VITE_AFFILIATE_SMARTSALARY_URL',
    campaign: 'novated_lease',
  },
  {
    id: 'whippet',
    name: 'Whippet',
    tagline: 'Transparent self-managed & EV novated leasing',
    bestFor: 'Zero-hassle EV quotes',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_WHIPPET_URL',
      'https://whippet.com.au'
    ),
    envKey: 'VITE_AFFILIATE_WHIPPET_URL',
    campaign: 'novated_lease',
  },
];

export const TAX_SOFTWARE_PARTNERS: AffiliatePartner[] = [
  {
    id: 'hnry',
    name: 'Hnry',
    tagline: 'Automatic tax, super & GST deductions for sole traders',
    bestFor: 'Contractors & freelancers',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_HNRY_URL',
      'https://hnry.com.au'
    ),
    envKey: 'VITE_AFFILIATE_HNRY_URL',
    campaign: 'tax_export',
  },
  {
    id: 'solo',
    name: 'Solo',
    tagline: 'Business account, invoicing & tax tracking for sole traders',
    bestFor: 'Sole traders (AU)',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_SOLO_URL',
      'https://soloapp.co'
    ),
    envKey: 'VITE_AFFILIATE_SOLO_URL',
    campaign: 'tax_export',
  },
  {
    id: 'taxtim',
    name: 'TaxTim',
    tagline: 'Guided digital tax return preparation & deduction checks',
    bestFor: 'Guided tax filing',
    baseUrl: resolvePartnerBaseUrl(
      'VITE_AFFILIATE_TAXTIM_URL',
      'https://www.taxtim.com'
    ),
    envKey: 'VITE_AFFILIATE_TAXTIM_URL',
    campaign: 'tax_export',
  },
];

export function buildSuperPartnerUrl(
  partner: AffiliatePartner,
  context: {
    annualSuper: number;
    annualGross: number;
    currencyCode: string;
    countryCode: CountryCode;
  }
): string {
  return appendQueryParams(partner.baseUrl, {
    utm_source: 'pocketwage',
    utm_medium: 'referral',
    utm_campaign: partner.campaign,
    country: context.countryCode,
    currency: context.currencyCode,
    annual_super:
      context.annualSuper > 0 ? Math.round(context.annualSuper) : undefined,
    annual_gross:
      context.annualGross > 0 ? Math.round(context.annualGross) : undefined,
  });
}

export function buildNovatedPartnerUrl(
  partner: AffiliatePartner,
  context: {
    annualGross: number;
    annualLeaseCost: number;
    vehicleType: 'ev_fbt_exempt' | 'ice_ecm';
    estimatedTaxSaved: number;
    currencyCode: string;
    countryCode: CountryCode;
  }
): string {
  return appendQueryParams(partner.baseUrl, {
    utm_source: 'pocketwage',
    utm_medium: 'referral',
    utm_campaign: partner.campaign,
    country: context.countryCode,
    currency: context.currencyCode,
    gross_salary:
      context.annualGross > 0 ? Math.round(context.annualGross) : undefined,
    lease_budget:
      context.annualLeaseCost > 0
        ? Math.round(context.annualLeaseCost)
        : undefined,
    vehicle_type: context.vehicleType === 'ev_fbt_exempt' ? 'ev' : 'ice',
    est_tax_saved:
      context.estimatedTaxSaved > 0
        ? Math.round(context.estimatedTaxSaved)
        : undefined,
  });
}

export function buildTaxPartnerUrl(
  partner: AffiliatePartner,
  context: {
    annualGross: number;
    annualTax: number;
    annualSuper: number;
    effectiveTaxRate: number;
    currencyCode: string;
    countryCode: CountryCode;
  }
): string {
  return appendQueryParams(partner.baseUrl, {
    utm_source: 'pocketwage',
    utm_medium: 'referral',
    utm_campaign: partner.campaign,
    country: context.countryCode,
    currency: context.currencyCode,
    annual_gross:
      context.annualGross > 0 ? Math.round(context.annualGross) : undefined,
    est_tax: context.annualTax > 0 ? Math.round(context.annualTax) : undefined,
    est_retirement:
      context.annualSuper > 0 ? Math.round(context.annualSuper) : undefined,
    eff_rate:
      context.effectiveTaxRate > 0
        ? context.effectiveTaxRate.toFixed(1)
        : undefined,
  });
}
