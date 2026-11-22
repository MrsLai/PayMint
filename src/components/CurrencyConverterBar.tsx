import { ArrowLeftRight, RefreshCw, Star } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CURRENCY_OPTIONS, getCurrencyOption } from '../data/currencies';
import { useI18n } from '../i18n';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import { formatConvertedCurrency, formatCurrency } from '../utils/format';

const MAX_FAVORITE_CURRENCIES = 5;

interface CurrencyConverterBarProps {
  settings: PaySettings;
  breakdown?: SalaryBreakdown;
  compareData?: {
    currentBreakdown: SalaryBreakdown;
    targetBreakdown: SalaryBreakdown;
    hasCurrent: boolean;
    hasTarget: boolean;
  };
  retirementData?: {
    projectedWealth: number;
    totalContributions: number;
    compoundInterest: number;
    monthlyIncome4Pct: number;
    years: number;
    isReal: boolean;
    hasInputs: boolean;
  };
  onUpdateSettings: (patch: Partial<PaySettings>) => void;
}

export function CurrencyConverterBar({
  settings,
  breakdown,
  compareData,
  retirementData,
  onUpdateSettings,
}: CurrencyConverterBarProps) {
  const { t } = useI18n();
  const [liveRates, setLiveRates] = useState<Record<string, number> | null>(
    null
  );
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rateSource, setRateSource] = useState<'live' | 'baseline' | 'custom'>(
    'baseline'
  );
  const [showFavoritesManager, setShowFavoritesManager] = useState(false);

  const selectedCurrency = getCurrencyOption(settings.targetCurrency);
  const hasAmount = settings.inputAmount > 0;
  const favorites = settings.favoriteCurrencies ?? [];
  const isAtFavoriteCap = favorites.length >= MAX_FAVORITE_CURRENCIES;

  const { favoriteOptions, otherOptions } = useMemo(() => {
    const available = CURRENCY_OPTIONS.filter(
      (c) => c.code !== settings.currencyCode
    );
    const favSet = new Set(favorites);
    const favOpts = favorites
      .map((code) => available.find((c) => c.code === code))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    const restOpts = available.filter((c) => !favSet.has(c.code));
    return { favoriteOptions: favOpts, otherOptions: restOpts };
  }, [favorites, settings.currencyCode]);

  const fetchLiveRates = useCallback(
    async (baseCode: string, targetCode?: string) => {
      setIsLoadingRate(true);
      try {
        const res = await fetch(
          `https://open.er-api.com/v6/latest/${encodeURIComponent(baseCode)}`
        );
        if (!res.ok) throw new Error('Rate fetch failed');
        const json = (await res.json()) as {
          result?: string;
          rates?: Record<string, number>;
        };
        if (json.result === 'success' && json.rates) {
          setLiveRates(json.rates);
          const codeToApply = targetCode ?? settings.targetCurrency;
          if (codeToApply && json.rates[codeToApply]) {
            const rounded =
              json.rates[codeToApply] >= 100
                ? Math.round(json.rates[codeToApply] * 100) / 100
                : Math.round(json.rates[codeToApply] * 10000) / 10000;
            onUpdateSettings({ exchangeRate: rounded });
            setRateSource('live');
          }
        }
      } catch {
        setRateSource('baseline');
      } finally {
        setIsLoadingRate(false);
      }
    },
    [onUpdateSettings, settings.targetCurrency]
  );

  useEffect(() => {
    if (settings.targetCurrency) {
      fetchLiveRates(settings.currencyCode || 'AUD', settings.targetCurrency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.currencyCode]);

  const computeCrossFallback = (baseCode: string, targetCode: string): number => {
    const baseOpt = getCurrencyOption(baseCode);
    const targetOpt = getCurrencyOption(targetCode);
    const baseFromAud = baseOpt?.fallbackRateFromAud ?? 1;
    const targetFromAud = targetOpt?.fallbackRateFromAud ?? 1;
    const raw = targetFromAud / Math.max(0.0001, baseFromAud);
    return raw >= 100
      ? Math.round(raw * 100) / 100
      : Math.round(raw * 10000) / 10000;
  };

  const handleSelectCurrency = (code: string) => {
    if (!code) {
      onUpdateSettings({ targetCurrency: '' });
      return;
    }
    const live = liveRates?.[code];
    const nextRate = live
      ? live >= 100
        ? Math.round(live * 100) / 100
        : Math.round(live * 10000) / 10000
      : computeCrossFallback(settings.currencyCode || 'AUD', code);

    setRateSource(live ? 'live' : 'baseline');
    onUpdateSettings({
      targetCurrency: code,
      exchangeRate: nextRate,
    });
    if (!live) {
      fetchLiveRates(settings.currencyCode || 'AUD', code);
    }
  };

  const handleToggleFavorite = (code: string) => {
    if (favorites.includes(code)) {
      onUpdateSettings({
        favoriteCurrencies: favorites.filter((c) => c !== code),
      });
      return;
    }
    if (favorites.length >= MAX_FAVORITE_CURRENCIES) return;
    onUpdateSettings({
      favoriteCurrencies: [...favorites, code],
    });
  };

  const isSelectedPinned =
    Boolean(selectedCurrency) && favorites.includes(selectedCurrency!.code);

  return (
    <section
      aria-label="Currency Exchange Rate Converter"
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none transition-colors ${
        selectedCurrency
          ? 'border-teal-300/90 dark:border-teal-700/80 ring-1 ring-teal-500/10 dark:ring-teal-400/15'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {retirementData
                ? t('currency.retirementTitle')
                : t('currency.title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {retirementData
                ? t('currency.subtitleRetirement', {
                    currency: settings.currencyCode,
                  })
                : compareData
                  ? t('currency.subtitleCompare', {
                      currency: settings.currencyCode,
                    })
                  : t('currency.subtitleCalc', {
                      currency: settings.currencyCode,
                    })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          <select
            aria-label={t('currency.title')}
            value={settings.targetCurrency}
            onChange={(e) => handleSelectCurrency(e.target.value)}
            className="w-full sm:w-auto min-w-0 max-w-full px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400 cursor-pointer"
          >
            <option value="">
              {t('currency.offOption', { currency: settings.currencyCode })}
            </option>
            {favoriteOptions.length > 0 ? (
              <>
                <optgroup
                  label={t('currency.pinnedFavorites', {
                    count: favoriteOptions.length,
                    max: MAX_FAVORITE_CURRENCIES,
                  })}
                >
                  {favoriteOptions.map((c) => (
                    <option key={`fav-${c.code}`} value={c.code}>
                      ★ {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t('currency.allCurrencies')}>
                  {otherOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </optgroup>
              </>
            ) : (
              otherOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))
            )}
          </select>

          {selectedCurrency && (
            <button
              type="button"
              onClick={() => handleToggleFavorite(selectedCurrency.code)}
              disabled={!isSelectedPinned && isAtFavoriteCap}
              title={
                isSelectedPinned
                  ? `Unpin ${selectedCurrency.code} from favorites`
                  : isAtFavoriteCap
                    ? `Maximum ${MAX_FAVORITE_CURRENCIES} favorite currencies pinned`
                    : `Pin ${selectedCurrency.code} to top of dropdown`
              }
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap shrink-0 ${
                isSelectedPinned
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300/90 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 cursor-pointer'
                  : isAtFavoriteCap
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isSelectedPinned
                    ? 'fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>
                {isSelectedPinned ? t('currency.pinned') : t('currency.pin')}
              </span>
            </button>
          )}

          <button
            type="button"
            aria-expanded={showFavoritesManager}
            onClick={() => setShowFavoritesManager((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              showFavoritesManager
                ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                showFavoritesManager
                  ? 'fill-white text-white'
                  : favorites.length > 0
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-slate-400 dark:text-slate-500'
              }`}
            />
            <span>
              Favorites ({favorites.length}/{MAX_FAVORITE_CURRENCIES})
            </span>
          </button>

          {selectedCurrency && (
            <>
              <div className="flex items-center justify-between sm:justify-start gap-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 flex-1 sm:flex-initial min-w-0">
                <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  1 {settings.currencyCode} =
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.0001"
                  aria-label="Exchange rate"
                  value={settings.exchangeRate || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setRateSource('custom');
                    onUpdateSettings({
                      exchangeRate: Number.isNaN(val) || val < 0 ? 0 : val,
                    });
                  }}
                  className="w-20 sm:w-24 min-w-0 font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-transparent focus:outline-none text-right"
                />
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200 shrink-0">
                  {selectedCurrency.code}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  fetchLiveRates(
                    settings.currencyCode || 'AUD',
                    selectedCurrency.code
                  )
                }
                disabled={isLoadingRate}
                title="Refresh live market exchange rate"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 active:scale-[0.98] rounded-xl transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoadingRate ? 'animate-spin' : ''}`}
                />
                <span>
                  {isLoadingRate
                    ? 'Updating...'
                    : rateSource === 'live'
                      ? 'Live Rate'
                      : rateSource === 'custom'
                        ? 'Custom Rate'
                        : 'Refresh Live'}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 1-Tap Pinned Favorite Shortcuts */}
      {favoriteOptions.length > 0 && !showFavoritesManager && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mr-1">
            Pinned:
          </span>
          {favoriteOptions.map((c) => {
            const active = settings.targetCurrency === c.code;
            return (
              <button
                key={`quick-${c.code}`}
                type="button"
                onClick={() => handleSelectCurrency(active ? '' : c.code)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300'
                }`}
              >
                <Star
                  className={`w-3 h-3 ${
                    active ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'
                  }`}
                />
                <span>{c.code}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Expandable Favorite Currencies Pinning Panel */}
      {showFavoritesManager && (
        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                Favorite Currencies ({favorites.length}/
                {MAX_FAVORITE_CURRENCIES} pinned)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAtFavoriteCap
                  ? `Limit of ${MAX_FAVORITE_CURRENCIES} favorites reached — unpin one below to add another.`
                  : `Pin up to ${MAX_FAVORITE_CURRENCIES} currencies to keep them at the top of the dropdown and as 1-tap shortcuts.`}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ favoriteCurrencies: [] })}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear favorites
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFavoritesManager(false)}
                className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
            {CURRENCY_OPTIONS.filter(
              (c) => c.code !== settings.currencyCode
            ).map((c) => {
              const pinned = favorites.includes(c.code);
              const disabled = !pinned && isAtFavoriteCap;
              return (
                <button
                  key={`pin-${c.code}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleToggleFavorite(c.code)}
                  title={`${pinned ? 'Unpin' : 'Pin'} ${c.name} (${c.code})`}
                  className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-colors text-left min-w-0 ${
                    pinned
                      ? 'bg-teal-600 border-teal-600 text-white font-semibold shadow-xs cursor-pointer'
                      : disabled
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer'
                  }`}
                >
                  <span className="truncate font-mono tabular-nums font-semibold">
                    {c.code}
                  </span>
                  <Star
                    className={`w-3.5 h-3.5 shrink-0 ${
                      pinned
                        ? 'fill-white text-white'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedCurrency && breakdown && !compareData && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {breakdown.rows.map((row) => (
            <div key={row.period} className="space-y-1 min-w-0">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {row.period} Take-Home ({selectedCurrency.code})
              </div>
              <div
                className={`text-base sm:text-lg font-bold font-mono tabular-nums break-words ${
                  hasAmount
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {formatConvertedCurrency(
                  row.netPocket,
                  settings.exchangeRate,
                  selectedCurrency.symbol,
                  selectedCurrency.decimals
                )}
              </div>
              <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 break-words">
                Gross{' '}
                {formatConvertedCurrency(
                  row.gross,
                  settings.exchangeRate,
                  selectedCurrency.symbol,
                  selectedCurrency.decimals
                )}{' '}
                <span className="text-slate-400 dark:text-slate-500">
                  (
                  {formatCurrency(
                    row.netPocket,
                    settings.currencySymbol,
                    getCurrencyOption(settings.currencyCode)?.decimals ?? 2
                  )}{' '}
                  net)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCurrency && compareData && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {compareData.targetBreakdown.rows.map((tgtRow, idx) => {
            const curRow = compareData.currentBreakdown.rows[idx];
            const diffNet = tgtRow.netPocket - curRow.netPocket;
            const hasBoth = compareData.hasCurrent && compareData.hasTarget;
            const primaryNet = compareData.hasTarget
              ? tgtRow.netPocket
              : curRow.netPocket;
            const hasPrimary = compareData.hasTarget || compareData.hasCurrent;

            return (
              <div key={tgtRow.period} className="space-y-1 min-w-0">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {compareData.hasTarget
                    ? `${tgtRow.period} Target Take-Home`
                    : `${tgtRow.period} Current Take-Home`}{' '}
                  ({selectedCurrency.code})
                </div>
                <div
                  className={`text-base sm:text-lg font-bold font-mono tabular-nums break-words ${
                    hasPrimary
                      ? 'text-teal-700 dark:text-teal-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {formatConvertedCurrency(
                    primaryNet,
                    settings.exchangeRate,
                    selectedCurrency.symbol,
                    selectedCurrency.decimals
                  )}
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 break-words">
                  {hasBoth ? (
                    <>
                      Current{' '}
                      {formatConvertedCurrency(
                        curRow.netPocket,
                        settings.exchangeRate,
                        selectedCurrency.symbol,
                        selectedCurrency.decimals
                      )}{' '}
                      <span
                        className={
                          diffNet >= 0
                            ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                            : 'text-red-600 dark:text-red-400 font-semibold'
                        }
                      >
                        ({diffNet >= 0 ? '+' : ''}
                        {formatConvertedCurrency(
                          diffNet,
                          settings.exchangeRate,
                          selectedCurrency.symbol,
                          selectedCurrency.decimals
                        )}
                        )
                      </span>
                    </>
                  ) : (
                    <span>
                      Gross{' '}
                      {formatConvertedCurrency(
                        compareData.hasTarget ? tgtRow.gross : curRow.gross,
                        settings.exchangeRate,
                        selectedCurrency.symbol,
                        selectedCurrency.decimals
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {selectedCurrency && retirementData && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {[
            {
              label: `Projected Wealth Yr ${retirementData.years} (${selectedCurrency.code})`,
              val: retirementData.projectedWealth,
              baseDecimals: 0,
              accent: 'text-teal-700 dark:text-teal-300',
              sub: retirementData.isReal ? "Today's money" : 'Future value',
            },
            {
              label: `Total Contributions (${selectedCurrency.code})`,
              val: retirementData.totalContributions,
              baseDecimals: 0,
              accent: 'text-slate-800 dark:text-slate-100',
              sub: 'Principal invested',
            },
            {
              label: `Compound Interest (${selectedCurrency.code})`,
              val: retirementData.compoundInterest,
              baseDecimals: 0,
              accent: 'text-emerald-700 dark:text-emerald-400',
              sub: 'Growth earned',
            },
            {
              label: `Est. Monthly Income (${selectedCurrency.code})`,
              val: retirementData.monthlyIncome4Pct,
              baseDecimals: getCurrencyOption(settings.currencyCode)?.decimals ?? 2,
              accent: 'text-sky-700 dark:text-sky-400',
              sub: '4% annual rule / mo',
            },
          ].map((item) => (
            <div key={item.label} className="space-y-1 min-w-0">
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.label}
              </div>
              <div
                className={`text-base sm:text-lg font-bold font-mono tabular-nums break-words ${
                  retirementData.hasInputs
                    ? item.accent
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {formatConvertedCurrency(
                  item.val,
                  settings.exchangeRate,
                  selectedCurrency.symbol,
                  selectedCurrency.decimals
                )}
              </div>
              <div className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 break-words">
                {item.sub}{' '}
                <span className="text-slate-400 dark:text-slate-500">
                  (
                  {formatCurrency(
                    item.val,
                    settings.currencySymbol,
                    item.baseDecimals
                  )}
                  )
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
