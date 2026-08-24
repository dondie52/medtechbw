import type { IsoTimestamp } from './common';
import type { Coordinates } from './location';

export type AmbulanceAvailability = 'available' | 'assigned' | 'busy' | 'off_duty';

export const AMBULANCE_AVAILABILITY_LABEL: Record<AmbulanceAvailability, string> = {
  available: 'Available',
  assigned: 'Assigned',
  busy: 'Busy',
  off_duty: 'Off duty',
};

export type CrewQualification = 'paramedic' | 'emt' | 'basic_life_support' | 'driver';

export const CREW_QUALIFICATION_LABEL: Record<CrewQualification, string> = {
  paramedic: 'Paramedic',
  emt: 'EMT',
  basic_life_support: 'BLS responder',
  driver: 'Driver',
};

export interface CrewMember {
  id: string;
  fullName: string;
  qualification: CrewQualification;
}

export interface Ambulance {
  id: string;
  /** Operational call sign shown to dispatchers and patients, e.g. "MED-04". */
  callSign: string;
  availability: AmbulanceAvailability;
  baseStation: string;
  position: Coordinates;
  crew: CrewMember[];
  /**
   * Mocked travel estimates. A real routing provider replaces these via
   * RouteEstimator without any component changing.
   */
  distanceKm: number;
  etaMinutes: number;
  lastPositionAt: IsoTimestamp;
}

/** Non-ambulance verified responders (first aiders, clinic staff, fire/rescue). */
export type ResponderKind = 'first_aider' | 'clinic_nurse' | 'fire_rescue' | 'police';

export interface VerifiedResponder {
  id: string;
  fullName: string;
  kind: ResponderKind;
  organisation: string;
  verified: boolean;
  position: Coordinates;
  distanceKm: number;
}

export interface AedLocation {
  id: string;
  name: string;
  position: Coordinates;
  accessNote: string;
  /** Whether the site has confirmed the unit is present and serviceable. */
  lastVerifiedAt: IsoTimestamp | null;
}

/**
 * Travel estimation boundary. The prototype ships a straight-line mock; a real
 * provider (OSRM, Valhalla, a commercial routing API) implements the same shape.
 */
export interface RouteEstimate {
  distanceKm: number;
  etaMinutes: number;
  /** True when the estimate is a mocked straight-line approximation. */
  isApproximate: boolean;
}

export interface RouteEstimator {
  estimate(from: Coordinates, to: Coordinates): RouteEstimate;
}
