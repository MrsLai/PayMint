import { onAuthStateChanged, User } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCountryPreset } from '../data/countryPresets';
import { createDefaultPaySettings } from '../data/defaults';
import {
  auth,
  ensureAppCheckActive,
  signInWithGoogle,
  signOutFromGoogle,
} from '../firebase';
import {
  buildCloudWorkspaceFields,
  clearCloudComparisons,
  deleteCloudComparison,
  fetchCloudWorkspace,
  saveCloudComparison,
  saveCloudWorkspace,
  subscribeCloudComparisons,
} from '../services/cloudSyncService';
import {
  CasualPenaltyMethod,
  CountryCode,
  EmploymentType,
  InputFrequency,
  PaySettings,
  SavedJobComparison,
} from '../types/wage';
import { resolveSalaryBreakdown } from '../utils/taxEngine';
import { getLatestCountryRules } from '../utils/taxYearRules';

export type CloudSyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

const SALARY_STATE_STORAGE_KEY = 'paymint_salary_state_v1';
const SAVED_COMPARISONS_STORAGE_KEY = 'paymint_saved_comparisons_v1';
const CLOUD_SYNC_OPT_IN_KEY = 'paymint_cloud_sync_opt_in_v1';
const MAX_SAVED_COMPARISONS = 25;

const LEGACY_KEYS = [
  'wageflow_settings_v4',
  'wageflow_app_state_v3',
  'wageflow_app_state_v2',
  'wageflow_app_state_v1',
];

const VALID_FREQUENCIES: ReadonlySet<InputFrequency> = new Set([
  'annual',
  'monthly',
  'fortnightly',
  'weekly',
  'daily',
  'hourly',
]);

interface PersistedWorkspaceState {
  settings: PaySettings;
  compareCurrentMode: InputFrequency;
  compareCurrentAmount: number;
  compareTargetMode: InputFrequency;
  compareTargetAmount: number;
  compareTargetDriver: 'amount' | 'percent';
  compareTargetRaisePct: number;
  retirementStartingSavings: number;
  retirementSavingsRatePct: number;
  retirementIncludeEmployer: boolean;
  retirementAnnualReturnPct: number;
  retirementAnnualInflationPct: number;
  retirementYears: number;
  retirementValueMode: 'nominal' | 'real';
}

function sanitizeFiniteNumber(
  value: unknown,
  fallback: number,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function sanitizeFrequency(
  value: unknown,
  fallback: InputFrequency
): InputFrequency {
  return typeof value === 'string' &&
    VALID_FREQUENCIES.has(value as InputFrequency)
    ? (value as InputFrequency)
    : fallback;
}

function sanitizeEmploymentType(
  value: unknown,
  fallback: EmploymentType
): EmploymentType {
  return value === 'full_time' || value === 'part_time' || value === 'casual'
    ? value
    : fallback;
}

function sanitizeCasualPenaltyMethod(
  value: unknown,
  fallback: CasualPenaltyMethod
): CasualPenaltyMethod {
  return value === 'compounding' || value === 'cumulative' ? value : fallback;
}

function createInitialWorkspaceState(): PersistedWorkspaceState {
  const defaultSettings = createDefaultPaySettings(new Date());
  const defaults: PersistedWorkspaceState = {
    settings: defaultSettings,
    compareCurrentMode: 'hourly',
    compareCurrentAmount: 0,
    compareTargetMode: 'hourly',
    compareTargetAmount: 0,
    compareTargetDriver: 'amount',
    compareTargetRaisePct: 0,
    retirementStartingSavings: 0,
    retirementSavingsRatePct: 20,
    retirementIncludeEmployer: true,
    retirementAnnualReturnPct: 7.0,
    retirementAnnualInflationPct: 2.5,
    retirementYears: 25,
    retirementValueMode: 'nominal',
  };

  try {
    const raw = localStorage.getItem(SALARY_STATE_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<PersistedWorkspaceState>;
    if (!parsed || typeof parsed !== 'object') return defaults;

    const rawSettings = (parsed.settings ?? {}) as Partial<PaySettings>;
    const preset = getCountryPreset(
      (rawSettings.countryCode as CountryCode) ?? defaultSettings.countryCode
    );
    const mergedSettings: PaySettings = {
      ...defaultSettings,
      ...rawSettings,
      countryCode: preset.code,
      currencyCode:
        typeof rawSettings.currencyCode === 'string' && rawSettings.currencyCode
          ? rawSettings.currencyCode
          : preset.currencyCode,
      currencySymbol:
        typeof rawSettings.currencySymbol === 'string' &&
        rawSettings.currencySymbol
          ? rawSettings.currencySymbol
          : preset.currencySymbol,
      inputMode: sanitizeFrequency(
        rawSettings.inputMode,
        defaultSettings.inputMode
      ),
      inputAmount: sanitizeFiniteNumber(rawSettings.inputAmount, 0),
      employmentType: sanitizeEmploymentType(
        rawSettings.employmentType,
        defaultSettings.employmentType
      ),
      hasCasualLoading:
        typeof rawSettings.hasCasualLoading === 'boolean'
          ? rawSettings.hasCasualLoading
          : defaultSettings.hasCasualLoading,
      casualLoadingPct: sanitizeFiniteNumber(
        rawSettings.casualLoadingPct,
        defaultSettings.casualLoadingPct,
        0,
        100
      ),
      agreedWeeklyHours: sanitizeFiniteNumber(
        rawSettings.agreedWeeklyHours,
        defaultSettings.agreedWeeklyHours,
        1,
        80
      ),
      claimTaxFreeThreshold:
        typeof rawSettings.claimTaxFreeThreshold === 'boolean'
          ? rawSettings.claimTaxFreeThreshold
          : defaultSettings.claimTaxFreeThreshold,
      overtimeHoursWeekly: sanitizeFiniteNumber(
        rawSettings.overtimeHoursWeekly,
        0,
        0,
        100
      ),
      overtimeMultiplier: sanitizeFiniteNumber(
        rawSettings.overtimeMultiplier,
        defaultSettings.overtimeMultiplier,
        1,
        10
      ),
      saturdayHoursWeekly: sanitizeFiniteNumber(
        rawSettings.saturdayHoursWeekly,
        0,
        0,
        100
      ),
      saturdayMultiplier: sanitizeFiniteNumber(
        rawSettings.saturdayMultiplier,
        defaultSettings.saturdayMultiplier,
        1,
        10
      ),
      sundayHoursWeekly: sanitizeFiniteNumber(
        rawSettings.sundayHoursWeekly,
        0,
        0,
        100
      ),
      sundayMultiplier: sanitizeFiniteNumber(
        rawSettings.sundayMultiplier,
        defaultSettings.sundayMultiplier,
        1,
        10
      ),
      publicHolidayHoursWeekly: sanitizeFiniteNumber(
        rawSettings.publicHolidayHoursWeekly,
        0,
        0,
        100
      ),
      publicHolidayMultiplier: sanitizeFiniteNumber(
        rawSettings.publicHolidayMultiplier,
        defaultSettings.publicHolidayMultiplier,
        1,
        10
      ),
      casualPenaltyMethod: sanitizeCasualPenaltyMethod(
        rawSettings.casualPenaltyMethod,
        defaultSettings.casualPenaltyMethod
      ),
      standardHoursPerDay: sanitizeFiniteNumber(
        rawSettings.standardHoursPerDay,
        preset.standardHoursPerDay,
        1,
        24
      ),
      standardDaysPerWeek: sanitizeFiniteNumber(
        rawSettings.standardDaysPerWeek,
        preset.standardDaysPerWeek,
        1,
        7
      ),
      weeksPerYear: sanitizeFiniteNumber(
        rawSettings.weeksPerYear,
        preset.weeksPerYear,
        1,
        53
      ),
      superRate: sanitizeFiniteNumber(
        rawSettings.superRate,
        preset.superRate,
        0,
        100
      ),
      exchangeRate: sanitizeFiniteNumber(
        rawSettings.exchangeRate,
        defaultSettings.exchangeRate,
        0.000001
      ),
      favoriteCurrencies: Array.isArray(rawSettings.favoriteCurrencies)
        ? rawSettings.favoriteCurrencies
            .filter((c): c is string => typeof c === 'string')
            .slice(0, 5)
        : defaultSettings.favoriteCurrencies,
      customBrackets: Array.isArray(rawSettings.customBrackets)
        ? rawSettings.customBrackets
        : defaultSettings.customBrackets,
      phiMonthlyCost: sanitizeFiniteNumber(
        rawSettings.phiMonthlyCost,
        defaultSettings.phiMonthlyCost
      ),
      otherMonthlyDeduction: sanitizeFiniteNumber(
        rawSettings.otherMonthlyDeduction,
        0
      ),
      vnDependents: sanitizeFiniteNumber(rawSettings.vnDependents, 0, 0, 20),
    };

    if (mergedSettings.autoLatestRules) {
      const latest = getLatestCountryRules(
        mergedSettings.countryCode,
        new Date()
      );
      mergedSettings.atoFinancialYear = latest.atoFinancialYear;
    }

    return {
      settings: mergedSettings,
      compareCurrentMode: sanitizeFrequency(
        parsed.compareCurrentMode,
        defaults.compareCurrentMode
      ),
      compareCurrentAmount: sanitizeFiniteNumber(
        parsed.compareCurrentAmount,
        0
      ),
      compareTargetMode: sanitizeFrequency(
        parsed.compareTargetMode,
        defaults.compareTargetMode
      ),
      compareTargetAmount: sanitizeFiniteNumber(parsed.compareTargetAmount, 0),
      compareTargetDriver:
        parsed.compareTargetDriver === 'percent' ? 'percent' : 'amount',
      compareTargetRaisePct: sanitizeFiniteNumber(
        parsed.compareTargetRaisePct,
        0,
        -99,
        500
      ),
      retirementStartingSavings: sanitizeFiniteNumber(
        parsed.retirementStartingSavings,
        0
      ),
      retirementSavingsRatePct: sanitizeFiniteNumber(
        parsed.retirementSavingsRatePct,
        20,
        0,
        100
      ),
      retirementIncludeEmployer:
        typeof parsed.retirementIncludeEmployer === 'boolean'
          ? parsed.retirementIncludeEmployer
          : true,
      retirementAnnualReturnPct: sanitizeFiniteNumber(
        parsed.retirementAnnualReturnPct,
        7.0,
        0,
        30
      ),
      retirementAnnualInflationPct: sanitizeFiniteNumber(
        parsed.retirementAnnualInflationPct,
        2.5,
        0,
        25
      ),
      retirementYears: sanitizeFiniteNumber(parsed.retirementYears, 25, 1, 50),
      retirementValueMode:
        parsed.retirementValueMode === 'real' ? 'real' : 'nominal',
    };
  } catch {
    return defaults;
  }
}

function loadInitialSavedComparisons(): SavedJobComparison[] {
  try {
    const raw = localStorage.getItem(SAVED_COMPARISONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is SavedJobComparison =>
          Boolean(item) &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.countryCode === 'string'
      )
      .slice(0, MAX_SAVED_COMPARISONS)
      .map((item) => {
        const preset = getCountryPreset(item.countryCode);
        return {
          id: item.id,
          name: item.name,
          savedAt:
            typeof item.savedAt === 'string'
              ? item.savedAt
              : new Date().toISOString(),
          countryCode: preset.code,
          currencyCode:
            typeof item.currencyCode === 'string' && item.currencyCode
              ? item.currencyCode
              : preset.currencyCode,
          currencySymbol:
            typeof item.currencySymbol === 'string' && item.currencySymbol
              ? item.currencySymbol
              : preset.currencySymbol,
          currentMode: sanitizeFrequency(item.currentMode, 'annual'),
          currentAmount: sanitizeFiniteNumber(item.currentAmount, 0),
          targetMode: sanitizeFrequency(item.targetMode, 'annual'),
          targetAmount: sanitizeFiniteNumber(item.targetAmount, 0),
          targetDriver:
            item.targetDriver === 'percent' ? 'percent' : 'amount',
          targetRaisePct: sanitizeFiniteNumber(
            item.targetRaisePct,
            0,
            -99,
            500
          ),
        };
      });
  } catch {
    return [];
  }
}

function formatFirebaseSyncError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error ?? '');
  if (
    raw.includes('Quota exceeded') ||
    raw.includes('resource-exhausted') ||
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.includes('Free daily')
  ) {
    return 'Free Firebase Spark daily quota reached. Your data remains saved locally in this browser until the daily quota resets (or upgrade to Blaze in Firebase Console).';
  }
  if (raw.includes('permission-denied') || raw.includes('PERMISSION_DENIED')) {
    return 'Cloud sync permission denied. Please verify your Google account email and sign in again.';
  }
  return 'Unable to sync right now. Changes remain saved locally in this browser.';
}

export function useWageStore() {
  const initial = useMemo(() => createInitialWorkspaceState(), []);

  const [settings, setSettings] = useState<PaySettings>(initial.settings);
  const [compareCurrentMode, setCompareCurrentMode] = useState<InputFrequency>(
    initial.compareCurrentMode
  );
  const [compareCurrentAmount, setCompareCurrentAmount] = useState<number>(
    initial.compareCurrentAmount
  );
  const [compareTargetMode, setCompareTargetMode] = useState<InputFrequency>(
    initial.compareTargetMode
  );
  const [compareTargetAmount, setCompareTargetAmount] = useState<number>(
    initial.compareTargetAmount
  );
  const [compareTargetDriver, setCompareTargetDriver] = useState<
    'amount' | 'percent'
  >(initial.compareTargetDriver);
  const [compareTargetRaisePct, setCompareTargetRaisePct] = useState<number>(
    initial.compareTargetRaisePct
  );
  const [retirementStartingSavings, setRetirementStartingSavings] =
    useState<number>(initial.retirementStartingSavings);
  const [retirementSavingsRatePct, setRetirementSavingsRatePct] =
    useState<number>(initial.retirementSavingsRatePct);
  const [retirementIncludeEmployer, setRetirementIncludeEmployer] =
    useState<boolean>(initial.retirementIncludeEmployer);
  const [retirementAnnualReturnPct, setRetirementAnnualReturnPct] =
    useState<number>(initial.retirementAnnualReturnPct);
  const [retirementAnnualInflationPct, setRetirementAnnualInflationPct] =
    useState<number>(initial.retirementAnnualInflationPct);
  const [retirementYears, setRetirementYears] = useState<number>(
    initial.retirementYears
  );
  const [retirementValueMode, setRetirementValueMode] = useState<
    'nominal' | 'real'
  >(initial.retirementValueMode);

  const [savedComparisons, setSavedComparisons] = useState<
    SavedJobComparison[]
  >(loadInitialSavedComparisons);

  // Explicit opt-in Cross-Device Sync state (disabled & 100% local-first by default)
  const [cloudSyncRequested, setCloudSyncRequested] = useState<boolean>(() => {
    try {
      return localStorage.getItem(CLOUD_SYNC_OPT_IN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] =
    useState<CloudSyncStatus>('idle');
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const hasCloudWorkspaceDocRef = useRef<boolean>(false);
  const workspaceInitDoneRef = useRef<boolean>(false);
  const lastSyncedJsonRef = useRef<string>('');
  const reconciledComparisonsUidRef = useRef<string | null>(null);
  const cloudComparisonIdsRef = useRef<Set<string>>(new Set());
  const savedComparisonsRef = useRef<SavedJobComparison[]>(savedComparisons);
  savedComparisonsRef.current = savedComparisons;

  const settingsRef = useRef<PaySettings>(settings);
  settingsRef.current = settings;

  const workspacePayload = useMemo(
    () =>
      buildCloudWorkspaceFields(settings, {
        compareCurrentMode,
        compareCurrentAmount,
        compareTargetMode,
        compareTargetAmount,
        compareTargetDriver,
        compareTargetRaisePct,
        retirementStartingSavings,
        retirementSavingsRatePct,
        retirementIncludeEmployer,
        retirementAnnualReturnPct,
        retirementAnnualInflationPct,
        retirementYears,
        retirementValueMode,
      }),
    [
      settings,
      compareCurrentMode,
      compareCurrentAmount,
      compareTargetMode,
      compareTargetAmount,
      compareTargetDriver,
      compareTargetRaisePct,
      retirementStartingSavings,
      retirementSavingsRatePct,
      retirementIncludeEmployer,
      retirementAnnualReturnPct,
      retirementAnnualInflationPct,
      retirementYears,
      retirementValueMode,
    ]
  );

  const workspaceJson = useMemo(
    () => JSON.stringify(workspacePayload),
    [workspacePayload]
  );

  const workspacePayloadRef = useRef(workspacePayload);
  workspacePayloadRef.current = workspacePayload;
  const workspaceJsonRef = useRef(workspaceJson);
  workspaceJsonRef.current = workspaceJson;

  // Clean up any legacy storage entries if present
  useEffect(() => {
    try {
      for (const k of LEGACY_KEYS) {
        localStorage.removeItem(k);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  // Listen for Firebase Auth state (passive listener — never opens any sign-in popup)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCloudUser(user);
      if (!user) {
        hasCloudWorkspaceDocRef.current = false;
        workspaceInitDoneRef.current = false;
        lastSyncedJsonRef.current = '';
        reconciledComparisonsUidRef.current = null;
        cloudComparisonIdsRef.current = new Set();
        setCloudSyncStatus('idle');
        setLastSyncedAt(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Persist opt-in flag in localStorage
  useEffect(() => {
    try {
      if (cloudSyncRequested) {
        localStorage.setItem(CLOUD_SYNC_OPT_IN_KEY, '1');
      } else {
        localStorage.removeItem(CLOUD_SYNC_OPT_IN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, [cloudSyncRequested]);

  // Hydrate workspace & subscribe to saved comparisons ONLY when user explicitly opted in & signed in
  useEffect(() => {
    if (!cloudUser || !cloudSyncRequested) {
      workspaceInitDoneRef.current = false;
      return;
    }

    const uid = cloudUser.uid;
    let cancelled = false;
    setCloudSyncStatus('syncing');
    setCloudSyncError(null);

    (async () => {
      try {
        await ensureAppCheckActive();
        if (cancelled) return;
        const cloudWs = await fetchCloudWorkspace(uid);
        if (cancelled) return;

        if (cloudWs) {
          hasCloudWorkspaceDocRef.current = true;
          const preset = getCountryPreset(cloudWs.countryCode);
          const latest = getLatestCountryRules(preset.code, new Date());
          const prevSettings = settingsRef.current;

          const nextSettings: PaySettings = {
            ...prevSettings,
            countryCode: preset.code,
            currencyCode: cloudWs.currencyCode || preset.currencyCode,
            currencySymbol: cloudWs.currencySymbol || preset.currencySymbol,
            inputMode: sanitizeFrequency(
              cloudWs.inputMode,
              prevSettings.inputMode
            ),
            inputAmount: sanitizeFiniteNumber(cloudWs.inputAmount, 0),
            employmentType: sanitizeEmploymentType(
              cloudWs.employmentType,
              prevSettings.employmentType
            ),
            hasCasualLoading:
              typeof cloudWs.hasCasualLoading === 'boolean'
                ? cloudWs.hasCasualLoading
                : prevSettings.hasCasualLoading,
            casualLoadingPct: sanitizeFiniteNumber(
              cloudWs.casualLoadingPct,
              prevSettings.casualLoadingPct,
              0,
              100
            ),
            agreedWeeklyHours: sanitizeFiniteNumber(
              cloudWs.agreedWeeklyHours,
              prevSettings.agreedWeeklyHours,
              1,
              80
            ),
            claimTaxFreeThreshold:
              typeof cloudWs.claimTaxFreeThreshold === 'boolean'
                ? cloudWs.claimTaxFreeThreshold
                : prevSettings.claimTaxFreeThreshold,
            overtimeHoursWeekly: sanitizeFiniteNumber(
              cloudWs.overtimeHoursWeekly,
              prevSettings.overtimeHoursWeekly,
              0,
              100
            ),
            overtimeMultiplier: sanitizeFiniteNumber(
              cloudWs.overtimeMultiplier,
              prevSettings.overtimeMultiplier,
              1,
              10
            ),
            saturdayHoursWeekly: sanitizeFiniteNumber(
              cloudWs.saturdayHoursWeekly,
              prevSettings.saturdayHoursWeekly,
              0,
              100
            ),
            saturdayMultiplier: sanitizeFiniteNumber(
              cloudWs.saturdayMultiplier,
              prevSettings.saturdayMultiplier,
              1,
              10
            ),
            sundayHoursWeekly: sanitizeFiniteNumber(
              cloudWs.sundayHoursWeekly,
              prevSettings.sundayHoursWeekly,
              0,
              100
            ),
            sundayMultiplier: sanitizeFiniteNumber(
              cloudWs.sundayMultiplier,
              prevSettings.sundayMultiplier,
              1,
              10
            ),
            publicHolidayHoursWeekly: sanitizeFiniteNumber(
              cloudWs.publicHolidayHoursWeekly,
              prevSettings.publicHolidayHoursWeekly,
              0,
              100
            ),
            publicHolidayMultiplier: sanitizeFiniteNumber(
              cloudWs.publicHolidayMultiplier,
              prevSettings.publicHolidayMultiplier,
              1,
              10
            ),
            casualPenaltyMethod: sanitizeCasualPenaltyMethod(
              cloudWs.casualPenaltyMethod,
              prevSettings.casualPenaltyMethod
            ),
            targetCurrency: cloudWs.targetCurrency ?? '',
            exchangeRate: sanitizeFiniteNumber(
              cloudWs.exchangeRate,
              prevSettings.exchangeRate,
              0.000001
            ),
            favoriteCurrencies: Array.isArray(cloudWs.favoriteCurrencies)
              ? cloudWs.favoriteCurrencies.slice(0, 5)
              : prevSettings.favoriteCurrencies,
            standardHoursPerDay: sanitizeFiniteNumber(
              cloudWs.standardHoursPerDay,
              preset.standardHoursPerDay,
              1,
              24
            ),
            standardDaysPerWeek: sanitizeFiniteNumber(
              cloudWs.standardDaysPerWeek,
              preset.standardDaysPerWeek,
              1,
              7
            ),
            weeksPerYear: sanitizeFiniteNumber(
              cloudWs.weeksPerYear,
              preset.weeksPerYear,
              1,
              53
            ),
            retirementLabel:
              cloudWs.retirementLabel || preset.retirementLabel,
            superRate: sanitizeFiniteNumber(
              cloudWs.superRate,
              latest.superRate,
              0,
              100
            ),
            superMode: cloudWs.superMode ?? latest.superMode,
            taxMode: cloudWs.taxMode ?? prevSettings.taxMode,
            atoFinancialYear: latest.atoFinancialYear,
            levyLabel: preset.levyLabel,
            includeMedicareLevy: latest.includeMedicareLevy,
            medicareLevyRate: latest.levyRate,
            customBrackets:
              cloudWs.taxMode === 'country_scale' ||
              preset.code !== prevSettings.countryCode
                ? latest.brackets
                : prevSettings.customBrackets,
          };

          const nextExtras = {
            compareCurrentMode: sanitizeFrequency(
              cloudWs.compareCurrentMode,
              'hourly'
            ),
            compareCurrentAmount: sanitizeFiniteNumber(
              cloudWs.compareCurrentAmount,
              0
            ),
            compareTargetMode: sanitizeFrequency(
              cloudWs.compareTargetMode,
              'hourly'
            ),
            compareTargetAmount: sanitizeFiniteNumber(
              cloudWs.compareTargetAmount,
              0
            ),
            compareTargetDriver:
              cloudWs.compareTargetDriver === 'percent'
                ? ('percent' as const)
                : ('amount' as const),
            compareTargetRaisePct: sanitizeFiniteNumber(
              cloudWs.compareTargetRaisePct,
              0,
              -99,
              500
            ),
            retirementStartingSavings: sanitizeFiniteNumber(
              cloudWs.retirementStartingSavings,
              0
            ),
            retirementSavingsRatePct: sanitizeFiniteNumber(
              cloudWs.retirementSavingsRatePct,
              20,
              0,
              100
            ),
            retirementIncludeEmployer:
              typeof cloudWs.retirementIncludeEmployer === 'boolean'
                ? cloudWs.retirementIncludeEmployer
                : true,
            retirementAnnualReturnPct: sanitizeFiniteNumber(
              cloudWs.retirementAnnualReturnPct,
              7,
              0,
              30
            ),
            retirementAnnualInflationPct: sanitizeFiniteNumber(
              cloudWs.retirementAnnualInflationPct,
              2.5,
              0,
              25
            ),
            retirementYears: sanitizeFiniteNumber(
              cloudWs.retirementYears,
              25,
              1,
              50
            ),
            retirementValueMode:
              cloudWs.retirementValueMode === 'real'
                ? ('real' as const)
                : ('nominal' as const),
          };

          lastSyncedJsonRef.current = JSON.stringify(
            buildCloudWorkspaceFields(nextSettings, nextExtras)
          );

          setSettings(nextSettings);
          setCompareCurrentMode(nextExtras.compareCurrentMode);
          setCompareCurrentAmount(nextExtras.compareCurrentAmount);
          setCompareTargetMode(nextExtras.compareTargetMode);
          setCompareTargetAmount(nextExtras.compareTargetAmount);
          setCompareTargetDriver(nextExtras.compareTargetDriver);
          setCompareTargetRaisePct(nextExtras.compareTargetRaisePct);
          setRetirementStartingSavings(nextExtras.retirementStartingSavings);
          setRetirementSavingsRatePct(nextExtras.retirementSavingsRatePct);
          setRetirementIncludeEmployer(nextExtras.retirementIncludeEmployer);
          setRetirementAnnualReturnPct(nextExtras.retirementAnnualReturnPct);
          setRetirementAnnualInflationPct(
            nextExtras.retirementAnnualInflationPct
          );
          setRetirementYears(nextExtras.retirementYears);
          setRetirementValueMode(nextExtras.retirementValueMode);
        } else {
          hasCloudWorkspaceDocRef.current = false;
          await saveCloudWorkspace(uid, workspacePayloadRef.current, false);
          if (cancelled) return;
          hasCloudWorkspaceDocRef.current = true;
          lastSyncedJsonRef.current = workspaceJsonRef.current;
        }

        workspaceInitDoneRef.current = true;
        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date().toISOString());
      } catch (err) {
        if (cancelled) return;
        workspaceInitDoneRef.current = true;
        setCloudSyncStatus('error');
        setCloudSyncError(formatFirebaseSyncError(err));
      }
    })();

    const unsubscribeComparisons = subscribeCloudComparisons(
      uid,
      (cloudItems) => {
        if (cancelled) return;
        const cloudIds = new Set(cloudItems.map((c) => c.id));
        cloudComparisonIdsRef.current = cloudIds;

        if (reconciledComparisonsUidRef.current !== uid) {
          reconciledComparisonsUidRef.current = uid;
          const localOnly = savedComparisonsRef.current.filter(
            (item) => !cloudIds.has(item.id)
          );
          if (localOnly.length > 0) {
            const availableSlots = Math.max(
              0,
              MAX_SAVED_COMPARISONS - cloudItems.length
            );
            const toUpload = localOnly.slice(0, availableSlots);
            if (toUpload.length > 0) {
              Promise.all(
                toUpload.map((item) => saveCloudComparison(uid, item))
              ).catch((err) => {
                if (!cancelled) {
                  setCloudSyncStatus('error');
                  setCloudSyncError(formatFirebaseSyncError(err));
                }
              });
            }
            const merged = [...toUpload, ...cloudItems]
              .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
              .slice(0, MAX_SAVED_COMPARISONS);
            setSavedComparisons(merged);
            return;
          }
        }

        setSavedComparisons(cloudItems.slice(0, MAX_SAVED_COMPARISONS));
      },
      (err) => {
        if (cancelled) return;
        setCloudSyncStatus('error');
        setCloudSyncError(formatFirebaseSyncError(err));
      }
    );

    return () => {
      cancelled = true;
      unsubscribeComparisons();
    };
  }, [cloudUser, cloudSyncRequested]);

  // Debounced auto-sync of workspace changes when opted in & signed in
  useEffect(() => {
    if (!cloudUser || !cloudSyncRequested || !workspaceInitDoneRef.current) {
      return;
    }
    if (workspaceJson === lastSyncedJsonRef.current) {
      return;
    }

    const uid = cloudUser.uid;
    const timer = window.setTimeout(() => {
      setCloudSyncStatus('syncing');
      saveCloudWorkspace(uid, workspacePayload, hasCloudWorkspaceDocRef.current)
        .then(() => {
          hasCloudWorkspaceDocRef.current = true;
          lastSyncedJsonRef.current = workspaceJson;
          setCloudSyncStatus('synced');
          setCloudSyncError(null);
          setLastSyncedAt(new Date().toISOString());
        })
        .catch((err) => {
          setCloudSyncStatus('error');
          setCloudSyncError(formatFirebaseSyncError(err));
        });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [cloudUser, cloudSyncRequested, workspacePayload, workspaceJson]);

  // Persist user's last entered salary, active comparison, and settings locally in browser localStorage
  useEffect(() => {
    try {
      const payload: PersistedWorkspaceState = {
        settings,
        compareCurrentMode,
        compareCurrentAmount,
        compareTargetMode,
        compareTargetAmount,
        compareTargetDriver,
        compareTargetRaisePct,
        retirementStartingSavings,
        retirementSavingsRatePct,
        retirementIncludeEmployer,
        retirementAnnualReturnPct,
        retirementAnnualInflationPct,
        retirementYears,
        retirementValueMode,
      };
      localStorage.setItem(SALARY_STATE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota or privacy-mode restrictions
    }
  }, [
    settings,
    compareCurrentMode,
    compareCurrentAmount,
    compareTargetMode,
    compareTargetAmount,
    compareTargetDriver,
    compareTargetRaisePct,
    retirementStartingSavings,
    retirementSavingsRatePct,
    retirementIncludeEmployer,
    retirementAnnualReturnPct,
    retirementAnnualInflationPct,
    retirementYears,
    retirementValueMode,
  ]);

  // Persist saved job-offer comparisons locally in browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        SAVED_COMPARISONS_STORAGE_KEY,
        JSON.stringify(savedComparisons)
      );
    } catch {
      // ignore storage restrictions
    }
  }, [savedComparisons]);

  // Keep latest tax year automatically synced whenever user returns to app
  useEffect(() => {
    const refreshLatestTaxYear = () => {
      setSettings((prev) => {
        if (!prev.autoLatestRules) return prev;
        const latest = getLatestCountryRules(prev.countryCode, new Date());
        if (prev.atoFinancialYear === latest.atoFinancialYear) {
          return prev;
        }
        return {
          ...prev,
          atoFinancialYear: latest.atoFinancialYear,
        };
      });
    };

    window.addEventListener('focus', refreshLatestTaxYear);
    return () => window.removeEventListener('focus', refreshLatestTaxYear);
  }, []);

  const breakdown = useMemo(
    () => resolveSalaryBreakdown(settings),
    [settings]
  );

  const updateSettings = useCallback(
    (updater: Partial<PaySettings> | ((prev: PaySettings) => PaySettings)) => {
      setSettings((prev) => {
        const next =
          typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
        if (next.autoLatestRules) {
          const latest = getLatestCountryRules(next.countryCode, new Date());
          if (next.atoFinancialYear !== latest.atoFinancialYear) {
            return {
              ...next,
              atoFinancialYear: latest.atoFinancialYear,
            };
          }
        }
        return next;
      });
    },
    []
  );

  const selectCountry = useCallback((code: CountryCode) => {
    const preset = getCountryPreset(code);
    const latest = getLatestCountryRules(code, new Date());
    setSettings((prev) => ({
      ...prev,
      countryCode: preset.code,
      currencyCode: preset.currencyCode,
      currencySymbol: preset.currencySymbol,
      standardHoursPerDay: preset.standardHoursPerDay,
      standardDaysPerWeek: preset.standardDaysPerWeek,
      weeksPerYear: preset.weeksPerYear,
      retirementLabel: preset.retirementLabel,
      superRate: latest.superRate,
      superMode: latest.superMode,
      levyLabel: preset.levyLabel,
      includeMedicareLevy: latest.includeMedicareLevy,
      medicareLevyRate: latest.levyRate,
      autoLatestRules: true,
      atoFinancialYear: latest.atoFinancialYear,
      taxMode: code === 'CUSTOM' ? 'custom_brackets' : 'country_scale',
      customBrackets: latest.brackets,
      hasHecsHelp: code === 'AU' ? prev.hasHecsHelp : false,
      includeMedicareSurcharge:
        code === 'AU' ? prev.includeMedicareSurcharge : false,
      vnDependents: code === 'VN' ? 1 : 0,
      targetCurrency:
        prev.targetCurrency === preset.currencyCode ? '' : prev.targetCurrency,
    }));
  }, []);

  const syncLatestRules = useCallback(() => {
    setSettings((prev) => {
      const latest = getLatestCountryRules(prev.countryCode, new Date());
      return {
        ...prev,
        autoLatestRules: true,
        taxMode:
          prev.countryCode === 'CUSTOM' ? 'custom_brackets' : 'country_scale',
        atoFinancialYear: latest.atoFinancialYear,
        superRate: latest.superRate,
        superMode: latest.superMode,
        medicareLevyRate: latest.levyRate,
        includeMedicareLevy: latest.includeMedicareLevy,
        customBrackets: latest.brackets,
      };
    });
  }, []);

  const saveComparison = useCallback(
    (
      entry: Omit<SavedJobComparison, 'id' | 'savedAt'>
    ): SavedJobComparison => {
      const newEntry: SavedJobComparison = {
        ...entry,
        id:
          typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        savedAt: new Date().toISOString(),
      };
      setSavedComparisons((prev) =>
        [newEntry, ...prev].slice(0, MAX_SAVED_COMPARISONS)
      );
      if (cloudUser && cloudSyncRequested) {
        saveCloudComparison(cloudUser.uid, newEntry).catch((err) => {
          setCloudSyncStatus('error');
          setCloudSyncError(formatFirebaseSyncError(err));
        });
      }
      return newEntry;
    },
    [cloudUser, cloudSyncRequested]
  );

  const loadSavedComparison = useCallback(
    (entry: SavedJobComparison) => {
      if (entry.countryCode !== settings.countryCode) {
        selectCountry(entry.countryCode);
      }
      setCompareCurrentMode(entry.currentMode);
      setCompareCurrentAmount(entry.currentAmount);
      setCompareTargetMode(entry.targetMode);
      setCompareTargetAmount(entry.targetAmount);
      setCompareTargetDriver(entry.targetDriver);
      setCompareTargetRaisePct(entry.targetRaisePct);
    },
    [selectCountry, settings.countryCode]
  );

  const deleteSavedComparison = useCallback(
    (id: string) => {
      setSavedComparisons((prev) => prev.filter((item) => item.id !== id));
      if (cloudUser && cloudSyncRequested) {
        deleteCloudComparison(cloudUser.uid, id).catch((err) => {
          setCloudSyncStatus('error');
          setCloudSyncError(formatFirebaseSyncError(err));
        });
      }
    },
    [cloudUser, cloudSyncRequested]
  );

  const clearSavedComparisons = useCallback(() => {
    const idsToDelete = savedComparisonsRef.current.map((item) => item.id);
    setSavedComparisons([]);
    if (cloudUser && cloudSyncRequested && idsToDelete.length > 0) {
      clearCloudComparisons(cloudUser.uid, idsToDelete).catch((err) => {
        setCloudSyncStatus('error');
        setCloudSyncError(formatFirebaseSyncError(err));
      });
    }
  }, [cloudUser, cloudSyncRequested]);

  const clearAllAmounts = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      inputAmount: 0,
      otherMonthlyDeduction: 0,
    }));
    setCompareCurrentAmount(0);
    setCompareTargetAmount(0);
    setCompareTargetDriver('amount');
    setCompareTargetRaisePct(0);
    setRetirementStartingSavings(0);
  }, []);

  const requestCloudSync = useCallback((requested: boolean) => {
    setCloudSyncRequested(requested);
    setCloudSyncError(null);
  }, []);

  const signInForCloudSync = useCallback(async (): Promise<User | null> => {
    setCloudSyncRequested(true);
    setCloudSyncError(null);
    setIsSigningIn(true);
    try {
      const user = await signInWithGoogle();
      return user;
    } catch (err) {
      const code =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code?: unknown }).code)
          : '';
      if (
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        return null;
      }
      if (code === 'auth/popup-blocked') {
        setCloudSyncError(
          'Sign-in popup was blocked by your browser. Allow popups for this site and try again.'
        );
        return null;
      }
      setCloudSyncError(formatFirebaseSyncError(err));
      return null;
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOutCloudSync = useCallback(async (): Promise<void> => {
    setCloudSyncRequested(false);
    setCloudSyncError(null);
    setCloudSyncStatus('idle');
    hasCloudWorkspaceDocRef.current = false;
    workspaceInitDoneRef.current = false;
    lastSyncedJsonRef.current = '';
    reconciledComparisonsUidRef.current = null;
    cloudComparisonIdsRef.current = new Set();
    try {
      await signOutFromGoogle();
    } catch (err) {
      setCloudSyncError(formatFirebaseSyncError(err));
    }
  }, []);

  const syncNow = useCallback(async (): Promise<boolean> => {
    if (!cloudUser || !cloudSyncRequested) return false;
    const uid = cloudUser.uid;
    setCloudSyncStatus('syncing');
    setCloudSyncError(null);
    try {
      await saveCloudWorkspace(
        uid,
        workspacePayloadRef.current,
        hasCloudWorkspaceDocRef.current
      );
      hasCloudWorkspaceDocRef.current = true;
      lastSyncedJsonRef.current = workspaceJsonRef.current;

      const unsynced = savedComparisonsRef.current.filter(
        (item) => !cloudComparisonIdsRef.current.has(item.id)
      );
      if (unsynced.length > 0) {
        await Promise.all(
          unsynced.map((item) => saveCloudComparison(uid, item))
        );
      }

      setCloudSyncStatus('synced');
      setLastSyncedAt(new Date().toISOString());
      return true;
    } catch (err) {
      setCloudSyncStatus('error');
      setCloudSyncError(formatFirebaseSyncError(err));
      return false;
    }
  }, [cloudUser, cloudSyncRequested]);

  return {
    settings,
    breakdown,
    updateSettings,
    selectCountry,
    syncLatestRules,
    clearAllAmounts,
    compareCurrentMode,
    setCompareCurrentMode,
    compareCurrentAmount,
    setCompareCurrentAmount,
    compareTargetMode,
    setCompareTargetMode,
    compareTargetAmount,
    setCompareTargetAmount,
    compareTargetDriver,
    setCompareTargetDriver,
    compareTargetRaisePct,
    setCompareTargetRaisePct,
    savedComparisons,
    saveComparison,
    loadSavedComparison,
    deleteSavedComparison,
    clearSavedComparisons,
    retirementStartingSavings,
    setRetirementStartingSavings,
    retirementSavingsRatePct,
    setRetirementSavingsRatePct,
    retirementIncludeEmployer,
    setRetirementIncludeEmployer,
    retirementAnnualReturnPct,
    setRetirementAnnualReturnPct,
    retirementAnnualInflationPct,
    setRetirementAnnualInflationPct,
    retirementYears,
    setRetirementYears,
    retirementValueMode,
    setRetirementValueMode,
    cloudSyncRequested,
    cloudUser,
    cloudSyncStatus,
    cloudSyncError,
    isSigningIn,
    lastSyncedAt,
    requestCloudSync,
    signInForCloudSync,
    signOutCloudSync,
    syncNow,
  };
}
