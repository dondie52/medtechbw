'use client';

import { useEmergency } from '@/features/emergency';
import { DemoNotice } from '@/components/ui';
import { AmbulanceCard } from '@/components/dispatch/AmbulanceCard';

export default function AmbulancesPage() {
  const { ambulanceCandidates, session } = useEmergency();

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Ambulances</h1>
        <p className="text-sm text-ink-muted">
          {session.emergency
            ? `Distances and ETAs are estimated against ${session.emergency.id}.`
            : 'Distances and ETAs are estimated against the Gaborone operating area.'}
        </p>
      </div>

      <ul className="space-y-3">
        {ambulanceCandidates.map((ambulance) => (
          <AmbulanceCard
            key={ambulance.id}
            ambulance={ambulance}
            assigned={ambulance.id === session.emergency?.assignedAmbulanceId}
          />
        ))}
      </ul>

      <DemoNotice />
    </div>
  );
}
