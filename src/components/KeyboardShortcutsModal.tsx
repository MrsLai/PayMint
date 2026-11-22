import { Keyboard, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutEntry {
  action: string;
  description: string;
  combos: string[][];
}

const SHORTCUT_GROUPS: Array<{
  title: string;
  items: ShortcutEntry[];
}> = [
  {
    title: 'Navigation',
    items: [
      {
        action: 'Calculator',
        description: 'Open Salary & Net Take-Home Calculator',
        combos: [
          ['Ctrl', '1'],
          ['Alt', '1'],
        ],
      },
      {
        action: 'Payrise Compare',
        description: 'Open Payrise & Job Offer Comparison',
        combos: [
          ['Ctrl', '2'],
          ['Alt', '2'],
        ],
      },
      {
        action: 'Retirement',
        description: 'Open Retirement Wealth Projections',
        combos: [
          ['Ctrl', '3'],
          ['Alt', '3'],
        ],
      },
      {
        action: 'Settings',
        description: 'Open Global Settings (Tax, Theme & Preferences)',
        combos: [
          ['Ctrl', '4'],
          ['Alt', '4'],
        ],
      },
      {
        action: 'Theme Settings',
        description: 'Jump directly to Theme & Appearance in Settings',
        combos: [
          ['Ctrl', '5'],
          ['Alt', '5'],
        ],
      },
    ],
  },
  {
    title: 'Common Actions',
    items: [
      {
        action: 'Clear Amounts',
        description: 'Reset all salary, compare & savings amounts',
        combos: [
          ['Ctrl', 'Shift', 'X'],
          ['Alt', 'X'],
        ],
      },
      {
        action: 'Focus Input',
        description: 'Jump cursor to the active view’s primary field',
        combos: [['/'], ['Alt', 'F']],
      },
      {
        action: 'Exit Field / Close',
        description: 'Unfocus current input or dismiss open dialog',
        combos: [['Esc']],
      },
    ],
  },
  {
    title: 'Workspace & Help',
    items: [
      {
        action: 'Cycle Theme Mode',
        description: 'Cycle Light, Dark, and Midnight high-contrast modes',
        combos: [['T'], ['Alt', 'T']],
      },
      {
        action: 'Share PocketWage',
        description: 'Open social share and copy link dialog',
        combos: [['S'], ['Alt', 'S']],
      },
      {
        action: 'Keyboard Shortcuts',
        description: 'Show or hide this shortcuts guide',
        combos: [['?'], ['Ctrl', '/']],
      },
    ],
  },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="shortcuts-modal-title"
                className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
              >
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Navigate views and perform quick actions without leaving your keyboard.
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcut Groups */}
        <div className="p-5 sm:p-6 space-y-5">
          {SHORTCUT_GROUPS.map((group) => (
            <section key={group.title} aria-label={group.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                {group.title}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/35 overflow-hidden">
                {group.items.map((item) => (
                  <div
                    key={item.action}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {item.action}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.description}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {item.combos.map((combo, idx) => (
                        <span
                          key={combo.join('+')}
                          className="inline-flex items-center gap-1"
                        >
                          {idx > 0 && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 px-0.5">
                              or
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            {combo.map((keyLabel) => (
                              <kbd
                                key={keyLabel}
                                className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-[0_1px_0_rgba(15,23,42,0.06)] dark:shadow-none"
                              >
                                {keyLabel}
                              </kbd>
                            ))}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 sm:px-6 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Tip: Single-key shortcuts (<kbd className="font-mono font-semibold text-slate-700 dark:text-slate-200">/</kbd>,{' '}
            <kbd className="font-mono font-semibold text-slate-700 dark:text-slate-200">T</kbd>,{' '}
            <kbd className="font-mono font-semibold text-slate-700 dark:text-slate-200">S</kbd>,{' '}
            <kbd className="font-mono font-semibold text-slate-700 dark:text-slate-200">?</kbd>) pause while typing in an input.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
