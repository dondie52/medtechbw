'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DEMO_DISPATCHER, DEMO_PATIENT_PROFILE } from '@/data';
import { formatClock, formatElapsed, formatPhone, telHref } from '@/lib/format';
import { useEmergency, useNowMs } from '@/features/emergency';
import { STATE_PRESENTATION } from '@/features/emergency/states';
import { GENDER_LABEL, formatLandmarkLine, formatLocationLine } from '@/types';
import { Avatar, Button, Card, CardHeading, Icon, StatusPill } from '@/components/ui';
import { EmergencyStatusBadge, KnownVsCurrentPanel } from '@/components/emergency';
import { AmbulanceAssignmentDrawer } from './AmbulanceAssignmentDrawer';
import { FacilitySelectDrawer } from './FacilitySelectDrawer';
import { StatusAdvanceControl } from './StatusAdvanceControl';

/**
 * The dispatcher's working panel for one emergency.
 *
 * Everything here is ordered by the questions a dispatcher answers in sequence:
 * who, where, what is known, what is actually happening, then what to do.
 */
export function DispatcherEmergencyPanel() {
  const { session, actions, ambulanceCandidates, assignedAmbulance, receivingFacility } =
    useEmergency();
  const [assignOpen, setAssignOpen] = useState(false);
  const [facilityOpen, setFacilityOpen] = useState(false);
  const nowMs = useNowMs(1000);

  const emergency = session.emergency;
  const profile = DEMO_PATIENT_PROFILE;

  if (!emergency) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <Icon name="campaign" size={36} className="text-ink-subtle" />
        <p className="text-lg font-semibold text-ink">No live emergency</p>
        <p className="max-w-xs text-sm text-ink-muted">
          Open the patient app and hold SOS. The emergency will appear here.
        </p>
        <Link
          href="/patient"
          className="mt-1 text-sm font-semibold text-brand underline underline-offset-2"
        >
          Open the patient app
        </Link>
      </div>
    );
  }

  const accepted = emergency.acceptedBy !== null;
  const cannotSpeak = emergency.communicationFlags.find(
    (flag) => flag.code === 'patient_may_be_unable_to_speak',
  );

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-line px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <EmergencyStatusBadge state={session.state} solid={!accepted} size="sm" />
          <span className="font-mono text-sm font-semibold text-ink-muted" aria-label="Time since alert">
            {formatElapsed(emergency.createdAt, nowMs)}
          </span>
        </div>
        <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight text-ink">{emergency.id}</h2>
        <p className="mt-0.5 text-sm text-ink-muted">
          Alert received {formatClock(emergency.createdAt)}
        </p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <Card className="flex items-center gap-3 p-4">
          <Avatar initials={profile.patient.photoInitials} name={profile.patient.fullName} size={52} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-subtle">
              Patient subject
            </p>
            <p className="truncate text-lg font-bold text-ink">{profile.patient.fullName}</p>
            <p className="text-sm text-ink-muted">
              {profile.patient.age} yrs &middot; {GENDER_LABEL[profile.patient.gender]}
            </p>
          </div>
          <a
            href={telHref(profile.patient.phone)}
            aria-label={`Call ${profile.patient.fullName} on ${formatPhone(profile.patient.phone)}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white"
          >
            <Icon name="call" size={20} />
          </a>
        </Card>

        <Card className="p-4">
          <CardHeading icon="pin" eyebrow>
            Reported location
          </CardHeading>
          <p className="mt-1.5 text-lg font-bold text-ink">{formatLocationLine(emergency.location)}</p>
          {formatLandmarkLine(emergency.location) ? (
            <p className="text-sm text-ink-muted">({formatLandmarkLine(emergency.location)})</p>
          ) : null}
          <p className="mt-1.5 text-sm text-ink-muted">
            {[emergency.location.plot, emergency.location.road].filter(Boolean).join(', ')}
            {emergency.location.accuracyMetres
              ? ` · ±${emergency.location.accuracyMetres} m`
              : ''}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Phone: <span className="font-medium text-ink">{formatPhone(profile.patient.phone)}</span>
          </p>
        </Card>

        {/* The safety split: known profile beside current SOS. */}
        <KnownVsCurrentPanel
          conditions={profile.chronicConditions}
          emergency={emergency}
          className="sm:grid-cols-1"
        />

        {cannotSpeak ? (
          <Card tone="caution" accent className="p-4">
            <CardHeading tone="caution" icon="voice-off" eyebrow>
              Communication
            </CardHeading>
            <p className="mt-1.5 text-[15px] font-semibold text-caution-on-container">
              Patient signalled they may be unable to speak.
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Raised {formatClock(cannotSpeak.raisedAt)} from the patient&apos;s device.
            </p>
            {cannotSpeak.acknowledgedAt ? (
              <StatusPill tone="success" size="sm" icon="check" className="mt-2">
                Acknowledged {formatClock(cannotSpeak.acknowledgedAt)}
              </StatusPill>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                className="mt-2.5"
                onClick={() => actions.acknowledgeCommunicationFlag('patient_may_be_unable_to_speak')}
              >
                Acknowledge to patient
              </Button>
            )}
          </Card>
        ) : null}

        {assignedAmbulance ? (
          <Card className="p-4">
            <CardHeading icon="ambulance" eyebrow>
              Assigned response
            </CardHeading>
            <p className="mt-1.5 flex items-baseline gap-2 text-lg font-bold text-ink">
              {assignedAmbulance.callSign}
              <span className="text-sm font-medium text-ink-muted">
                ETA {emergency.etaMinutes} min
              </span>
            </p>
            <p className="text-sm text-ink-muted">
              {assignedAmbulance.crew.map((member) => member.fullName).join(', ') || 'No crew listed'}
            </p>
          </Card>
        ) : null}

        {receivingFacility ? (
          <Card className="p-4">
            <CardHeading icon="hospital" eyebrow>
              Receiving facility
            </CardHeading>
            <p className="mt-1.5 text-[17px] font-bold text-ink">{receivingFacility.name}</p>
            <StatusPill tone="muted" size="sm" className="mt-1.5">
              Demo participating facility
            </StatusPill>
          </Card>
        ) : null}

        {session.state !== 'idle' ? (
          <StatusAdvanceControl
            state={session.state}
            disabled={!accepted}
            onAdvance={actions.advanceTo}
          />
        ) : null}
      </div>

      <footer className="space-y-2 border-t border-line px-5 py-4">
        {!accepted ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            icon="check-circle"
            onClick={() => {
              actions.acceptEmergency();
              actions.logDataAccess(
                ['emergency_location', 'emergency_medical_summary'],
                `Accepted emergency ${emergency.id}`,
                DEMO_DISPATCHER,
              );
            }}
          >
            Accept emergency
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                actions.startAssignment();
                setAssignOpen(true);
              }}
            >
              Assign response
            </Button>
            <Button variant="secondary" size="md" onClick={() => setFacilityOpen(true)}>
              Notify facility
            </Button>
          </div>
        )}

        <Link
          href={`/dispatch/emergencies/${encodeURIComponent(emergency.id)}`}
          className="flex min-h-touch items-center justify-center gap-2 rounded-control text-sm font-bold uppercase tracking-wide text-brand hover:bg-brand-50"
        >
          <Icon name="medical-profile" size={18} />
          View emergency medical summary
        </Link>

        <p className="text-center text-xs text-ink-subtle">
          {STATE_PRESENTATION[session.state].dispatcherLabel} &middot; patient sees &ldquo;
          {STATE_PRESENTATION[session.state].patientHeadline}&rdquo;
        </p>
      </footer>

      <AmbulanceAssignmentDrawer
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        candidates={ambulanceCandidates}
        assignedId={emergency.assignedAmbulanceId}
        onAssign={actions.assignAmbulance}
      />
      <FacilitySelectDrawer
        open={facilityOpen}
        onClose={() => setFacilityOpen(false)}
        selectedId={emergency.receivingFacilityId}
        onSelect={actions.selectFacility}
      />
    </div>
  );
}
