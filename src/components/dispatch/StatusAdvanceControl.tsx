'use client';

import { STATE_PRESENTATION, nextStateAfter } from '@/features/emergency/states';
import type { EmergencyState } from '@/types';
import { Button, Card, CardHeading, Icon } from '@/components/ui';

/**
 * Advances the emergency one legal step at a time.
 *
 * Only the machine's next state is offered - a dispatcher cannot skip an
 * emergency from "response assigned" to "facility reached", because the patient
 * would be shown a stage that never happened.
 */
export function StatusAdvanceControl({
  state,
  onAdvance,
  disabled,
}: {
  state: EmergencyState;
  onAdvance: (next: EmergencyState) => void;
  disabled?: boolean;
}) {
  const next = nextStateAfter(state);

  return (
    <Card className="p-4">
      <CardHeading icon="ambulance" eyebrow>
        Update status
      </CardHeading>

      <p className="mt-2 text-sm text-ink-muted">
        Current: <span className="font-semibold text-ink">{STATE_PRESENTATION[state].dispatcherLabel}</span>
      </p>

      {next ? (
        <Button
          variant="primary"
          size="md"
          fullWidth
          iconAfter="arrow-forward"
          className="mt-3"
          disabled={disabled}
          onClick={() => onAdvance(next)}
        >
          Mark as {STATE_PRESENTATION[next].dispatcherLabel}
        </Button>
      ) : (
        <p className="mt-3 flex items-center gap-2 rounded-control bg-surface-low px-3 py-2.5 text-sm text-ink-muted">
          <Icon name="check-circle" size={16} />
          This emergency is closed.
        </p>
      )}
    </Card>
  );
}
