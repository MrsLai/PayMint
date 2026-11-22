import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { COUNTRY_PRESETS, getCountryPreset } from '../data/countryPresets';
import { createDefaultPaySettings } from '../data/defaults';
import { useI18n } from '../i18n';
import {
  CountryCode,
  CountryPreset,
  PaySettings,
  TaxBracket,
  TaxMode,
} from '../types/wage';
import {
  getLevyTooltipCopy,
  getRetirementTooltipCopy,
  getTaxTooltipCopy,
} from '../utils/regulationInfo';
import {
  getActiveAuthorityLabel,
  getEffectiveScaleBrackets,
  getLatestCountryRules,
} from '../utils/taxYearRules';
import { InfoTooltip } from './InfoTooltip';

interface TaxSettingsViewProps {
  embedded?: boolean;
  settings: PaySettings;
  onUpdateSettings: (
    updater: Partial<PaySettings> | ((prev: PaySettings) => PaySettings)
  ) => void;
  onSelectCountry: (code: CountryCode) => void;
  onSyncLatestRules: () => void;
}

const REGION_GROUPS: Array<{
  id: CountryPreset['region'];
  title: string;
  note?: string;
  gridClass: string;
}> = [
  {
    id: 'Asia Pacific',
    title: 'Asia Pacific',
    note: 'Default: Australia',
    gridClass: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  },
  {
    id: 'Latin America',
    title: 'Latin America',
    gridClass: 'grid-cols-2 sm:grid-cols-4',
  },
  {
    id: 'Other Regions',
    title: 'Europe, North America & Custom',
    gridClass: 'grid-cols-2 sm:grid-cols-4',
  },
];

export function TaxSettingsView({
  embedded = false,
  settings,
  onUpdateSettings,
  onSelectCountry,
  onSyncLatestRules,
}: TaxSettingsViewProps) {
  const { t } = useI18n();
  const [notice, setNotice] = useState<string | null>(null);
  const countryPreset = getCountryPreset(settings.countryCode);
  const [expandedRegions, setExpandedRegions] = useState<
    Record<CountryPreset['region'], boolean>
  >(() => ({
    'Asia Pacific': countryPreset.region === 'Asia Pacific',
    'Latin America': countryPreset.region === 'Latin America',
    'Other Regions': countryPreset.region === 'Other Regions',
  }));

  const latestRules = getLatestCountryRules(settings.countryCode);
  const activeAuthorityLabel = getActiveAuthorityLabel(settings);
  const retirementTooltip = getRetirementTooltipCopy(settings);
  const levyTooltip = getLevyTooltipCopy(settings);
  const taxTooltip = getTaxTooltipCopy(settings);

  const allRegionsExpanded = REGION_GROUPS.every(
    (group) => expandedRegions[group.id]
  );

  const toggleRegion = (region: CountryPreset['region']) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  const toggleAllRegions = () => {
    const nextState = !allRegionsExpanded;
    setExpandedRegions({
      'Asia Pacific': nextState,
      'Latin America': nextState,
      'Other Regions': nextState,
    });
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 3200);
  };

  const handleBracketChange = (
    id: string,
    field: keyof TaxBracket,
    rawVal: string
  ) => {
    const updated = settings.customBrackets.map((b) => {
      if (b.id !== id) return b;
      if (field === 'max') {
        return {
          ...b,
          max: rawVal === '' ? null : Math.max(0, Number(rawVal)),
        };
      }
      return { ...b, [field]: Math.max(0, Number(rawVal) || 0) };
    });
    onUpdateSettings({ customBrackets: updated });
  };

  const activeScaleBrackets = getEffectiveScaleBrackets(settings);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {embedded ? (
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t('tax.title')}
            </h2>
          ) : (
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {t('tax.title')}
            </h1>
          )}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {countryPreset.name} · {latestRules.taxYearLabel} · {latestRules.superRate}% {countryPreset.retirementLabel}
          </p>
        </div>

        <button
          id="tax-settings-primary-control"
          type="button"
          onClick={() => {
            const freshDefaults = createDefaultPaySettings(new Date());
            onUpdateSettings((prev) => ({
              ...freshDefaults,
              inputAmount: prev.inputAmount,
              inputMode: prev.inputMode,
            }));
            setExpandedRegions({
              'Asia Pacific': true,
              'Latin America': false,
              'Other Regions': false,
            });
            showNotice(
              `Reset tax and super rules to latest Australian defaults (${freshDefaults.atoFinancialYear} · ${freshDefaults.superRate}% Super).`
            );
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 active:scale-[0.98] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('tax.resetAustralia')}</span>
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="px-4 py-3 text-xs font-medium text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl shadow-xs dark:shadow-none"
        >
          {notice}
        </div>
      )}

      {/* Collapsible Country Preset Picker Grid */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {t('tax.selectCountry')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {countryPreset.name} ({countryPreset.currencyCode}) · {activeAuthorityLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleAllRegions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {allRegionsExpanded ? (
              <>
                <Minus className="w-3.5 h-3.5" />
                <span>{t('tax.collapseAll')}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t('tax.expandAll')}</span>
              </>
            )}
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {REGION_GROUPS.map((group) => {
            const presets = COUNTRY_PRESETS.filter(
              (p) => p.region === group.id
            );
            const isExpanded = expandedRegions[group.id];
            const hasActiveCountry = countryPreset.region === group.id;
            const panelId = `region-panel-${group.id
              .toLowerCase()
              .replace(/\s+/g, '-')}`;

            return (
              <div key={group.id} className="first:pt-0 last:pb-0">
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => toggleRegion(group.id)}
                  className="w-full py-3.5 flex items-center justify-between gap-3 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg"
                >
                  <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                      {group.title}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {presets.length}{' '}
                      {presets.length === 1 ? 'jurisdiction' : 'jurisdictions'}
                      {group.note ? ` · ${group.note}` : ''}
                    </span>
                    {hasActiveCountry && (
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                        · Active: {countryPreset.name} ({countryPreset.currencyCode})
                      </span>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-colors shrink-0 ${
                      isExpanded
                        ? 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:border-teal-300 dark:group-hover:border-teal-600'
                    }`}
                  >
                    {isExpanded ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>

                {isExpanded && (
                  <div
                    id={panelId}
                    className={`pb-4 pt-1 grid ${group.gridClass} gap-3`}
                  >
                    {presets.map((preset) => {
                      const active = settings.countryCode === preset.code;
                      const presetLatest = getLatestCountryRules(preset.code);
                      return (
                        <button
                          key={preset.code}
                          type="button"
                          onClick={() => {
                            onSelectCountry(preset.code);
                            showNotice(
                              `Switched to ${preset.name} (${preset.currencyCode}) latest ${presetLatest.taxYearLabel} tax & ${preset.retirementLabel} (${presetLatest.superRate}%) rules.`
                            );
                          }}
                          className={`text-left p-3 rounded-xl border transition-all active:scale-[0.98] cursor-pointer ${
                            active
                              ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/50 ring-1 ring-teal-600/20 dark:ring-teal-400/25'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {preset.name}
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-300 shrink-0">
                              {preset.currencyCode}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {preset.retirementLabel} {presetLatest.superRate}%
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retirement / Superannuation & Levies */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {settings.retirementLabel}, Levies & Deductions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust {settings.retirementLabel.toLowerCase()} rate anytime legislation changes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="inline-flex items-center gap-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {settings.retirementLabel} Rate (%)
                  </label>
                  <InfoTooltip {...retirementTooltip} />
                </div>
                {settings.superRate !== latestRules.superRate && (
                  <button
                    type="button"
                    onClick={onSyncLatestRules}
                    className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
                  >
                    Use latest ({latestRules.superRate}%)
                  </button>
                )}
              </div>
              <input
                type="number"
                step={0.5}
                min={0}
                max={40}
                value={settings.superRate}
                onChange={(e) =>
                  onUpdateSettings({
                    superRate: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                {settings.retirementLabel} Arrangement
              </label>
              <select
                value={settings.superMode}
                onChange={(e) =>
                  onUpdateSettings({
                    superMode: e.target.value as PaySettings['superMode'],
                  })
                }
                className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400 cursor-pointer"
              >
                <option value="employer_paid">
                  Employer Paid (+ On Top of Base)
                </option>
                <option value="included_in_package">
                  Included in Total Package
                </option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 mb-1">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {settings.levyLabel} Rate (%)
                </label>
                <InfoTooltip {...levyTooltip} />
              </div>
              <input
                type="number"
                step={0.1}
                min={0}
                max={30}
                disabled={Boolean(
                  settings.taxMode === 'country_scale' &&
                    countryPreset.levyBrackets
                )}
                value={settings.medicareLevyRate}
                onChange={(e) =>
                  onUpdateSettings({
                    medicareLevyRate: Math.max(
                      0,
                      parseFloat(e.target.value) || 0
                    ),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              {settings.taxMode === 'country_scale' &&
                countryPreset.levyBrackets && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Uses tiered {settings.levyLabel} bands / cap
                  </span>
                )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Private Health Premium ({settings.currencySymbol}/month)
              </label>
              <input
                type="number"
                min={0}
                value={settings.phiMonthlyCost}
                onChange={(e) =>
                  onUpdateSettings({
                    phiMonthlyCost: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Other Monthly Deduction Label
              </label>
              <input
                type="text"
                value={settings.otherMonthlyDeductionLabel}
                onChange={(e) =>
                  onUpdateSettings({
                    otherMonthlyDeductionLabel: e.target.value,
                  })
                }
                className="w-full px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Other Deduction ({settings.currencySymbol}/month)
              </label>
              <input
                type="number"
                min={0}
                value={settings.otherMonthlyDeduction}
                onChange={(e) =>
                  onUpdateSettings({
                    otherMonthlyDeduction: Math.max(
                      0,
                      parseFloat(e.target.value) || 0
                    ),
                  })
                }
                className="w-full px-3 py-2 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-5 text-xs">
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includeMedicareLevy}
                onChange={(e) =>
                  onUpdateSettings({ includeMedicareLevy: e.target.checked })
                }
                className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
              />
              <span>Include {settings.levyLabel}</span>
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hasPrivateHealth}
                onChange={(e) =>
                  onUpdateSettings({ hasPrivateHealth: e.target.checked })
                }
                className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
              />
              <span>Deduct Private Health</span>
            </label>
            {settings.countryCode === 'AU' && (
              <>
                <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.includeMedicareSurcharge}
                    onChange={(e) =>
                      onUpdateSettings({
                        includeMedicareSurcharge: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                  />
                  <span>Medicare Levy Surcharge (if no PHI)</span>
                </label>
                <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.hasHecsHelp}
                    onChange={(e) =>
                      onUpdateSettings({ hasHecsHelp: e.target.checked })
                    }
                    className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                  />
                  <span>HECS-HELP Loan</span>
                </label>
              </>
            )}
          </div>
        </section>

        {/* Income Tax Mode & Brackets */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Income Tax Scale ({countryPreset.name})
                </h2>
                <InfoTooltip {...taxTooltip} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeAuthorityLabel} ·{' '}
                {settings.autoLatestRules && settings.taxMode === 'country_scale'
                  ? `Auto-latest (${latestRules.taxYearLabel})`
                  : 'Custom / Historical override'}
              </p>
            </div>
            <div className="inline-flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(
                [
                  { id: 'country_scale', label: 'Country Scale' },
                  { id: 'custom_flat', label: 'Flat %' },
                  { id: 'custom_brackets', label: 'Custom Brackets' },
                ] as Array<{ id: TaxMode; label: string }>
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onUpdateSettings({ taxMode: m.id })}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    settings.taxMode === m.id
                      ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {settings.taxMode === 'country_scale' && (
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3">
              {settings.countryCode === 'AU' && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Latest {latestRules.taxYearLabel} ATO Resident Scale (15% tier on $18,201–$45,000)
                  </span>

                  <div className="flex flex-wrap items-center gap-4">
                    <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.claimTaxFreeThreshold}
                        onChange={(e) =>
                          onUpdateSettings({
                            claimTaxFreeThreshold: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                      />
                      <span>{t('calc.taxFreeThreshold')}</span>
                    </label>

                    <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.useAtoPaygRounding}
                        onChange={(e) =>
                          onUpdateSettings({
                            useAtoPaygRounding: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-teal-600 accent-teal-600 dark:accent-teal-500 focus:ring-teal-500/30"
                      />
                      <span>ATO PAYG Monthly Rounding</span>
                    </label>
                  </div>
                </div>
              )}

              {settings.countryCode === 'VN' && (
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Deducts {settings.medicareLevyRate}% Social Insurance + ₫15.5M/mo self + ₫6.2M/mo per dependent before PIT
                  </span>
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-100">
                    <span>Dependents</span>
                    <select
                      value={settings.vnDependents}
                      onChange={(e) =>
                        onUpdateSettings({
                          vnDependents: Math.max(0, Number(e.target.value) || 0),
                        })
                      }
                      className="px-2.5 py-1 font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md"
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden font-mono tabular-nums max-h-64 overflow-y-auto">
                {activeScaleBrackets.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between px-3 py-2 bg-slate-50/50 dark:bg-slate-800/50"
                  >
                    <span>
                      {settings.currencySymbol}
                      {b.min.toLocaleString()} –{' '}
                      {b.max
                        ? `${settings.currencySymbol}${b.max.toLocaleString()}`
                        : 'and above'}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {b.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {settings.taxMode === 'custom_flat' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Apply a flat tax rate across all gross taxable income.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Flat Income Tax Rate (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={70}
                  step={0.5}
                  value={settings.customFlatTaxRate}
                  onChange={(e) =>
                    onUpdateSettings({
                      customFlatTaxRate: Math.max(
                        0,
                        Math.min(70, parseFloat(e.target.value) || 0)
                      ),
                    })
                  }
                  className="w-40 px-3 py-2 text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                />
              </div>
            </div>
          )}

          {settings.taxMode === 'custom_brackets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Edit annual income thresholds and marginal tax rates (%)
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      customBrackets: latestRules.brackets,
                    })
                  }
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer"
                >
                  Reset to {countryPreset.name} ({latestRules.taxYearLabel})
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {settings.customBrackets.map((b) => (
                  <div
                    key={b.id}
                    className="grid grid-cols-3 gap-2 items-center text-xs font-mono"
                  >
                    <input
                      type="number"
                      min={0}
                      value={b.min}
                      onChange={(e) =>
                        handleBracketChange(b.id, 'min', e.target.value)
                      }
                      aria-label="Bracket minimum"
                      className="w-full min-w-0 px-2 sm:px-2.5 py-1.5 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="No max"
                      value={b.max ?? ''}
                      onChange={(e) =>
                        handleBracketChange(b.id, 'max', e.target.value)
                      }
                      aria-label="Bracket maximum"
                      className="w-full min-w-0 px-2 sm:px-2.5 py-1.5 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                    />
                    <div className="flex items-center gap-1 min-w-0">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={b.rate}
                        onChange={(e) =>
                          handleBracketChange(b.id, 'rate', e.target.value)
                        }
                        aria-label="Bracket tax rate percent"
                        className="w-full min-w-0 px-2 sm:px-2.5 py-1.5 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
                      />
                      <span className="text-slate-500 dark:text-slate-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Schedule & Currency */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Hours / Day
              </label>
              <input
                type="number"
                step={0.1}
                min={1}
                max={16}
                value={settings.standardHoursPerDay}
                onChange={(e) =>
                  onUpdateSettings({
                    standardHoursPerDay: Math.max(
                      1,
                      parseFloat(e.target.value) || 7.6
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Days / Week
              </label>
              <input
                type="number"
                step={0.5}
                min={1}
                max={7}
                value={settings.standardDaysPerWeek}
                onChange={(e) =>
                  onUpdateSettings({
                    standardDaysPerWeek: Math.max(
                      1,
                      Math.min(7, parseFloat(e.target.value) || 5)
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Weeks / Year
              </label>
              <input
                type="number"
                min={1}
                max={53}
                value={settings.weeksPerYear}
                onChange={(e) =>
                  onUpdateSettings({
                    weeksPerYear: Math.max(
                      1,
                      Math.min(53, parseFloat(e.target.value) || 52)
                    ),
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Code
              </label>
              <input
                type="text"
                maxLength={5}
                value={settings.currencyCode}
                onChange={(e) =>
                  onUpdateSettings({
                    currencyCode: e.target.value.toUpperCase() || 'AUD',
                  })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Symbol
              </label>
              <input
                type="text"
                maxLength={4}
                value={settings.currencySymbol}
                onChange={(e) =>
                  onUpdateSettings({ currencySymbol: e.target.value || '$' })
                }
                className="w-full px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
