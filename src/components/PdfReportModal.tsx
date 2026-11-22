import { Download, FileText, Printer, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { PaySettings, SalaryBreakdown } from '../types/wage';
import { useI18n } from '../i18n';
import { PrintableSalaryReport } from './PrintableSalaryReport';

interface PdfReportModalProps {
  isOpen: boolean;
  settings: PaySettings;
  breakdown: SalaryBreakdown;
  onClose: () => void;
  onAnnounce?: (message: string) => void;
}

export function PdfReportModal({
  isOpen,
  settings,
  breakdown,
  onClose,
  onAnnounce,
}: PdfReportModalProps) {
  const { language, t } = useI18n();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
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

  const handlePrint = () => {
    onAnnounce?.('Opening print dialog — choose Save as PDF');
    window.print();
  };

  const handleDownloadPrintableHtml = () => {
    const content = sheetRef.current?.innerHTML ?? '';
    const dateStamp = new Date().toISOString().slice(0, 10);
    const filename = `pocketwage-salary-report-${settings.countryCode.toLowerCase()}-${dateStamp}.html`;
    const htmlDoc = `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PocketWage Salary Report (${settings.countryCode} · ${dateStamp})</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 28px; line-height: 1.45; }
  .sheet { max-width: 820px; margin: 0 auto; }
  article > * + * { margin-top: 20px; }
  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 2px solid #0f172a; padding-bottom: 14px; }
  h1 { font-size: 18px; margin: 4px 0 0; }
  section { border-radius: 10px; }
  .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
  .flex { display: flex; }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-between { justify-content: space-between; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .gap-5 { gap: 20px; }
  .border { border: 1px solid #e2e8f0; }
  .border-b { border-bottom: 1px solid #e2e8f0; }
  .border-t { border-top: 1px solid #e2e8f0; }
  .rounded-xl { border-radius: 10px; overflow: hidden; }
  .rounded-full { border-radius: 9999px; overflow: hidden; }
  .p-3 { padding: 12px; }
  .p-4 { padding: 16px; }
  .px-4 { padding-left: 14px; padding-right: 14px; }
  .py-2 { padding-top: 8px; padding-bottom: 8px; }
  .py-2\\.5 { padding-top: 10px; padding-bottom: 10px; }
  .pt-2 { padding-top: 8px; }
  .mt-0\\.5 { margin-top: 2px; }
  .mt-1 { margin-top: 4px; }
  .h-3 { height: 10px; }
  .h-full { height: 100%; }
  .bg-slate-50, .bg-slate-50\\/70, .bg-slate-50\\/80 { background: #f8fafc; }
  .bg-slate-100 { background: #f1f5f9; }
  .bg-emerald-50\\/70 { background: #ecfdf5; }
  .bg-emerald-600 { background: #059669; }
  .bg-slate-700 { background: #334155; }
  .bg-amber-500 { background: #f59e0b; }
  .text-xs { font-size: 12px; }
  .text-\\[11px\\] { font-size: 11px; }
  .text-\\[10px\\] { font-size: 10px; }
  .text-lg { font-size: 17px; }
  .text-2xl { font-size: 22px; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }
  .font-semibold { font-weight: 600; }
  .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
  .text-right { text-align: right; }
  .text-emerald-700 { color: #047857; }
  .text-emerald-900 { color: #064e3b; }
  .text-sky-700 { color: #0369a1; }
  .text-teal-700 { color: #0f766e; }
  .text-slate-900 { color: #0f172a; }
  .text-slate-800 { color: #1e293b; }
  .text-slate-600 { color: #475569; }
  .text-slate-500 { color: #64748b; }
  .divide-y > * + * { border-top: 1px solid #f1f5f9; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
  th { background: #f8fafc; font-weight: 600; color: #475569; font-size: 11px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="sheet">${content}</div>
</body>
</html>`;

    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    onAnnounce?.(`Downloaded ${filename}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs no-print"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-report-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h2
                id="pdf-report-modal-title"
                className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate"
              >
                {t('pdf.previewTitle')}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {t('pdf.previewHint')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPrintableHtml}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('pdf.saveHtml')}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('pdf.printSavePdf')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('pdf.closePreview')}
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable White A4 Paper Preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div ref={sheetRef} className="max-w-3xl mx-auto">
            <PrintableSalaryReport
              settings={settings}
              breakdown={breakdown}
              isPreview
            />
          </div>
        </div>
      </div>
    </div>
  );
}
