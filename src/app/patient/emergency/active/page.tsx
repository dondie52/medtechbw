'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { findFacility } from '@/data';
import { formatElapsed, formatMinutes } from '@/lib/format';
import { interpolate } from '@/lib/geo';
import { useEmergency, useNowMs } from '@/features/emergency';
import { STATE_PRESENTATION } from '@/features/emergency/states';
import { hasEmergencyRecord } from '@/types';
import { Button, Card, CardHeading, Icon, StatusPill } from '@/components/ui';
import { ConnectivityBanner, EmergencyTimeline } from '@/components/emergency';
import { MapContainer, type MapEntity } from '@/components/map';
import { EmergencyActions } from '@/components/patient/EmergencyActions';
import { PatientLocationCard } from '@/components/patient/PatientLocationCard';

const HELP_ON_WAY_STATES = new Set(['response_assigned', 'ambulance_en_route', 'help_arriving']);

export default function ActiveEmergencyPage() {
  const router = useRouter();
  const { session, assignedAmbulance } = useEmergency();
  const { state, emergency, connection } = session;
  const nowMs = useNowMs(1000);

  useEffect(() => {
    if (!hasEmergencyRecord(state)) router.replace('/patient');
  }, [state, router]);

  const facility = findFacility(emergency?.receivingFacilityId ?? null);

  /*
   * The unit's position is derived from elapsed time against its ETA rather
   * than stored, so both open tabs agree without any position events.
   */
  const ambulancePosition = useMemo(() => {
    if (!assignedAmbulance || !emergency?.assignedAt || !emergency.etaMinutes) {
      return assignedAmbulance?.position ?? null;
    }
    const moving = state === 'ambulance_en_route' || state === 'help_arriving';
    if (!moving) return assignedAmbulance.position;
    const elapsedMs = nowMs - new Date(emergency.assignedAt).getTime();
    const progress = elapsedMs / (emergency.etaMinutes * 60_000);
    return interpolate(assignedAmbulance.position, emergency.location.coordinates, progress * 0.9);
  }, [assignedAmbulance, emergency, state, nowMs]);

  const entities = useMemo<MapEntity[]>(() => {
    if (!emergency) return [];
    const list: MapEntity[] = [
      {
        id: 'patient',
        kind: 'patient',
        position: emergency.location.coordinates,
        label: 'You',
        detail: `${emergency.location.ward}, ${emergency.location.townOrVillage}`,
        emphasis: true,
      },
    ];
    if (assignedAmbulance && ambulancePosition) {
      list.push({
        id: assignedAmbulance.id,
        kind: 'ambulance',
        position: ambulancePosition,
        label: assignedAmbulance.callSign,
        detail: `ETA ${formatMinutes(emergency.etaMinutes)}`,
      });
    }
    if (facility) {
      list.push({
        id: facility.id,
        kind: 'facility',
        position: facility.location.coordinates,
        label: facility.name,
        detail: 'Receiving facility',
      });
    }
    return list;
  }, [emergency, assignedAmbulance, ambulancePosition, facility]);

  if (!emergency) return null;

  const presentation = STATE_PRESENTATION[state];
  const showHelpBanner = HELP_ON_WAY_STATES.has(state);
  const closed = state === 'completed' || state === 'cancelled';

  if (closed) {
    return (
      <div id="main" className="space-y-5 py-4">
        <Card tone={state === 'completed' ? 'success' : 'default'} className="p-5 text-center">
          <Icon
            name={state === 'completed' ? 'check-circle' : 'cancel'}
            size={44}
            className={state === 'completed' ? 'mx-auto text-success' : 'mx-auto text-ink-subtle'}
          />
          <h1 className="mt-3 text-2xl font-bold text-ink">{presentation.patientHeadline}</h1>
          <p className="mt-1.5 text-[15px] text-ink-muted">{presentation.patientDetail}</p>
          <p className="mt-4 font-mono text-sm font-semibold text-ink-muted">{emergency.id}</p>
        </Card>

        <Card className="p-4">
          <CardHeading icon="history" eyebrow>
            What happened
          </CardHeading>
          <EmergencyTimeline state={state} className="mt-3" />
        </Card>

        <Button variant="primary" size="lg" fullWidth onClick={() => router.push('/patient')}>
          Back to home
        </Button>
      </div>
    );
  }

  return (
    <div id="main" className="space-y-4 py-1">
      <header className="text-center">
        <h1 className="text-[26px] font-bold uppercase leading-tight tracking-tight text-brand">
          {showHelpBanner ? 'Help is on the way' : presentation.patientHeadline}
        </h1>
        <p role="status" aria-live="polite" className="mt-1.5 text-[15px] text-ink-muted">
          {presentation.patientDetail}
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs text-ink-subtle">
          <span className="font-mono font-semibold">{emergency.id}</span>
          <span aria-hidden>&middot;</span>
          <span>Active for {formatElapsed(emergency.createdAt, nowMs)}</span>
        </p>
      </header>

      <ConnectivityBanner />

      {/* The map is a convenience. Everything below it works without it. */}
      <MapContainer
        entities={entities}
        route={
          assignedAmbulance && ambulancePosition
            ? { from: ambulancePosition, to: emergency.location.coordinates }
            : null
        }
        ariaLabel="Map showing your location, the assigned ambulance and the receiving facility"
        className="h-56"
        unavailable={connection.status === 'offline'}
        unavailableReason="You are offline, so the map cannot load."
      >
        {emergency.etaMinutes ? (
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5 text-sm font-bold text-brand shadow-card">
            <Icon name="timer" size={16} />
            ETA {formatMinutes(emergency.etaMinutes)}
          </div>
        ) : null}
      </MapContainer>

      {assignedAmbulance ? (
        <Card className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-subtle">
                Ambulance
              </p>
              <p className="truncate text-2xl font-bold text-brand">{assignedAmbulance.callSign}</p>
            </div>
            {emergency.etaMinutes ? (
              <span className="flex shrink-0 flex-col items-center rounded-control bg-brand px-4 py-2 text-white">
                <span className="text-2xl font-bold leading-none">{emergency.etaMinutes}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">min</span>
              </span>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-ink-muted">
            {assignedAmbulance.crew.length > 0
              ? `Crew of ${assignedAmbulance.crew.length} on board`
              : 'Crew details not available'}
          </p>

          {facility ? (
            <p className="mt-3 flex items-start gap-2 border-t border-line pt-3 text-[15px] text-ink">
              <Icon name="hospital" size={18} className="mt-0.5 text-brand" />
              <span>
                Receiving facility: <span className="font-semibold">{facility.name}</span>
                <StatusPill tone="muted" size="sm" className="ml-2 align-middle">
                  Demo participating facility
                </StatusPill>
              </span>
            </p>
          ) : null}
        </Card>
      ) : (
        <Card tone="caution" className="p-4">
          <CardHeading tone="caution" icon="timer" eyebrow>
            No unit assigned yet
          </CardHeading>
          <p className="mt-1.5 text-[15px] text-caution-on-container">
            Dispatch has your emergency and is choosing a response unit.
          </p>
        </Card>
      )}

      <Card className="p-4">
        <CardHeading icon="ambulance" eyebrow>
          Emergency status
        </CardHeading>
        <EmergencyTimeline state={state} className="mt-4" />
      </Card>

      <PatientLocationCard location={emergency.location} compact />

      {/* Reassurance wording carried over from the first tracker design, which
          V2 dropped - it answers the question patients actually ask. */}
      <p className="rounded-card bg-brand-50 px-4 py-3 text-center text-sm leading-relaxed text-brand-on-container">
        Your location and emergency medical profile have been shared with the authorised response
        team. Please remain where you are if it is safe to do so.
      </p>

      <EmergencyActions />

      <p className="pt-2 text-center text-xs text-ink-subtle">
        <Link href="/patient/medical-profile" className="font-semibold text-brand underline underline-offset-2">
          Check what responders can see
        </Link>
      </p>
    </div>
  );
}
