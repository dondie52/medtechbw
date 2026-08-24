/**
 * Where a piece of information came from.
 *
 * This exists because MedLink must never blur the line between what is *known*
 * about a patient and what is *happening now*. Anything shown to a responder
 * carries its origin so the UI can label it honestly.
 */
export type DataSource =
  | 'patient_profile'
  | 'patient_reported'
  | 'dispatcher'
  | 'ambulance_crew'
  | 'verified_responder'
  | 'facility'
  | 'system';

export const DATA_SOURCE_LABEL: Record<DataSource, string> = {
  patient_profile: 'From patient medical profile',
  patient_reported: 'Reported by patient',
  dispatcher: 'Recorded by dispatcher',
  ambulance_crew: 'Recorded by ambulance crew',
  verified_responder: 'Recorded by verified responder',
  facility: 'Recorded by receiving facility',
  system: 'Recorded automatically by MedLink',
};

/** A value that always travels with its provenance and capture time. */
export interface Sourced<T> {
  value: T;
  source: DataSource;
  recordedAt: string;
}

export function sourced<T>(value: T, source: DataSource, recordedAt: string): Sourced<T> {
  return { value, source, recordedAt };
}

/** ISO-8601 timestamp. Aliased for readability in domain models. */
export type IsoTimestamp = string;

/** Botswana phone number in +267 XX XXX XXX form. */
export type BotswanaPhone = string;
