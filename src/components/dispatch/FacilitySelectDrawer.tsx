'use client';

import { DEMO_FACILITIES } from '@/data';
import { Drawer, Icon } from '@/components/ui';
import { ReceivingFacilityCard } from './ReceivingFacilityCard';

export function FacilitySelectDrawer({
  open,
  onClose,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedId: string | null;
  onSelect: (facilityId: string) => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Select receiving facility"
      description="Facilities are ordered as configured for this operating area."
    >
      <p className="mb-4 flex items-start gap-2 rounded-control bg-caution-container/60 px-3 py-2.5 text-sm leading-snug text-caution-on-container">
        <Icon name="warning" size={16} className="mt-0.5" />
        No facility in this prototype is technically integrated with MedLink. Selecting one records
        the intended destination; it does not notify a hospital.
      </p>

      <ul className="space-y-3">
        {DEMO_FACILITIES.map((facility) => (
          <ReceivingFacilityCard
            key={facility.id}
            facility={facility}
            selected={facility.id === selectedId}
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }}
          />
        ))}
      </ul>
    </Drawer>
  );
}
