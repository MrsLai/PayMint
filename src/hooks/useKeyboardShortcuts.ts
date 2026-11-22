import { useEffect } from 'react';
import { ActiveTab } from '../components/TopBar';

interface UseKeyboardShortcutsOptions {
  activeTab: ActiveTab;
  isModalOpen: boolean;
  isShortcutsOpen: boolean;
  hasAnyAmount: boolean;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenThemeSettings: () => void;
  onClearAmounts: () => void;
  onToggleTheme: () => void;
  onOpenShare: () => void;
  onToggleShortcutsHelp: () => void;
  onFocusPrimaryInput: () => void;
  onAnnounce: (message: string) => void;
}

const TAB_KEYS: Record<string, { tab: ActiveTab; label: string }> = {
  '1': { tab: 'calculator', label: 'Calculator' },
  '2': { tab: 'compare', label: 'Payrise Compare' },
  '3': { tab: 'retirement', label: 'Retirement' },
  '4': { tab: 'settings', label: 'Settings' },
};

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest('[contenteditable="true"]'));
}

export function useKeyboardShortcuts({
  activeTab,
  isModalOpen,
  isShortcutsOpen,
  hasAnyAmount,
  onSelectTab,
  onOpenThemeSettings,
  onClearAmounts,
  onToggleTheme,
  onOpenShare,
  onToggleShortcutsHelp,
  onFocusPrimaryInput,
  onAnnounce,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;

      const key = e.key.toLowerCase();
      const inEditable = isEditableElement(e.target);
      const hasOtherModal =
        !isShortcutsOpen &&
        (isModalOpen ||
          Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')));

      // Ctrl + / toggles Keyboard Shortcuts modal (unless another modal is open)
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.altKey &&
        !e.shiftKey &&
        (e.key === '/' || e.key === '?')
      ) {
        if (!hasOtherModal) {
          e.preventDefault();
          onToggleShortcutsHelp();
        }
        return;
      }

      // Single-key '?' opens/toggles Keyboard Shortcuts when not typing in an input
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key === '?' &&
        !inEditable
      ) {
        if (!hasOtherModal) {
          e.preventDefault();
          onToggleShortcutsHelp();
        }
        return;
      }

      // When any modal is open, defer Escape/navigation handling to the modal itself
      if (isModalOpen || isShortcutsOpen || hasOtherModal) {
        return;
      }

      // Escape inside an editable input blurs it so keyboard nav & single-key shortcuts work
      if (e.key === 'Escape' && inEditable && e.target instanceof HTMLElement) {
        e.target.blur();
        return;
      }

      // Navigation: Ctrl+1..5 or Alt+1..5 (without Shift/Meta)
      const isNavModifier =
        (e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) ||
        (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey);

      if (isNavModifier && key === '5') {
        e.preventDefault();
        onOpenThemeSettings();
        return;
      }

      if (isNavModifier && key in TAB_KEYS) {
        e.preventDefault();
        const target = TAB_KEYS[key];
        if (activeTab !== target.tab) {
          onSelectTab(target.tab);
          onAnnounce(`Switched to ${target.label}`);
        }
        return;
      }

      // Clear all amounts: Ctrl+Shift+X or Alt+X
      const isClearShortcut =
        (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && key === 'x') ||
        (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey && key === 'x');

      if (isClearShortcut) {
        e.preventDefault();
        if (hasAnyAmount) {
          onClearAmounts();
          onAnnounce('All salary and savings amounts cleared');
        } else {
          onAnnounce('Amounts are already empty');
        }
        return;
      }

      // Focus primary input: Alt+F (anywhere) or '/' (outside editable inputs)
      const isFocusShortcut =
        (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && key === 'f') ||
        (!e.ctrlKey &&
          !e.metaKey &&
          !e.altKey &&
          !e.shiftKey &&
          e.key === '/' &&
          !inEditable);

      if (isFocusShortcut) {
        e.preventDefault();
        onFocusPrimaryInput();
        return;
      }

      // Toggle dark/light theme: Alt+T (anywhere) or 't' (outside editable inputs)
      const isThemeShortcut =
        (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && key === 't') ||
        (!e.ctrlKey &&
          !e.metaKey &&
          !e.altKey &&
          !e.shiftKey &&
          key === 't' &&
          !inEditable);

      if (isThemeShortcut) {
        e.preventDefault();
        onToggleTheme();
        return;
      }

      // Open Share dialog: Alt+S (anywhere) or 's' (outside editable inputs)
      const isShareShortcut =
        (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && key === 's') ||
        (!e.ctrlKey &&
          !e.metaKey &&
          !e.altKey &&
          !e.shiftKey &&
          key === 's' &&
          !inEditable);

      if (isShareShortcut) {
        e.preventDefault();
        onOpenShare();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    isModalOpen,
    isShortcutsOpen,
    hasAnyAmount,
    onSelectTab,
    onOpenThemeSettings,
    onClearAmounts,
    onToggleTheme,
    onOpenShare,
    onToggleShortcutsHelp,
    onFocusPrimaryInput,
    onAnnounce,
  ]);
}
