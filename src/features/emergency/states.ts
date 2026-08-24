import type { EmergencyState } from '@/types';

/** Canonical order. Used for progress maths and for the demo "advance" control. */
export const EMERGENCY_STATE_ORDER: readonly EmergencyState[] = [
  'idle',
  'holding_sos',
  'sending',
  'alert_received',
  'awaiting_dispatch',
  'dispatch_confirmed',
  'assigning_response',
  'response_assigned',
  'ambulance_en_route',
  'help_arriving',
  'at_patient',
  'transporting',
  'facility_reached',
  'completed',
  'cancelled',
] as const;

/**
 * Legal transitions. The reducer refuses anything not listed here, so a bad
 * event can never teleport an emergency into a state that would show the
 * patient something untrue (for example jumping straight from `sending` to
 * `dispatch_confirmed` without a dispatcher actually accepting).
 */
export const ALLOWED_TRANSITIONS: Readonly<Record<EmergencyState, readonly EmergencyState[]>> = {
  idle: ['holding_sos'],
  /* Releasing the SOS button before the hold completes returns to idle. */
  holding_sos: ['idle', 'sending'],
  sending: ['alert_received', 'cancelled'],
  alert_received: ['awaiting_dispatch', 'cancelled'],
  awaiting_dispatch: ['dispatch_confirmed', 'cancelled'],
  dispatch_confirmed: ['assigning_response', 'cancelled'],
  assigning_response: ['response_assigned', 'cancelled'],
  response_assigned: ['ambulance_en_route', 'cancelled'],
  ambulance_en_route: ['help_arriving', 'cancelled'],
  help_arriving: ['at_patient', 'cancelled'],
  /* Once a crew is with the patient, "cancel" is a clinical decision made on
   * scene, not something the app should offer. */
  at_patient: ['transporting', 'completed'],
  transporting: ['facility_reached'],
  facility_reached: ['completed'],
  completed: [],
  cancelled: [],
};

export function canTransition(from: EmergencyState, to: EmergencyState): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/** The next state in the happy path, or null at a terminal/branching state. */
export function nextStateAfter(state: EmergencyState): EmergencyState | null {
  const candidates = ALLOWED_TRANSITIONS[state].filter((next) => next !== 'cancelled');
  return candidates[0] ?? null;
}

/** Whether the patient may still cancel from here. */
export function canPatientCancel(state: EmergencyState): boolean {
  return ALLOWED_TRANSITIONS[state].includes('cancelled');
}

export type StateTone =
  | 'idle'
  | 'transmitting'
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'complete'
  | 'cancelled';

export interface StatePresentation {
  /** Large patient-facing headline. Plain language, no jargon. */
  patientHeadline: string;
  /** One supporting sentence. Must not over-claim what has happened. */
  patientDetail: string;
  /** Short label for dispatcher lists, pills and the case header. */
  dispatcherLabel: string;
  tone: StateTone;
}

/**
 * The one place patient-facing status copy lives.
 *
 * The distinction the brief insists on is enforced here: the patient is told
 * their alert is *sending*, then that MedLink *received* it, then that they are
 * *waiting for* dispatch - and only at `dispatch_confirmed` that a dispatcher
 * actually has the emergency. No string before that point claims dispatch has
 * been notified.
 */
export const STATE_PRESENTATION: Readonly<Record<EmergencyState, StatePresentation>> = {
  idle: {
    patientHeadline: 'No active emergency',
    patientDetail: 'Press and hold SOS to get emergency help.',
    dispatcherLabel: 'No active emergency',
    tone: 'idle',
  },
  holding_sos: {
    patientHeadline: 'Keep holding',
    patientDetail: 'Keep holding to send your emergency alert.',
    dispatcherLabel: 'No active emergency',
    tone: 'idle',
  },
  sending: {
    patientHeadline: 'Sending Emergency Alert',
    patientDetail: 'Your alert is being sent to MedLink. Stay on this screen.',
    dispatcherLabel: 'Incoming',
    tone: 'transmitting',
  },
  alert_received: {
    patientHeadline: 'Emergency Alert Sent',
    patientDetail: 'MedLink has received your alert.',
    dispatcherLabel: 'New medical emergency',
    tone: 'confirmed',
  },
  awaiting_dispatch: {
    patientHeadline: 'Awaiting Dispatch Confirmation',
    patientDetail: 'A dispatcher has not confirmed your emergency yet. Stay where you are if it is safe.',
    dispatcherLabel: 'Awaiting dispatch confirmation',
    tone: 'pending',
  },
  dispatch_confirmed: {
    patientHeadline: 'Dispatch Confirmed',
    patientDetail: 'A MedLink dispatcher has your emergency and is arranging help.',
    dispatcherLabel: 'Accepted',
    tone: 'confirmed',
  },
  assigning_response: {
    patientHeadline: 'Finding a Response Unit',
    patientDetail: 'Dispatch is selecting the nearest available unit for you.',
    dispatcherLabel: 'Assigning response',
    tone: 'pending',
  },
  response_assigned: {
    patientHeadline: 'Response Assigned',
    patientDetail: 'An ambulance has been assigned to your emergency.',
    dispatcherLabel: 'Response assigned',
    tone: 'active',
  },
  ambulance_en_route: {
    patientHeadline: 'Ambulance En Route',
    patientDetail: 'Help is on the way to your location.',
    dispatcherLabel: 'En route',
    tone: 'active',
  },
  help_arriving: {
    patientHeadline: 'Help Arriving',
    patientDetail: 'Your ambulance is very close. Watch for it if you can.',
    dispatcherLabel: 'Arriving',
    tone: 'active',
  },
  at_patient: {
    patientHeadline: 'Help Has Arrived',
    patientDetail: 'The response team is with you.',
    dispatcherLabel: 'On scene',
    tone: 'active',
  },
  transporting: {
    patientHeadline: 'On the Way to Hospital',
    patientDetail: 'You are being taken to the receiving facility.',
    dispatcherLabel: 'Transporting',
    tone: 'active',
  },
  facility_reached: {
    patientHeadline: 'Arrived at Facility',
    patientDetail: 'You have reached the receiving facility.',
    dispatcherLabel: 'At facility',
    tone: 'active',
  },
  completed: {
    patientHeadline: 'Emergency Completed',
    patientDetail: 'This emergency has been closed.',
    dispatcherLabel: 'Completed',
    tone: 'complete',
  },
  cancelled: {
    patientHeadline: 'Emergency Cancelled',
    patientDetail: 'This emergency request was cancelled.',
    dispatcherLabel: 'Cancelled',
    tone: 'cancelled',
  },
};

/** The eight milestones shown on the patient's active-emergency tracker. */
export interface TrackerStep {
  id: string;
  label: string;
  /** The state at which this milestone becomes complete. */
  reachedAt: EmergencyState;
}

export const TRACKER_STEPS: readonly TrackerStep[] = [
  { id: 'alert_sent', label: 'Alert Sent', reachedAt: 'alert_received' },
  { id: 'dispatch_confirmed', label: 'Dispatch Confirmed', reachedAt: 'dispatch_confirmed' },
  { id: 'response_assigned', label: 'Response Assigned', reachedAt: 'response_assigned' },
  { id: 'ambulance_en_route', label: 'Ambulance En Route', reachedAt: 'ambulance_en_route' },
  { id: 'help_arriving', label: 'Help Arriving', reachedAt: 'help_arriving' },
  { id: 'at_patient', label: 'At Patient', reachedAt: 'at_patient' },
  { id: 'transporting', label: 'Transporting', reachedAt: 'transporting' },
  { id: 'facility_reached', label: 'Facility Reached', reachedAt: 'facility_reached' },
] as const;

export type StepStatus = 'complete' | 'current' | 'upcoming';

export function stepStatus(step: TrackerStep, state: EmergencyState): StepStatus {
  if (state === 'completed') return 'complete';
  const currentIndex = EMERGENCY_STATE_ORDER.indexOf(state);
  const stepIndex = EMERGENCY_STATE_ORDER.indexOf(step.reachedAt);
  if (currentIndex > stepIndex) return 'complete';
  if (currentIndex === stepIndex) return 'current';
  return 'upcoming';
}

/**
 * The transmission checkpoints shown while the alert is in flight.
 *
 * These are separate from TRACKER_STEPS on purpose: during transmission the
 * patient's question is "did it go?", not "where is the ambulance?".
 *
 * `completeAtOrAfter` is the earliest state at which the step is finished. The
 * first three happen on the device before anything is sent, so they complete as
 * soon as transmission begins; the last two depend on MedLink answering.
 */
export interface TransmissionStep {
  id: string;
  label: string;
  completeAtOrAfter: EmergencyState;
}

export const TRANSMISSION_STEPS: readonly TransmissionStep[] = [
  { id: 'identifying', label: 'Identifying patient', completeAtOrAfter: 'sending' },
  { id: 'location', label: 'Capturing available location', completeAtOrAfter: 'sending' },
  { id: 'profile', label: 'Preparing emergency medical profile', completeAtOrAfter: 'sending' },
  { id: 'contacting', label: 'Contacting MedLink dispatch', completeAtOrAfter: 'alert_received' },
  {
    id: 'confirming',
    label: 'Waiting for a dispatcher to confirm',
    completeAtOrAfter: 'dispatch_confirmed',
  },
] as const;

export function transmissionStepStatus(
  step: TransmissionStep,
  state: EmergencyState,
): StepStatus {
  const currentIndex = EMERGENCY_STATE_ORDER.indexOf(state);
  const completeIndex = EMERGENCY_STATE_ORDER.indexOf(step.completeAtOrAfter);
  if (currentIndex >= completeIndex) return 'complete';
  /* The next unfinished step is the one in progress. */
  const previous = TRANSMISSION_STEPS[TRANSMISSION_STEPS.indexOf(step) - 1];
  if (!previous) return 'current';
  return currentIndex >= EMERGENCY_STATE_ORDER.indexOf(previous.completeAtOrAfter)
    ? 'current'
    : 'upcoming';
}

/** True once the emergency has moved past transmission into live response. */
export function isPastTransmission(state: EmergencyState): boolean {
  const index = EMERGENCY_STATE_ORDER.indexOf(state);
  return index >= EMERGENCY_STATE_ORDER.indexOf('dispatch_confirmed') && state !== 'cancelled';
}
