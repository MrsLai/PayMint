import { Check, Contrast, Moon, Palette, RotateCcw, Sun } from 'lucide-react';
import {
  ACCENT_PRESETS,
  AccentColorId,
  getAccentPreset,
  getThemeModePreset,
  THEME_MODES,
  ThemeMode,
} from '../data/themePresets';
import { useI18n } from '../i18n';

interface ThemeSettingsViewProps {
  embedded?: boolean;
  themeMode: ThemeMode;
  accentColor: AccentColorId;
  onChangeThemeMode: (mode: ThemeMode) => void;
  onChangeAccentColor: (accent: AccentColorId) => void;
  onResetTheme: () => void;
}

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  light: Sun,
  dark: Moon,
  midnight: Contrast,
};

export function ThemeSettingsView({
  embedded = false,
  themeMode,
  accentColor,
  onChangeThemeMode,
  onChangeAccentColor,
  onResetTheme,
}: ThemeSettingsViewProps) {
  const { t } = useI18n();
  const activeModePreset = getThemeModePreset(themeMode);
  const activeAccentPreset = getAccentPreset(accentColor);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {embedded ? (
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
              {t('theme.title')}
            </h2>
          ) : (
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 text-balance">
              {t('theme.title')}
            </h1>
          )}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeModePreset.name} · {activeAccentPreset.name}
          </p>
        </div>

        <button
          id="theme-settings-primary-control"
          type="button"
          onClick={onResetTheme}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 active:scale-[0.98] rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('theme.resetDefault')}</span>
        </button>
      </div>

      {/* Section 1: Display Mode (Light / Dark / Midnight High Contrast) */}
      <section
        aria-labelledby="display-mode-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="display-mode-heading"
              className="text-base font-semibold text-slate-900 dark:text-slate-100"
            >
              {t('theme.displayMode')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('theme.displayModeDesc')}
            </p>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Shortcut: <kbd className="font-mono font-semibold text-slate-700 dark:text-slate-200">T</kbd> or{' '}
            <kbd className="font-mono font-semibold text-slate-700 dark:text-slate-200">Alt+T</kbd>
          </span>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="display-mode-heading"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {THEME_MODES.map((mode) => {
            const isSelected = themeMode === mode.id;
            const ModeIcon = MODE_ICONS[mode.id];
            return (
              <button
                key={mode.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChangeThemeMode(mode.id)}
                className={`text-left rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-400 ring-2 ring-teal-500/20 dark:ring-teal-400/25 bg-teal-50/40 dark:bg-teal-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Miniature UI Contrast Preview */}
                <div
                  aria-hidden="true"
                  style={{
                    backgroundColor: mode.previewBg,
                    borderColor: mode.previewBorder,
                  }}
                  className="w-full rounded-xl border p-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      style={{ color: mode.previewText }}
                      className="text-[11px] font-bold tracking-tight"
                    >
                      PocketWage
                    </span>
                    <span
                      style={{ backgroundColor: activeAccentPreset.swatchHex }}
                      className="h-4 w-12 rounded-md"
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: mode.previewCard,
                      borderColor: mode.previewBorder,
                    }}
                    className="rounded-lg border p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div
                        style={{ color: mode.previewMuted }}
                        className="text-[10px] font-medium"
                      >
                        Net Take-Home
                      </div>
                      <div
                        style={{ color: mode.previewText }}
                        className="text-xs font-mono font-bold tabular-nums"
                      >
                        $6,842.50
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor:
                          mode.id === 'light'
                            ? '#ecfdf5'
                            : mode.id === 'midnight'
                              ? '#052e16'
                              : '#064e3b',
                        color: mode.id === 'light' ? '#047857' : '#34d399',
                      }}
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                    >
                      +12.5%
                    </span>
                  </div>
                </div>

                {/* Mode Title & Description */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                      <ModeIcon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <span className="truncate">{mode.name}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {mode.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Accent Color Palette */}
      <section
        aria-labelledby="accent-color-heading"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="accent-color-heading"
              className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"
            >
              <Palette className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{t('theme.accentColor')}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('theme.accentColorDesc')}
            </p>
          </div>
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
            Selected: {activeAccentPreset.name}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="accent-color-heading"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {ACCENT_PRESETS.map((preset) => {
            const isSelected = accentColor === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChangeAccentColor(preset.id)}
                className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  isSelected
                    ? 'border-teal-600 dark:border-teal-400 ring-2 ring-teal-500/20 dark:ring-teal-400/25 bg-teal-50/40 dark:bg-teal-950/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: preset.swatchHex }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {preset.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Interactive Component & Contrast Preview */}
      <section
        aria-label="Live Theme Preview"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] dark:shadow-none"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Live Surface &amp; Control Preview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Changes apply immediately across every calculator, comparison table, and chart.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums font-semibold text-teal-700 dark:text-teal-300">
            {activeModePreset.shortLabel} · {activeAccentPreset.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              Primary &amp; Secondary Actions
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-xl shadow-xs">
                Primary Button
              </span>
              <span className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 rounded-xl">
                Secondary Action
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-teal-500 ring-2 ring-teal-500/20 dark:border-teal-400 dark:ring-teal-400/25 bg-white dark:bg-slate-900 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-700 dark:text-teal-300">
                Active Focus Card
              </span>
              <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                Annual
              </span>
            </div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              $120,000.00
            </div>
            <div className="text-[11px] font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
              Take-Home: $89,212.00 / yr
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Compound Interest Accent
              </span>
              <span className="font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">
                +7.0% p.a.
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-teal-600 dark:bg-teal-400 rounded-full" />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              High-legibility contrast for tables &amp; Recharts series
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
