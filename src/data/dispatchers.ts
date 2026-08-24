import type { EmergencyActor } from '@/types';

/**
 * The signed-in dispatcher for the prototype. Authentication is mocked, but the
 * actor shape matches what a real session would provide, so every transition
 * and access-log row is already attributable.
 */
export const DEMO_DISPATCHER: EmergencyActor = {
  role: 'dispatcher',
  id: 'disp_04',
  displayName: 'Dispatcher 04',
  organisation: 'MedLink Dispatch (demo)',
};

export const DEMO_PATIENT_ACTOR: EmergencyActor = {
  role: 'patient',
  id: 'pat_kagiso_molefe',
  displayName: 'Kagiso Molefe',
};

export const SYSTEM_ACTOR: EmergencyActor = {
  role: 'system',
  id: 'medlink_alert_engine',
  displayName: 'MedLink alert engine',
  organisation: 'MedLink (demo)',
};

/**
 * Demo contact line for MedLink dispatch. This is not a real number and not an
 * emergency service - it is here so the "Call Dispatch" action has something
 * concrete to render.
 */
export const DEMO_DISPATCH_LINE = '+26776000100';

export const DEMO_CREW_ACTOR: EmergencyActor = {
  role: 'ambulance_crew',
  id: 'crew_01',
  displayName: 'MED-04 crew',
  organisation: 'MedLink Fleet (demo)',
};
