'use client';

import { cn } from '@/lib/cn';
import { useEmergency } from '@/features/emergency';
import type { ConnectionStatus } from '@/types';
import { Icon, type IconName } from '@/components/ui';

interface BannerCopy {
  title: string;
  detail: string;
  icon: IconName;
  className: string;
}

/**
 * Connectivity copy.
 *
 * Two rules shape every string here. First, weak and reconnecting are amber,
 * not red: the alert has not failed, so the screen must not look like it has.
 * Second, nothing promises a fallback channel - MedLink has no SMS path today,
 * and the offline state says so rather than leaving the patient to assume one.
 */
const COPY: Partial<Record<ConnectionStatus, BannerCopy>> = {
  weak: {
    title: 'Weak connection',
    detail: 'MedLink is continuing to send your emergency alert.',
    icon: 'signal-weak',
    className: 'bg-caution-container text-caution-on-container border-caution/40',
  },
  reconnecting: {
    title: 'Reconnecting',
    detail: 'MedLink is trying to reach the network again. Your emergency has not been cancelled.',
    icon: 'refresh',
    className: 'bg-caution-container text-caution-on-container border-caution/40',
  },
  offline: {
    title: 'No connection',
    detail:
      'MedLink cannot reach the network right now and will keep retrying. Keep this screen open. SMS backup is not available yet.',
    icon: 'signal-off',
    className: 'bg-emergency-container text-emergency-on-container border-emergency/40',
  },
};

export function ConnectivityBanner({ className }: { className?: string }) {
  const { session } = useEmergency();
  const copy = COPY[session.connection.status];
  if (!copy) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-card border px-4 py-3',
        copy.className,
        className,
      )}
    >
      <Icon name={copy.icon} size={20} className="mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-bold">{copy.title}</p>
        <p className="text-sm leading-snug">{copy.detail}</p>
      </div>
    </div>
  );
}

/** Compact indicator for app bars. */
export function ConnectivityDot({ className }: { className?: string }) {
  const { session } = useEmergency();
  const status = session.connection.status;

  const label: Record<ConnectionStatus, string> = {
    online: 'Connected',
    weak: 'Weak connection',
    reconnecting: 'Reconnecting',
    offline: 'No connection',
  };
  const dot: Record<ConnectionStatus, string> = {
    online: 'bg-success',
    weak: 'bg-caution-accent',
    reconnecting: 'bg-caution-accent',
    offline: 'bg-emergency',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-ink-muted', className)}>
      <span className={cn('h-2 w-2 rounded-full', dot[status])} aria-hidden />
      {label[status]}
    </span>
  );
}
