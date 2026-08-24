'use client';

import { useState } from 'react';
import { DEMO_DISPATCH_LINE, DEMO_PATIENT_PROFILE } from '@/data';
import { telHref } from '@/lib/format';
import { useEmergency } from '@/features/emergency';
import { canPatientCancel } from '@/features/emergency/states';
import { Button, Card, Icon, Switch, buttonClasses } from '@/components/ui';
import { ConfirmCancelEmergency } from './ConfirmCancelEmergency';

/**
 * The four things a patient can do during a live emergency.
 *
 * Order is intentional: reaching a human first, then the non-verbal channel,
 * and cancellation last and visually quietest.
 */
export function EmergencyActions() {
  const { session, actions } = useEmergency();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const emergency = session.emergency;
  const primaryContact = DEMO_PATIENT_PROFILE.emergencyContacts.find((contact) => contact.isPrimary);

  const cannotSpeakFlag = emergency?.communicationFlags.find(
    (flag) => flag.code === 'patient_may_be_unable_to_speak',
  );
  const flagRaised = Boolean(cannotSpeakFlag);
  const flagAcknowledged = Boolean(cannotSpeakFlag?.acknowledgedAt);

  return (
    <div className="space-y-3">
      {/* Real anchors, not buttons that fake navigation: the phone dialler is a
          browser capability and assistive technology should announce it as a link. */}
      <a
        href={telHref(DEMO_DISPATCH_LINE)}
        className={buttonClasses({ variant: 'primary', size: 'lg', fullWidth: true })}
      >
        <Icon name="call" size={22} />
        Call dispatch
      </a>

      {primaryContact ? (
        <a
          href={telHref(primaryContact.phone)}
          className={buttonClasses({ variant: 'secondary', size: 'lg', fullWidth: true })}
        >
          <Icon name="group" size={22} />
          Contact {primaryContact.relationship.toLowerCase()}
        </a>
      ) : null}

      {/*
        "I can't speak" is a communication event, not a local toggle. The patient
        is told dispatch has been notified only once dispatch has actually
        acknowledged it - until then the honest status is "sending".
      */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container text-ink-muted">
            <Icon name="voice-off" size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold uppercase tracking-wide text-ink">
              I can&apos;t speak
            </p>
            <p id="cannot-speak-help" className="mt-0.5 text-xs leading-snug text-ink-muted">
              Tells dispatch you may be unable to talk on the phone. No typing needed.
            </p>
          </div>
          <Switch
            checked={flagRaised}
            disabled={flagRaised}
            onChange={(next) => {
              if (next) actions.raiseCannotSpeak();
            }}
            label="Tell dispatch I may be unable to speak"
            describedBy="cannot-speak-help"
          />
        </div>

        {flagRaised ? (
          <p
            role="status"
            aria-live="polite"
            className={
              flagAcknowledged
                ? 'mt-3 flex items-start gap-2 rounded-control bg-success-container/60 px-3 py-2 text-sm font-medium text-success-on-container'
                : 'mt-3 flex items-start gap-2 rounded-control bg-caution-container/70 px-3 py-2 text-sm font-medium text-caution-on-container'
            }
          >
            <Icon name={flagAcknowledged ? 'check-circle' : 'spinner'} size={16} className="mt-0.5" />
            {flagAcknowledged
              ? 'Dispatch has been notified that you may be unable to speak.'
              : 'Sending to dispatch. You will be told when dispatch has this.'}
          </p>
        ) : null}
      </Card>

      {canPatientCancel(session.state) ? (
        <>
          <hr className="border-line" />
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
              actions.cancelEmergency('Cancelled by patient - assistance no longer needed');
            }}
          />
        </>
      ) : (
        <p className="rounded-control bg-surface-low px-4 py-3 text-center text-sm text-ink-muted">
          A response team is with you. Speak to them directly if help is no longer needed.
        </p>
      )}
    </div>
  );
}
