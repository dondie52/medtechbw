'use client';

import { DEMO_PLACES } from '@/data';
import { useEmergency } from '@/features/emergency';
import { Card, CardHeading, DemoNotice, InfoRow } from '@/components/ui';
import { MapContainer, type MapEntity } from '@/components/map';
import { PatientLocationCard } from '@/components/patient/PatientLocationCard';

/**
 * What responders would be given if the patient pressed SOS right now.
 * Showing this outside an emergency is a trust feature, not a map feature.
 */
export default function MyLocationPage() {
  const { session } = useEmergency();
  const location = session.emergency?.location ?? DEMO_PLACES.block8;

  const entities: MapEntity[] = [
    {
      id: 'patient',
      kind: 'patient',
      position: location.coordinates,
      label: 'You',
      detail: `${location.ward}, ${location.townOrVillage}`,
      emphasis: true,
    },
  ];

  return (
    <div id="main" className="space-y-4 py-1">
      <h1 className="text-2xl font-bold text-ink">My location</h1>
      <p className="text-[15px] text-ink-muted">
        This is what an authorised responder would receive if you sent an emergency alert now.
      </p>

      <MapContainer
        entities={entities}
        ariaLabel="Map showing your current location"
        className="h-56"
        unavailable={session.connection.status === 'offline'}
        unavailableReason="You are offline, so the map cannot load."
      />

      <PatientLocationCard location={location} />

      <Card className="p-4">
        <CardHeading icon="pin">Location details</CardHeading>
        <dl className="mt-1 grid gap-x-6 sm:grid-cols-2">
          <InfoRow label="Ward" value={location.ward ?? 'Not recorded'} />
          <InfoRow label="Town or village" value={location.townOrVillage} />
          <InfoRow label="District" value={location.district} />
          <InfoRow label="Landmark" value={location.landmark ?? 'Not recorded'} />
          <InfoRow label="Plot" value={location.plot ?? 'Not recorded'} />
          <InfoRow label="Road" value={location.road ?? 'Not recorded'} />
          <InfoRow
            label="Coordinates"
            value={`${location.coordinates.lat.toFixed(5)}, ${location.coordinates.lng.toFixed(5)}`}
            hint={location.accuracyMetres ? `Accurate to about ${location.accuracyMetres} m` : undefined}
            className="sm:col-span-2"
          />
        </dl>
      </Card>

      <DemoNotice className="pt-2" />
    </div>
  );
}
