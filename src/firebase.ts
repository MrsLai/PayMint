import { initializeApp } from 'firebase/app';
import {
  AppCheck,
  getToken,
  initializeAppCheck,
  onTokenChanged,
  ReCaptchaEnterpriseProvider,
  ReCaptchaV3Provider,
  setTokenAutoRefreshEnabled,
} from 'firebase/app-check';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const APPCHECK_PAUSED_MONTH_KEY = 'paymint_appcheck_paused_month_v1';

let appCheckInstance: AppCheck | null = null;
let appCheckPausedThisSession = false;

export type AppCheckStatus =
  | { active: true }
  | { active: false; reason: 'not_configured' | 'monthly_quota_paused' | 'init_failed' };

function getCurrentUtcMonthKey(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM (UTC calendar month reset)
}

function resolveRecaptchaSiteKey(): string {
  const envKey =
    typeof import.meta.env?.VITE_RECAPTCHA_SITE_KEY === 'string'
      ? import.meta.env.VITE_RECAPTCHA_SITE_KEY.trim()
      : '';
  const configKey =
    typeof firebaseConfig.recaptchaSiteKey === 'string'
      ? firebaseConfig.recaptchaSiteKey.trim()
      : '';
  return envKey || configKey;
}

function isAppCheckPausedForCurrentMonth(): boolean {
  if (appCheckPausedThisSession) return true;
  try {
    const pausedMonth = localStorage.getItem(APPCHECK_PAUSED_MONTH_KEY);
    if (!pausedMonth) return false;
    if (pausedMonth === getCurrentUtcMonthKey()) {
      return true;
    }
    // New calendar month started -> Google's 10,000/mo quota has reset; auto-resume!
    localStorage.removeItem(APPCHECK_PAUSED_MONTH_KEY);
    return false;
  } catch {
    return false;
  }
}

export function pauseAppCheckForCurrentMonth(): void {
  appCheckPausedThisSession = true;
  if (appCheckInstance) {
    try {
      setTokenAutoRefreshEnabled(appCheckInstance, false);
    } catch {
      // ignore toggle errors
    }
  }
  try {
    localStorage.setItem(APPCHECK_PAUSED_MONTH_KEY, getCurrentUtcMonthKey());
  } catch {
    // ignore storage errors
  }
}

function isQuotaOrRateLimitError(error: unknown): boolean {
  const raw = (
    error instanceof Error ? error.message : String(error ?? '')
  ).toLowerCase();
  return (
    raw.includes('429') ||
    raw.includes('quota') ||
    raw.includes('resource-exhausted') ||
    raw.includes('too many requests') ||
    raw.includes('throttled') ||
    raw.includes('fetch-status-error') ||
    raw.includes('recaptcha-error')
  );
}

/**
 * Lazily activates Firebase App Check ONLY when cloud sync is explicitly used.
 * If no site key is configured or if Google's 10,000/month free reCAPTCHA quota
 * trips the circuit-breaker for the current UTC month, reCAPTCHA is automatically
 * bypassed until the 1st of next month (UTC).
 */
export async function ensureAppCheckActive(): Promise<AppCheckStatus> {
  const siteKey = resolveRecaptchaSiteKey();
  if (!siteKey) {
    return { active: false, reason: 'not_configured' };
  }

  if (isAppCheckPausedForCurrentMonth()) {
    return { active: false, reason: 'monthly_quota_paused' };
  }

  try {
    if (!appCheckInstance) {
      const useV3 =
        String(import.meta.env?.VITE_RECAPTCHA_PROVIDER ?? '').toLowerCase() ===
        'v3';
      const provider = useV3
        ? new ReCaptchaV3Provider(siteKey)
        : new ReCaptchaEnterpriseProvider(siteKey);

      appCheckInstance = initializeAppCheck(app, {
        provider,
        isTokenAutoRefreshEnabled: true,
      });

      onTokenChanged(
        appCheckInstance,
        () => {
          // valid token issued
        },
        (err) => {
          if (isQuotaOrRateLimitError(err)) {
            pauseAppCheckForCurrentMonth();
          }
        }
      );
    }

    await getToken(appCheckInstance, false);
    return { active: true };
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      pauseAppCheckForCurrentMonth();
      return { active: false, reason: 'monthly_quota_paused' };
    }
    return { active: false, reason: 'init_failed' };
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function signInWithGoogle(): Promise<User> {
  await ensureAppCheckActive();
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutFromGoogle(): Promise<void> {
  await signOut(auth);
}
