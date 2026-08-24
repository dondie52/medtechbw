'use client';

import { useState } from 'react';
import { useEmergency } from '@/features/emergency';
import { STATE_PRESENTATION } from '@/features/emergency/states';
import type { ConnectionStatus } from '@/types';
import { Button, Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

const CONNECTIVITY: ReadonlyArray<{ status: ConnectionStatus; label: string }> = [
  { status: 'online', label: 'Online' },
  { status: 'weak', label: 'Weak' },
  { status: 'reconnecting', label: 'Reconnecting' },
  { status: 'offline', label: 'Offline' },
];

/**
 * Demo-only control panel.
 *
 * Connectivity cannot be made poor on demand in a browser, and the low-signal
 * behaviour is a core MedLink requirement, so it is simulated here. This panel
 * would not exist in a production build.
 */
export function DemoControls() {
  const [open, setOpen] = useState(false);
  const { session, actions } = useEmergency();

  return (
    <div className="fixed bottom-20 right-3 z-40 print:hidden sm:bottom-4">
      {open ? (
        <div className="w-[268px] rounded-card border border-line bg-surface p-4 shadow-raised">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-subtle">
              Demo controls
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close demo controls"
              className="flex h-8 w-8 items-center justify-center rounded-pill text-ink-muted hover:bg-surface-container"
            >
              <Icon name="close" size={16} />
            </button>
          </div>

          <dl className="mt-3 text-xs">
            <dt className="text-ink-subtle">Emergency state</dt>
            <dd className="font-mono text-[11px] font-semibold text-ink">{session.state}</dd>
            <dd className="text-ink-muted">{STATE_PRESENTATION[session.state].dispatcherLabel}</dd>
            {session.emergency ? (
              <>
                <dt className="mt-2 text-ink-subtle">Case</dt>
                <dd className="font-mono text-[11px] font-semibold text-ink">
                  {session.emergency.id}
                </dd>
              </>
            ) : null}
          </dl>

          <fieldset className="mt-3">
            <legend className="text-xs text-ink-subtle">Simulate connection</legend>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {CONNECTIVITY.map((option) => (
                <button
                  key={option.status}
                  type="button"
                  onClick={() => actions.setConnectivity(option.status, true)}
                  className={cn(
                    'min-h-[36px] rounded-control border px-2 text-xs font-semibold',
                    session.connection.status === option.status
                      ? 'border-brand bg-brand text-white'
                      : 'border-line bg-surface-low text-ink-muted hover:bg-surface-container',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {session.connection.simulated ? (
              <button
                type="button"
                onClick={() =>
                  actions.setConnectivity(
                    typeof navigator !== 'undefined' && navigator.onLine ? 'online' : 'offline',
                    false,
                  )
                }
                className="mt-1.5 text-xs font-semibold text-brand underline underline-offset-2"
              >
                Use real browser status
              </button>
            ) : null}
          </fieldset>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            icon="refresh"
            className="mt-3"
            onClick={actions.resetDemo}
          >
            Reset demo
          </Button>

          <p className="mt-3 text-[11px] leading-snug text-ink-subtle">
            Open <span className="font-semibold">/patient</span> and{' '}
            <span className="font-semibold">/dispatch</span> in two tabs - they share one emergency.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex min-h-touch items-center gap-2 rounded-pill border border-line bg-surface px-4 text-xs font-bold text-ink-muted shadow-raised hover:bg-surface-low"
        >
          <Icon name="settings" size={16} />
          Demo controls
        </button>
      )}
    </div>
  );
}
