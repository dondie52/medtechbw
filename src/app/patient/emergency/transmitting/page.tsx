'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEmergency } from '@/features/emergency';
import {
  STATE_PRESENTATION,
  TRANSMISSION_STEPS,
  canPatientCancel,
  isPastTransmission,
  transmissionStepStatus,
} from '@/features/emergency/states';
import { hasEmergencyRecord } from '@/types';
import { Button, Card, Icon } from '@/components/ui';
import { ConnectivityBanner } from '@/components/emergency';
import { ConfirmCancelEmergency } from '@/components/patient/ConfirmCancelEmergency';
import { cn } from '@/lib/cn';

/**
 * Transmission screen.
 *
 * The whole point of this screen is honesty about what has actually happened.
 * The headline changes only when the underlying state changes, and none of the
 * copy before `dispatch_confirmed` says a dispatcher has the emergency.
 */
export default function TransmittingPage() {
  const router = useRouter();
  const { session, actions } = useEmergency();
  const { state, emergency } = session;
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!hasEmergencyRecord(state)) {
      router.replace('/patient');
      return;
    }
    if (isPastTransmission(state)) router.replace('/patient/emergency/active');
    if (state === 'cancelled') router.replace('/patient');
  }, [state, router]);

  if (!emergency) return null;

  const presentation = STATE_PRESENTATION[state];
  const completed = TRANSMISSION_STEPS.filter(
    (step) => transmissionStepStatus(step, state) === 'complete',
  ).length;

  return (
    <div id="main" className="space-y-6 py-2">
      <section className="flex flex-col items-center pt-4 text-center">
        <div className="relative flex h-[168px] w-[168px] items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-emergency/25 motion-safe:animate-transmit-pulse"
          />
          <span className="relative flex h-[112px] w-[112px] items-center justify-center rounded-full bg-emergency text-white">
            <Icon name="campaign" size={52} />
          </span>
        </div>

        <h1
          role="status"
          aria-live="assertive"
          className={cn(
            'mt-6 text-[26px] font-bold leading-tight',
            presentation.tone === 'transmitting' ? 'text-emergency' : 'text-brand',
          )}
        >
          {presentation.patientHeadline}
        </h1>
        <p className="mt-2 max-w-[19rem] text-[15px] leading-relaxed text-ink-muted">
          {presentation.patientDetail}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-subtle">
          Step {Math.min(completed + 1, TRANSMISSION_STEPS.length)} of {TRANSMISSION_STEPS.length}
        </p>
      </section>

      <ConnectivityBanner />

      <Card className="p-4">
        <ol className="space-y-3">
          {TRANSMISSION_STEPS.map((step) => {
            const status = transmissionStepStatus(step, state);
            return (
              <li
                key={step.id}
                className={cn(
                  'flex items-center gap-3 rounded-control px-2 py-1.5',
                  status === 'current' && 'bg-brand-50',
                )}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    status === 'complete' && 'bg-success-container text-success-on-container',
                    status === 'current' && 'bg-brand-100 text-brand',
                    status === 'upcoming' && 'bg-surface-container text-ink-subtle',
                  )}
                >
                  {status === 'complete' ? (
                    <Icon name="check" size={17} />
                  ) : status === 'current' ? (
                    <Icon name="spinner" size={17} className="motion-safe:animate-spin-slow" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={cn(
                    'text-[15px]',
                    status === 'current' ? 'font-bold text-brand' : 'text-ink',
                    status === 'upcoming' && 'text-ink-subtle',
                  )}
                >
                  {step.label}
                </span>
                <span className="sr-only">
                  {status === 'complete' ? 'Done' : status === 'current' ? 'In progress' : 'Waiting'}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card tone="brand" className="p-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-brand">Your case reference</p>
        <p className="mt-1 font-mono text-lg font-bold text-brand-on-container">{emergency.id}</p>
        <p className="mt-1.5 text-sm text-ink-muted">
          Keep this screen open. Stay where you are if it is safe to do so.
        </p>
      </Card>

      {canPatientCancel(state) ? (
        <>
          <Button
            variant="destructive-text"
            size="md"
            fullWidth
            icon="cancel"
            onClick={() => setConfirmOpen(true)}
          >
            Cancel emergency
          </Button>
          <ConfirmCancelEmergency
            open={confirmOpen}
            onKeepActive={() => setConfirmOpen(false)}
            onConfirmCancel={() => {
              setConfirmOpen(false);
              actions.cancelEmergency('Cancelled by patient during transmission');
            }}
          />
        </>
      ) : null}
    </div>
  );
}
