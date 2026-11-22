import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  CasualPenaltyMethod,
  CountryCode,
  EmploymentType,
  InputFrequency,
  PaySettings,
  SavedJobComparison,
  SuperMode,
  TaxMode,
} from '../types/wage';

export interface CloudWorkspacePayload {
  countryCode: CountryCode;
  currencyCode: string;
  currencySymbol: string;
  inputMode: InputFrequency;
  inputAmount: number;
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
  targetCurrency: string;
  exchangeRate: number;
  favoriteCurrencies: string[];
  standardHoursPerDay: number;
  standardDaysPerWeek: number;
  weeksPerYear: number;
  retirementLabel: string;
  superRate: number;
  superMode: SuperMode;
  taxMode: TaxMode;
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

function clampNum(val: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(val)) return fallback;
  return Math.max(min, Math.min(max, val));
}

export function buildCloudWorkspaceFields(
  settings: PaySettings,
  extras: {
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
): CloudWorkspacePayload {
  return {
    countryCode: settings.countryCode,
    currencyCode: (settings.currencyCode || 'AUD').slice(0, 6),
    currencySymbol: (settings.currencySymbol || '$').slice(0, 8),
    inputMode: settings.inputMode,
    inputAmount: clampNum(settings.inputAmount, 0, 1000000000000, 0),
    employmentType: settings.employmentType ?? 'full_time',
    hasCasualLoading: Boolean(settings.hasCasualLoading),
    casualLoadingPct: clampNum(settings.casualLoadingPct, 0, 100, 25),
    agreedWeeklyHours: clampNum(settings.agreedWeeklyHours, 1, 80, 24),
    claimTaxFreeThreshold: Boolean(settings.claimTaxFreeThreshold),
    overtimeHoursWeekly: clampNum(settings.overtimeHoursWeekly, 0, 100, 0),
    overtimeMultiplier: clampNum(settings.overtimeMultiplier, 1, 10, 1.5),
    saturdayHoursWeekly: clampNum(settings.saturdayHoursWeekly, 0, 100, 0),
    saturdayMultiplier: clampNum(settings.saturdayMultiplier, 1, 10, 1.25),
    sundayHoursWeekly: clampNum(settings.sundayHoursWeekly, 0, 100, 0),
    sundayMultiplier: clampNum(settings.sundayMultiplier, 1, 10, 1.5),
    publicHolidayHoursWeekly: clampNum(
      settings.publicHolidayHoursWeekly,
      0,
      100,
      0
    ),
    publicHolidayMultiplier: clampNum(
      settings.publicHolidayMultiplier,
      1,
      10,
      2.25
    ),
    casualPenaltyMethod: settings.casualPenaltyMethod ?? 'compounding',
    targetCurrency: (settings.targetCurrency || '').slice(0, 6),
    exchangeRate: clampNum(settings.exchangeRate, 0.000001, 10000000, 1),
    favoriteCurrencies: (settings.favoriteCurrencies || [])
      .filter((c): c is string => typeof c === 'string' && c.length > 0)
      .map((c) => c.slice(0, 6))
      .slice(0, 5),
    standardHoursPerDay: clampNum(settings.standardHoursPerDay, 1, 24, 7.6),
    standardDaysPerWeek: clampNum(settings.standardDaysPerWeek, 1, 7, 5),
    weeksPerYear: clampNum(settings.weeksPerYear, 1, 53, 52),
    retirementLabel: (settings.retirementLabel || 'Superannuation').slice(0, 64),
    superRate: clampNum(settings.superRate, 0, 100, 12),
    superMode: settings.superMode,
    taxMode: settings.taxMode,
    compareCurrentMode: extras.compareCurrentMode,
    compareCurrentAmount: clampNum(
      extras.compareCurrentAmount,
      0,
      1000000000000,
      0
    ),
    compareTargetMode: extras.compareTargetMode,
    compareTargetAmount: clampNum(
      extras.compareTargetAmount,
      0,
      1000000000000,
      0
    ),
    compareTargetDriver: extras.compareTargetDriver,
    compareTargetRaisePct: clampNum(
      extras.compareTargetRaisePct,
      -99,
      500,
      0
    ),
    retirementStartingSavings: clampNum(
      extras.retirementStartingSavings,
      0,
      1000000000000,
      0
    ),
    retirementSavingsRatePct: clampNum(
      extras.retirementSavingsRatePct,
      0,
      100,
      20
    ),
    retirementIncludeEmployer: Boolean(extras.retirementIncludeEmployer),
    retirementAnnualReturnPct: clampNum(
      extras.retirementAnnualReturnPct,
      0,
      30,
      7
    ),
    retirementAnnualInflationPct: clampNum(
      extras.retirementAnnualInflationPct,
      0,
      25,
      2.5
    ),
    retirementYears: clampNum(extras.retirementYears, 1, 50, 25),
    retirementValueMode: extras.retirementValueMode,
  };
}

export async function fetchCloudWorkspace(
  userId: string
): Promise<CloudWorkspacePayload | null> {
  const path = `users/${userId}/workspace/state`;
  try {
    const snap = await getDoc(doc(db, 'users', userId, 'workspace', 'state'));
    if (!snap.exists()) return null;
    return snap.data() as CloudWorkspacePayload;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveCloudWorkspace(
  userId: string,
  payload: CloudWorkspacePayload,
  existsInCloud: boolean
): Promise<void> {
  const path = `users/${userId}/workspace/state`;
  const ref = doc(db, 'users', userId, 'workspace', 'state');
  try {
    if (existsInCloud) {
      await updateDoc(ref, {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ownerId: userId,
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(
      error,
      existsInCloud ? OperationType.UPDATE : OperationType.CREATE,
      path
    );
  }
}

export function subscribeCloudComparisons(
  userId: string,
  onData: (items: SavedJobComparison[]) => void,
  onSyncError?: (error: Error) => void
): Unsubscribe {
  const path = `users/${userId}/comparisons`;
  const q = query(
    collection(db, 'users', userId, 'comparisons'),
    where('ownerId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: SavedJobComparison[] = snapshot.docs
        .map((docSnap): SavedJobComparison => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name ?? ''),
            savedAt: String(data.savedAt ?? new Date().toISOString()),
            countryCode: (data.countryCode as CountryCode) ?? 'AU',
            currencyCode: String(data.currencyCode ?? 'AUD'),
            currencySymbol: String(data.currencySymbol ?? '$'),
            currentMode: (data.currentMode as InputFrequency) ?? 'annual',
            currentAmount: Number(data.currentAmount ?? 0),
            targetMode: (data.targetMode as InputFrequency) ?? 'annual',
            targetAmount: Number(data.targetAmount ?? 0),
            targetDriver:
              data.targetDriver === 'percent' ? 'percent' : 'amount',
            targetRaisePct: Number(data.targetRaisePct ?? 0),
          };
        })
        .sort((a, b) => b.savedAt.localeCompare(a.savedAt));

      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        if (onSyncError && wrapped instanceof Error) {
          onSyncError(wrapped);
        }
      }
    }
  );
}

export async function saveCloudComparison(
  userId: string,
  item: SavedJobComparison
): Promise<void> {
  const safeId = item.id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
  const path = `users/${userId}/comparisons/${safeId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'comparisons', safeId), {
      ownerId: userId,
      name: (item.name || 'Saved Comparison').slice(0, 80),
      savedAt: (item.savedAt || new Date().toISOString()).slice(0, 40),
      countryCode: item.countryCode.slice(0, 12),
      currencyCode: item.currencyCode.slice(0, 6),
      currencySymbol: item.currencySymbol.slice(0, 8),
      currentMode: item.currentMode,
      currentAmount: clampNum(item.currentAmount, 0, 1000000000000, 0),
      targetMode: item.targetMode,
      targetAmount: clampNum(item.targetAmount, 0, 1000000000000, 0),
      targetDriver: item.targetDriver,
      targetRaisePct: clampNum(item.targetRaisePct, -99, 500, 0),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteCloudComparison(
  userId: string,
  comparisonId: string
): Promise<void> {
  const safeId = comparisonId.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
  const path = `users/${userId}/comparisons/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'comparisons', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function clearCloudComparisons(
  userId: string,
  comparisonIds: string[]
): Promise<void> {
  if (comparisonIds.length === 0) return;
  const path = `users/${userId}/comparisons`;
  try {
    const batch = writeBatch(db);
    for (const id of comparisonIds) {
      const safeId = id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
      batch.delete(doc(db, 'users', userId, 'comparisons', safeId));
    }
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
