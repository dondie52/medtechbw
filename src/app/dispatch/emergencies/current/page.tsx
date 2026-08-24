'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { DEMO_DISPATCHER, DEMO_EMERGENCY_SUMMARY, DEMO_PATIENT_PROFILE } from '@/data';
import { formatClock, formatElapsed, formatPhone } from '@/lib/format';
import { useEmergency, useNowMs } from '@/features/emergency';
import { formatLandmarkLine, formatLocationLine } from '@/types';
import { Button, Card, CardHeading, DemoNotice, Icon, InfoRow, StatusPill } from '@/components/ui';
import {
  EmergencyStatusBadge,
  EmergencySummaryCard,
  EmergencyTimeline,
  KnownVsCurrentPanel,
} from '@/components/emergency';

/**
 * The dispatcher's currently open emergency, in full, including the
 * role-authorised medical summary.
 *
 * This route deliberately has no dynamic `[id]` segment. The prototype has no
 * server to look a case up by ID against - it always shows whatever emergency
 * is live in the shared session - and a static export has no server to
 * generate an ID-keyed page on demand either, so a fixed URL is both the
 * honest architecture and the one that works on GitHub Pages.
 *
 * Opening this page is itself an access event: the dispatcher is reading a
 * patient's medical information, so it is written to the audit log once per
 * visit and surfaced back to the patient under Activity.
 */
export default function DispatchEmergencyDetailPage() {
  const { session, actions, assignedAmbulance, receivingFacility } = useEmergency();
  const nowMs = useNowMs(1000);
  const logged = useRef(false);

  const emergency = session.emergency;

  useEffect(() => {
    if (!emergency || logged.current) return;
    logged.current = true;
    actions.logDataAccess(
      ['emergency_medical_summary', 'allergies', 'medications', 'medical_history', 'emergency_contact'],
      `Opened emergency medical summary for ${emergency.id}`,
      DEMO_DISPATCHER,
    );
  }, [emergency, actions]);

  if (!emergency) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <Card className="p-6 text-center">
          <Icon name="info" size={32} className="mx-auto text-ink-subtle" />
          <h1 className="mt-3 text-xl font-bold text-ink">Emergency not available</h1>
          <p className="mt-1.5 text-sm text-ink-muted">No emergency is open in this session.</p>
          <Link
            href="/dispatch"
            className="mt-4 inline-block text-sm font-semibold text-brand underline underline-offset-2"
          >
            Back to live emergencies
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 lg:p-6">
      <div>
        <Link
          href="/dispatch"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-brand"
        >
          <Icon name="arrow-back" size={18} />
          Live emergencies
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-ink">{emergency.id}</h1>
            <EmergencyStatusBadge state={session.state} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            Alert received {formatClock(emergency.createdAt)} &middot; active for{' '}
            {formatElapsed(emergency.createdAt, nowMs)}
          </p>
        </div>

        {emergency.acceptedBy ? (
          <StatusPill tone="success" icon="check-circle">
            Accepted by {emergency.acceptedBy.displayName}
          </StatusPill>
        ) : (
          <Button variant="primary" size="md" icon="check-circle" onClick={actions.acceptEmergency}>
            Accept emergency
          </Button>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <Card className="p-4">
            <CardHeading icon="campaign" eyebrow>
              Emergency details
            </CardHeading>
            <dl className="mt-1 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="Patient" value={DEMO_PATIENT_PROFILE.patient.fullName} />
              <InfoRow label="Age" value={`${DEMO_PATIENT_PROFILE.patient.age}`} />
              <InfoRow label="Phone" value={formatPhone(DEMO_PATIENT_PROFILE.patient.phone)} />
              <InfoRow label="Alert time" value={formatClock(emergency.createdAt)} />
              <InfoRow label="Location" value={formatLocationLine(emergency.location)} />
              <InfoRow
                label="Landmark"
                value={formatLandmarkLine(emergency.location) ?? 'Not recorded'}
              />
            </dl>
          </Card>

          <KnownVsCurrentPanel
            conditions={DEMO_PATIENT_PROFILE.chronicConditions}
            emergency={emergency}
          />

          <EmergencySummaryCard summary={DEMO_EMERGENCY_SUMMARY} role="dispatcher" />
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <CardHeading icon="ambulance" eyebrow>
              Response
            </CardHeading>
            <dl className="mt-1">
              <InfoRow
                label="Assigned unit"
                value={assignedAmbulance ? assignedAmbulance.callSign : 'Not assigned'}
                hint={
                  assignedAmbulance && emergency.etaMinutes
                    ? `ETA ${emergency.etaMinutes} min (approximate)`
                    : undefined
                }
              />
              <InfoRow
                label="Receiving facility"
                value={receivingFacility ? receivingFacility.name : 'Not selected'}
                hint={receivingFacility ? 'Demo participating facility' : undefined}
              />
            </dl>
          </Card>

          <Card className="p-4">
            <CardHeading icon="history" eyebrow>
              Response tracker
            </CardHeading>
            <EmergencyTimeline state={session.state} className="mt-4" />
          </Card>

          <Card className="p-4">
            <CardHeading icon="document" eyebrow>
              Transition log
            </CardHeading>
            <ol className="mt-2.5 space-y-1.5">
              {emergency.transitions.map((transition, index) => (
                <li key={`${transition.at}-${index}`} className="flex gap-3 text-sm">
                  <span className="w-11 shrink-0 font-mono text-xs text-ink-subtle">
                    {formatClock(transition.at)}
                  </span>
                  <span className="text-ink">
                    {transition.from} &rarr; <span className="font-semibold">{transition.to}</span>
                    <span className="block text-xs text-ink-subtle">
                      {transition.actor.displayName}
                      {transition.note ? ` · ${transition.note}` : ''}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      <DemoNotice />
    </div>
  );
}
