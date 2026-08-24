import type { BotswanaPhone } from './common';
import type { BotswanaLocation } from './location';

/**
 * Whether a facility has a technical link to MedLink. Nothing in this prototype
 * is really connected - Princess Marina Hospital and every other facility here
 * is demonstration data only.
 */
export type FacilityConnectionStatus = 'connected' | 'demo_only' | 'not_connected';

/** Whether the facility takes part in the MedLink response network. */
export type FacilityParticipationStatus = 'participating' | 'pilot' | 'not_participating';

/** Whether the facility can take a patient right now. */
export type FacilityAvailability = 'available' | 'receiving_emergency' | 'limited' | 'unavailable';

export const FACILITY_CONNECTION_LABEL: Record<FacilityConnectionStatus, string> = {
  connected: 'Connected',
  demo_only: 'Demo participating facility',
  not_connected: 'Not connected',
};

export const FACILITY_PARTICIPATION_LABEL: Record<FacilityParticipationStatus, string> = {
  participating: 'Participating',
  pilot: 'Pilot',
  not_participating: 'Not participating',
};

export const FACILITY_AVAILABILITY_LABEL: Record<FacilityAvailability, string> = {
  available: 'Available',
  receiving_emergency: 'Receiving emergency',
  limited: 'Limited capacity',
  unavailable: 'Unavailable',
};

export type FacilityKind = 'referral_hospital' | 'district_hospital' | 'private_hospital' | 'clinic';

export const FACILITY_KIND_LABEL: Record<FacilityKind, string> = {
  referral_hospital: 'Referral hospital',
  district_hospital: 'District hospital',
  private_hospital: 'Private hospital',
  clinic: 'Clinic',
};

export interface ReceivingFacility {
  id: string;
  name: string;
  kind: FacilityKind;
  location: BotswanaLocation;
  phone: BotswanaPhone;
  connectionStatus: FacilityConnectionStatus;
  participationStatus: FacilityParticipationStatus;
  availability: FacilityAvailability;
  capabilities: string[];
  distanceKm: number;
}
