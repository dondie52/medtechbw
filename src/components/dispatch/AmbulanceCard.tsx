import { cn } from '@/lib/cn';
import { formatDistance, formatMinutes } from '@/lib/format';
import {
  AMBULANCE_AVAILABILITY_LABEL,
  CREW_QUALIFICATION_LABEL,
  type Ambulance,
} from '@/types';
import { Button, Card, Icon, StatusPill, type PillTone } from '@/components/ui';

const AVAILABILITY_TONE: Record<Ambulance['availability'], PillTone> = {
  available: 'success',
  assigned: 'brand',
  busy: 'caution',
  off_duty: 'muted',
};

/** Summarises a crew as "2 paramedics" / "1 EMT, 1 driver". */
function describeCrew(crew: Ambulance['crew']): string {
  if (crew.length === 0) return 'No crew assigned';
  const counts = new Map<string, number>();
  for (const member of crew) {
    const label = CREW_QUALIFICATION_LABEL[member.qualification];
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => `${count} ${count > 1 ? `${label}s` : label}`)
    .join(', ');
}

export function AmbulanceCard({
  ambulance,
  onAssign,
  assigned,
  className,
}: {
  ambulance: Ambulance;
  onAssign?: (id: string) => void;
  assigned?: boolean;
  className?: string;
}) {
  const assignable = ambulance.availability === 'available' && !assigned;

  return (
    <Card
      as="li"
      className={cn('p-4', assigned && 'border-brand ring-2 ring-brand/25', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-lg font-bold text-ink">
            <Icon name="ambulance" size={20} className="text-brand" />
            {ambulance.callSign}
          </p>
          <p className="mt-0.5 text-sm text-ink-muted">{ambulance.baseStation}</p>
        </div>
        <StatusPill tone={assigned ? 'brand' : AVAILABILITY_TONE[ambulance.availability]} size="sm">
          {assigned ? 'Assigned' : AMBULANCE_AVAILABILITY_LABEL[ambulance.availability]}
        </StatusPill>
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <div className="flex items-baseline gap-1.5">
          <dt className="text-ink-subtle">Distance</dt>
          <dd className="font-semibold text-ink">{formatDistance(ambulance.distanceKm)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-ink-subtle">ETA</dt>
          <dd className="font-semibold text-ink">{formatMinutes(ambulance.etaMinutes)}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="text-ink-subtle">Crew</dt>
          <dd className="font-semibold text-ink">{describeCrew(ambulance.crew)}</dd>
        </div>
      </dl>

      {onAssign ? (
        <div className="mt-3">
          {assignable ? (
            <Button variant="primary" size="md" fullWidth onClick={() => onAssign(ambulance.id)}>
              Assign {ambulance.callSign}
            </Button>
          ) : (
            <p className="rounded-control bg-surface-low px-3 py-2.5 text-center text-sm font-medium text-ink-subtle">
              {assigned
                ? `${ambulance.callSign} is assigned to this emergency`
                : `Unavailable - ${AMBULANCE_AVAILABILITY_LABEL[ambulance.availability].toLowerCase()}`}
            </p>
          )}
        </div>
      ) : null}

      <p className="mt-2 text-xs text-ink-subtle">
        Travel estimate is approximate (straight-line model).
      </p>
    </Card>
  );
}
