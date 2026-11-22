import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useI18n } from '../i18n';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { t } = useI18n();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-xl bg-amber-600 dark:bg-amber-700 px-3.5 py-2 text-xs font-semibold text-white shadow-lg no-print"
    >
      <WifiOff className="w-3.5 h-3.5 shrink-0" />
      <span>{t('offline.banner')}</span>
    </div>
  );
}
