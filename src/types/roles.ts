/** Application shells MedLink will eventually ship. */
export type AppRole =
  | 'patient'
  | 'dispatcher'
  | 'ambulance_crew'
  | 'receiving_facility'
  | 'verified_responder'
  | 'administrator';

export const APP_ROLE_LABEL: Record<AppRole, string> = {
  patient: 'Patient',
  dispatcher: 'Dispatcher',
  ambulance_crew: 'Ambulance crew',
  receiving_facility: 'Receiving facility',
  verified_responder: 'Verified responder',
  administrator: 'Administrator',
};

/**
 * Least-privilege matrix. The prototype mocks authentication, but no component
 * should assume every signed-in user may read patient data - it asks here.
 */
export const ROLE_DATA_PERMISSIONS: Record<AppRole, ReadonlyArray<'emergency_summary' | 'full_profile' | 'location' | 'audit_log'>> = {
  patient: ['emergency_summary', 'full_profile', 'location'],
  dispatcher: ['emergency_summary', 'location'],
  ambulance_crew: ['emergency_summary', 'location'],
  receiving_facility: ['emergency_summary'],
  verified_responder: ['location'],
  administrator: ['audit_log'],
};

export function roleMayRead(
  role: AppRole,
  capability: 'emergency_summary' | 'full_profile' | 'location' | 'audit_log',
): boolean {
  return ROLE_DATA_PERMISSIONS[role].includes(capability);
}
