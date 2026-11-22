import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  Share2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHARE_TITLE = 'PocketWage — Salary, Payrise & Retirement Calculator';
const SHARE_TEXT =
  'Calculate net take-home pay, compare payrises, and project retirement growth across 26 countries with PocketWage:';

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [nativeError, setNativeError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setNativeError(null);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://pocketwage.app';
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(SHARE_TEXT);

  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        input.setAttribute('readonly', '');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setNativeError(null);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setNativeError('Unable to copy automatically — please copy the link above.');
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      setNativeError(null);
      await navigator.share({
        title: SHARE_TITLE,
        text: SHARE_TEXT,
        url: shareUrl,
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setNativeError(
        'Device share is unavailable in this preview — use a social link or Copy Link below.'
      );
    }
  };

  const socialTargets = [
    {
      id: 'x',
      label: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      badge: '𝕏',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      badge: 'in',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      badge: 'f',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${shareUrl}`)}`,
      badge: 'WA',
    },
    {
      id: 'telegram',
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      badge: 'TG',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/55 dark:bg-slate-950/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2
              id="share-modal-title"
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Share Pocket<span className="text-teal-600 dark:text-teal-400">Wage</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Invite friends or colleagues to try the calculator.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Copy App URL */}
          <div>
            <label
              htmlFor="share-app-url"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              App Link
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-app-url"
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 min-w-0 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 dark:focus:border-teal-400"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Share to Social Media
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {socialTargets.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-teal-50/60 dark:hover:bg-teal-950/40 hover:border-teal-400 dark:hover:border-teal-600 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                >
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-[11px] font-mono font-bold text-teal-700 dark:text-teal-300 shrink-0"
                    >
                      {platform.badge}
                    </span>
                    <span className="truncate">{platform.label}</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                </a>
              ))}

              <a
                href={`mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${shareUrl}`)}`}
                className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-teal-50/60 dark:hover:bg-teal-950/40 hover:border-teal-400 dark:hover:border-teal-600 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <span className="inline-flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-teal-700 dark:text-teal-300 shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <span className="truncate">Email</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              </a>
            </div>
          </div>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/80 hover:bg-teal-100/70 dark:hover:bg-teal-900/60 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via Device Sheet</span>
            </button>
          )}

          {nativeError && (
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              {nativeError}
            </p>
          )}
        </div>

        {/* Privacy Footer */}
        <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Only the app link is shared — your salary and savings figures stay private.
          </span>
        </div>
      </div>
    </div>
  );
}
