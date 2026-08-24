import type { IsoTimestamp } from './common';
import type { EmergencyActorRole } from './emergency';

/**
 * Categories of patient data an authorised responder can open. Logging is at
 * this granularity so an audit answers "who saw the allergy list", not merely
 * "who opened the case".
 */
export type AccessedDataCategory =
  | 'emergency_location'
  | 'emergency_medical_summary'
  | 'allergies'
  | 'medications'
  | 'medical_history'
  | 'emergency_contact'
  | 'medical_aid'
  | 'full_medical_profile';

export const ACCESSED_DATA_LABEL: Record<AccessedDataCategory, string> = {
  emergency_location: 'Emergency location',
  emergency_medical_summary: 'Emergency medical summary',
  allergies: 'Allergies',
  medications: 'Current medications',
  medical_history: 'Medical history',
  emergency_contact: 'Emergency contact',
  medical_aid: 'Medical aid cover',
  full_medical_profile: 'Full medical profile',
};

/**
 * One audit row. In production this is written server-side and is immutable;
 * the prototype records the same shape in memory so the UI and the future API
 * agree on the contract.
 */
export interface EmergencyDataAccessLog {
  id: string;
  emergencyId: string;
  organisation: string;
  userId: string;
  role: EmergencyActorRole;
  dataAccessed: AccessedDataCategory[];
  timestamp: IsoTimestamp;
  /** Why the access was permitted, e.g. "Accepted emergency BW-ML-1028". */
  reason: string;
}
