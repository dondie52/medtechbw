import { cn } from '@/lib/cn';
import { formatDistance, formatPhone } from '@/lib/format';
import {
  FACILITY_AVAILABILITY_LABEL,
  FACILITY_CONNECTION_LABEL,
  FACILITY_KIND_LABEL,
  FACILITY_PARTICIPATION_LABEL,
  type FacilityAvailability,
  type ReceivingFacility,
} from '@/types';
import { Button, Card, Icon, StatusPill, type PillTone } from '@/components/ui';

const AVAILABILITY_TONE: Record<FacilityAvailability, PillTone> = {
  available: 'success',
  receiving_emergency: 'brand',
  limited: 'caution',
  unavailable: 'muted',
};

export function ReceivingFacilityCard({
  facility,
  onSelect,
  selected,
  className,
}: {
  facility: ReceivingFacility;
  onSelect?: (id: string) => void;
  selected?: boolean;
  className?: string;
}) {
  const selectable = facility.participationStatus !== 'not_participating' && !selected;

  return (
    <Card as="li" className={cn('p-4', selected && 'border-brand ring-2 ring-brand/25', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-start gap-2 text-[17px] font-bold text-ink">
            <Icon name="hospital" size={20} className="mt-0.5 text-brand" />
            {facility.name}
          </p>
          <p className="mt-0.5 text-sm text-ink-muted">
            {FACILITY_KIND_LABEL[facility.kind]} &middot; {facility.location.townOrVillage} &middot;{' '}
            {formatDistance(facility.distanceKm)}
          </p>
        </div>
        <StatusPill tone={AVAILABILITY_TONE[facility.availability]} size="sm">
          {FACILITY_AVAILABILITY_LABEL[facility.availability]}
        </StatusPill>
      </div>

      {/*
        Three separate statuses, never collapsed into one "partner" badge:
        whether MedLink has a technical link, whether the facility takes part,
        and whether it can accept a patient right now.
      */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <StatusPill tone="muted" size="sm" icon="lock">
          {FACILITY_CONNECTION_LABEL[facility.connectionStatus]}
        </StatusPill>
        <StatusPill tone="neutral" size="sm">
          {FACILITY_PARTICIPATION_LABEL[facility.participationStatus]}
        </StatusPill>
      </div>

      {facility.capabilities.length > 0 ? (
        <p className="mt-2.5 text-sm text-ink-muted">{facility.capabilities.join(' · ')}</p>
      ) : null}

      <p className="mt-1 text-sm text-ink-muted">{formatPhone(facility.phone)}</p>

      {onSelect ? (
        <div className="mt-3">
          {selectable ? (
            <Button variant="secondary" size="md" fullWidth onClick={() => onSelect(facility.id)}>
              Select as receiving facility
            </Button>
          ) : (
            <p className="rounded-control bg-surface-low px-3 py-2.5 text-center text-sm font-medium text-ink-subtle">
              {selected ? 'Selected as receiving facility' : 'Not participating in MedLink'}
            </p>
          )}
        </div>
      ) : null}
    </Card>
  );
}
