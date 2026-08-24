'use client';

import { useMemo, useState } from 'react';
import { DEMO_AEDS, DEMO_FACILITIES, DEMO_RESPONDERS, GABORONE_CENTRE } from '@/data';
import { useEmergency } from '@/features/emergency';
import { isEmergencyActive } from '@/types';
import { Icon, DemoNotice } from '@/components/ui';
import { MapContainer, MapLegend, type MapEntity } from '@/components/map';
import { DispatcherEmergencyPanel } from '@/components/dispatch/DispatcherEmergencyPanel';

/**
 * Live emergencies console: navigation left, operational map centre, selected
 * emergency and its controls right.
 */
export default function DispatchDashboardPage() {
  const { session, ambulanceCandidates, assignedAmbulance } = useEmergency();
  const [query, setQuery] = useState('');

  const emergency = session.emergency;
  const live = isEmergencyActive(session.state) && emergency !== null;

  const entities = useMemo<MapEntity[]>(() => {
    const list: MapEntity[] = [];

    if (emergency) {
      list.push({
        id: emergency.id,
        kind: 'patient',
        position: emergency.location.coordinates,
        label: emergency.id,
        detail: `${emergency.location.ward}, ${emergency.location.townOrVillage}`,
        emphasis: true,
      });
    }

    for (const ambulance of ambulanceCandidates) {
      if (ambulance.availability === 'off_duty') continue;
      list.push({
        id: ambulance.id,
        kind: 'ambulance',
        position: ambulance.position,
        label: ambulance.callSign,
        detail: `${ambulance.availability} · ${ambulance.etaMinutes} min`,
      });
    }

    for (const facility of DEMO_FACILITIES) {
      if (facility.participationStatus === 'not_participating') continue;
      list.push({
        id: facility.id,
        kind: 'facility',
        position: facility.location.coordinates,
        label: facility.name,
        detail: facility.availability,
      });
    }

    for (const responder of DEMO_RESPONDERS) {
      list.push({
        id: responder.id,
        kind: 'responder',
        position: responder.position,
        label: responder.fullName,
        detail: responder.organisation,
      });
    }

    for (const aed of DEMO_AEDS) {
      list.push({ id: aed.id, kind: 'aed', position: aed.position, label: 'AED', detail: aed.name });
    }

    if (list.length === 0) {
      list.push({
        id: 'centre',
        kind: 'facility',
        position: GABORONE_CENTRE,
        label: 'Gaborone',
        detail: 'Operating area',
      });
    }

    return list;
  }, [emergency, ambulanceCandidates]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return entities;
    return entities.filter(
      (entity) =>
        entity.label.toLowerCase().includes(term) ||
        (entity.detail?.toLowerCase().includes(term) ?? false),
    );
  }, [entities, query]);

  return (
    <div className="flex h-full min-h-dvh flex-col xl:flex-row">
      <section aria-label="Operational map" className="relative min-h-[420px] flex-1 p-4 lg:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-ink">Live emergencies</h1>
            <p className="text-sm text-ink-muted">
              Gaborone operating area &middot; {live ? '1 active emergency' : 'No active emergency'}
            </p>
          </div>

          <label className="relative flex w-full max-w-sm items-center">
            <span className="sr-only">Search location or emergency ID</span>
            <Icon name="search" size={18} className="absolute left-3 text-ink-subtle" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search location or ID..."
              className="min-h-touch w-full rounded-control border border-line bg-surface pl-10 pr-3 text-[15px] text-ink placeholder:text-ink-subtle"
            />
          </label>
        </div>

        <MapContainer
          entities={filtered}
          route={
            emergency && assignedAmbulance
              ? { from: assignedAmbulance.position, to: emergency.location.coordinates }
              : null
          }
          ariaLabel="Gaborone operational map showing emergencies, ambulances, facilities, responders and defibrillators"
          className="h-[calc(100%-120px)] min-h-[340px]"
          unavailable={session.connection.status === 'offline'}
          unavailableReason="The dispatcher console is offline."
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <MapLegend entities={filtered} />
          <DemoNotice short />
        </div>
      </section>

      <aside
        aria-label="Selected emergency"
        className="w-full shrink-0 border-t border-line bg-surface xl:h-dvh xl:w-[400px] xl:border-l xl:border-t-0"
      >
        <DispatcherEmergencyPanel />
      </aside>
    </div>
  );
}
