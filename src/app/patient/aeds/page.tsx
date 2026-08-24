'use client';

import { DEMO_AEDS, DEMO_PLACES } from '@/data';
import { formatDistance } from '@/lib/format';
import { haversineKm } from '@/lib/geo';
import { useEmergency } from '@/features/emergency';
import { Card, DemoNotice, Icon, StatusPill } from '@/components/ui';
import { MapContainer, type MapEntity } from '@/components/map';

/**
 * Nearby defibrillators. Distances are straight-line from the patient, which is
 * why they are labelled as such - a bystander running to fetch one needs to
 * know the number is approximate.
 */
export default function NearbyAedsPage() {
  const { session } = useEmergency();
  const origin = (session.emergency?.location ?? DEMO_PLACES.block8).coordinates;

  const aeds = DEMO_AEDS.map((aed) => ({
    ...aed,
    distanceKm: haversineKm(origin, aed.position),
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  const entities: MapEntity[] = [
    { id: 'patient', kind: 'patient', position: origin, label: 'You', emphasis: true },
    ...aeds.map<MapEntity>((aed) => ({
      id: aed.id,
      kind: 'aed',
      position: aed.position,
      label: 'AED',
      detail: aed.name,
    })),
  ];

  return (
    <div id="main" className="space-y-4 py-1">
      <h1 className="text-2xl font-bold text-ink">Nearby AEDs</h1>
      <p className="text-[15px] text-ink-muted">
        Automated external defibrillators registered with MedLink near you.
      </p>

      <MapContainer
        entities={entities}
        ariaLabel="Map showing defibrillators near your location"
        className="h-52"
        unavailable={session.connection.status === 'offline'}
        unavailableReason="You are offline, so the map cannot load."
      />

      <ul className="space-y-3">
        {aeds.map((aed) => (
          <Card as="li" key={aed.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[15px] font-semibold text-ink">{aed.name}</p>
              <span className="shrink-0 text-sm font-bold text-brand">
                {formatDistance(aed.distanceKm)}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{aed.accessNote}</p>
            <StatusPill tone={aed.lastVerifiedAt ? 'success' : 'caution'} size="sm" className="mt-2">
              {aed.lastVerifiedAt
                ? `Verified ${new Date(aed.lastVerifiedAt).toLocaleDateString('en-GB')}`
                : 'Not recently verified'}
            </StatusPill>
          </Card>
        ))}
      </ul>

      <p className="flex items-start gap-2 rounded-card bg-surface-low px-4 py-3 text-xs leading-relaxed text-ink-muted">
        <Icon name="info" size={15} className="mt-0.5" />
        Distances are straight-line estimates, not walking routes.
      </p>

      <DemoNotice className="pt-2" />
    </div>
  );
}
