import type { IsoTimestamp, Sourced } from './common';
import type { BotswanaLocation } from './location';

/**
 * The full lifecycle of a MedLink emergency.
 *
 * `idle` and `holding_sos` are pre-emergency: no emergency record exists yet.
 * From `sending` onward there is always an Emergency object.
 */
export type EmergencyState =
  | 'idle'
  | 'holding_sos'
  | 'sending'
  | 'alert_received'
  | 'awaiting_dispatch'
  | 'dispatch_confirmed'
  | 'assigning_response'
  | 'response_assigned'
  | 'ambulance_en_route'
  | 'help_arriving'
  | 'at_patient'
  | 'transporting'
  | 'facility_reached'
  | 'completed'
  | 'cancelled';

/** Who performed an action. Used for the transition trail and access logging. */
export type EmergencyActorRole =
  | 'patient'
  | 'dispatcher'
  | 'ambulance_crew'
  | 'verified_responder'
  | 'facility'
  | 'system';

export interface EmergencyActor {
  role: EmergencyActorRole;
  /** Identifier of the person or service. `system` for automated transitions. */
  id: string;
  displayName: string;
  organisation?: string;
}

export interface EmergencyTransition {
  from: EmergencyState;
  to: EmergencyState;
  at: IsoTimestamp;
  actor: EmergencyActor;
  note?: string;
}

/**
 * Non-verbal communication signals raised by the patient.
 *
 * `acknowledgedAt` is the reason this is an object rather than a boolean: the
 * patient is only ever told that dispatch *has been notified* once dispatch has
 * actually acknowledged the flag.
 */
export type CommunicationFlagCode = 'patient_may_be_unable_to_speak';

export interface CommunicationFlag {
  code: CommunicationFlagCode;
  raisedAt: IsoTimestamp;
  acknowledgedAt: IsoTimestamp | null;
  acknowledgedBy: EmergencyActor | null;
}

export interface CancellationRecord {
  at: IsoTimestamp;
  actor: EmergencyActor;
  reason: string;
}

/**
 * A single emergency case, shared by every role.
 *
 * Note the deliberate split: `knownProfileRef` points at what MedLink already
 * knows about the patient, while `symptomsReported` describes what is happening
 * now. A null `symptomsReported` means "Not provided" and must never be filled
 * in from the medical profile.
 */
export interface Emergency {
  /** Human-readable case reference, e.g. "BW-ML-1028". */
  id: string;
  patientId: string;
  state: EmergencyState;
  createdAt: IsoTimestamp;
  /** Set once the MedLink alert engine acknowledges receipt. */
  acknowledgedAt: IsoTimestamp | null;
  location: BotswanaLocation;

  /** Current-emergency information. Null until somebody actually reports it. */
  symptomsReported: Sourced<string> | null;
  dispatcherNotes: Sourced<string>[];

  communicationFlags: CommunicationFlag[];

  acceptedBy: EmergencyActor | null;
  acceptedAt: IsoTimestamp | null;

  assignedAmbulanceId: string | null;
  assignedAt: IsoTimestamp | null;
  /** Mocked live ETA in minutes for the assigned unit. */
  etaMinutes: number | null;

  receivingFacilityId: string | null;

  transitions: EmergencyTransition[];
  cancellation: CancellationRecord | null;
  completedAt: IsoTimestamp | null;
}

/** Convenience predicate: is this emergency still running? */
export function isEmergencyActive(state: EmergencyState): boolean {
  return state !== 'idle' && state !== 'holding_sos' && state !== 'completed' && state !== 'cancelled';
}

/** True once an emergency record exists (i.e. the alert left the device). */
export function hasEmergencyRecord(state: EmergencyState): boolean {
  return state !== 'idle' && state !== 'holding_sos';
}
