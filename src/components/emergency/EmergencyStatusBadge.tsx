import { STATE_PRESENTATION, type StateTone } from '@/features/emergency/states';
import type { EmergencyState } from '@/types';
import { StatusPill, type PillTone } from '@/components/ui';
import type { IconName } from '@/components/ui';

const TONE_TO_PILL: Record<StateTone, PillTone> = {
  idle: 'muted',
  transmitting: 'emergency',
  pending: 'caution',
  confirmed: 'success',
  active: 'brand',
  complete: 'success',
  cancelled: 'muted',
};

const TONE_ICON: Record<StateTone, IconName> = {
  idle: 'info',
  transmitting: 'spinner',
  pending: 'timer',
  confirmed: 'check-circle',
  active: 'ambulance',
  complete: 'check-circle',
  cancelled: 'cancel',
};

export function EmergencyStatusBadge({
  state,
  audience = 'dispatcher',
  solid,
  size = 'md',
  className,
}: {
  state: EmergencyState;
  audience?: 'patient' | 'dispatcher';
  solid?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const presentation = STATE_PRESENTATION[state];
  return (
    <StatusPill
      tone={TONE_TO_PILL[presentation.tone]}
      icon={TONE_ICON[presentation.tone]}
      solid={solid}
      size={size}
      className={className}
    >
      {audience === 'patient' ? presentation.patientHeadline : presentation.dispatcherLabel}
    </StatusPill>
  );
}
