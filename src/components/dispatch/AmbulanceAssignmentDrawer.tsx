'use client';

import { Drawer } from '@/components/ui';
import type { Ambulance } from '@/types';
import { AmbulanceCard } from './AmbulanceCard';

/**
 * Response selection.
 *
 * The first control-centre design reduced this to a single hard-coded
 * "Assign MED-04" button. A dispatcher needs to choose, so this lists every
 * candidate - including the ones they cannot pick and why - ordered by
 * availability, then travel time, then distance.
 */
export function AmbulanceAssignmentDrawer({
  open,
  onClose,
  candidates,
  assignedId,
  onAssign,
}: {
  open: boolean;
  onClose: () => void;
  candidates: Ambulance[];
  assignedId: string | null;
  onAssign: (ambulanceId: string) => void;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Assign a response unit"
      description="Ordered by availability, then estimated travel time, then distance."
    >
      <ul className="space-y-3">
        {candidates.map((ambulance) => (
          <AmbulanceCard
            key={ambulance.id}
            ambulance={ambulance}
            assigned={ambulance.id === assignedId}
            onAssign={(id) => {
              onAssign(id);
              onClose();
            }}
          />
        ))}
      </ul>
    </Drawer>
  );
}
