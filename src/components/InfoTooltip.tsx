import { Info, X } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface InfoTooltipProps {
  title: string;
  subtitle?: string;
  description: string;
  formula?: string;
  ariaLabel?: string;
}

export function InfoTooltip({
  title,
  subtitle,
  description,
  formula,
  ariaLabel,
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: 'bottom' | 'top';
  } | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const popoverId = useId();

  const clearPendingClose = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const popEl = popoverRef.current;
    const popW = popEl ? popEl.offsetWidth : Math.min(304, window.innerWidth - 24);
    const popH = popEl ? popEl.offsetHeight : 140;

    const margin = 12;
    let left = rect.left + rect.width / 2 - popW / 2;
    left = Math.max(margin, Math.min(window.innerWidth - popW - margin, left));

    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < popH + 14 && rect.top > popH + 14;
    const top = showAbove ? rect.top - popH - 8 : rect.bottom + 8;

    setCoords({
      top: Math.max(margin, top),
      left,
      placement: showAbove ? 'top' : 'bottom',
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    const raf = window.requestAnimationFrame(updatePosition);
    return () => window.cancelAnimationFrame(raf);
  }, [open, title, description, formula]);

  useEffect(() => {
    if (!open) return;

    const handleScrollOrResize = () => updatePosition();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setPinned(false);
      }
    };
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setPinned(false);
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [open]);

  useEffect(() => () => clearPendingClose(), []);

  const handleMouseEnter = () => {
    clearPendingClose();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (pinned) return;
    clearPendingClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 120);
  };

  const handleClick = () => {
    clearPendingClose();
    if (open && pinned) {
      setOpen(false);
      setPinned(false);
    } else {
      setOpen(true);
      setPinned(true);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel ?? `How ${title} is calculated`}
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full align-middle transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40 ${
          open
            ? 'text-teal-700 dark:text-teal-300 bg-teal-100/80 dark:bg-teal-950/70'
            : 'text-slate-400 dark:text-slate-500 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/50'
        }`}
      >
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            id={popoverId}
            role="dialog"
            aria-label={title}
            onMouseEnter={clearPendingClose}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'fixed',
              top: coords ? `${coords.top}px` : '-9999px',
              left: coords ? `${coords.left}px` : '-9999px',
              visibility: coords ? 'visible' : 'hidden',
            }}
            className="z-50 w-[min(320px,calc(100vw-24px))] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] p-3.5 text-left space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {title}
                </div>
                {subtitle && (
                  <div className="text-[11px] font-medium text-teal-700 dark:text-teal-300 mt-0.5">
                    {subtitle}
                  </div>
                )}
              </div>
              <button
                type="button"
                aria-label="Close explanation"
                onClick={() => {
                  setOpen(false);
                  setPinned(false);
                }}
                className="p-0.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>

            {formula && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 px-2.5 py-1.5 text-[11px] font-mono tabular-nums text-slate-700 dark:text-slate-200 leading-snug">
                {formula}
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
