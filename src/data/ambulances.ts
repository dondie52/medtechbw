import type { Ambulance, AedLocation, VerifiedResponder } from '@/types';

/**
 * Demo fleet. Distances and ETAs here are seed values; the assignment drawer
 * recalculates them against the live emergency location using the
 * RouteEstimator, so swapping in a real routing provider changes these numbers
 * without touching a component.
 */
export const DEMO_AMBULANCES: Ambulance[] = [
  {
    id: 'amb_med_04',
    callSign: 'MED-04',
    availability: 'available',
    baseStation: 'Broadhurst Station',
    position: { lat: -24.6208, lng: 25.9312 },
    crew: [
      { id: 'crew_01', fullName: 'Boitumelo Kgosi', qualification: 'paramedic' },
      { id: 'crew_02', fullName: 'Tebogo Rampa', qualification: 'paramedic' },
    ],
    distanceKm: 3.2,
    etaMinutes: 7,
    lastPositionAt: '2026-10-24T14:31:40+02:00',
  },
  {
    id: 'amb_med_07',
    callSign: 'MED-07',
    availability: 'available',
    baseStation: 'Gaborone CBD Station',
    position: { lat: -24.6465, lng: 25.9119 },
    crew: [
      { id: 'crew_03', fullName: 'Neo Phiri', qualification: 'emt' },
      { id: 'crew_04', fullName: 'Kabelo Dintwe', qualification: 'driver' },
    ],
    distanceKm: 5.1,
    etaMinutes: 11,
    lastPositionAt: '2026-10-24T14:31:52+02:00',
  },
  {
    id: 'amb_med_02',
    callSign: 'MED-02',
    availability: 'busy',
    baseStation: 'Tlokweng Station',
    position: { lat: -24.6603, lng: 25.9702 },
    crew: [{ id: 'crew_05', fullName: 'Mpho Sebina', qualification: 'paramedic' }],
    distanceKm: 6.4,
    etaMinutes: 14,
    lastPositionAt: '2026-10-24T14:30:12+02:00',
  },
  {
    id: 'amb_med_11',
    callSign: 'MED-11',
    availability: 'available',
    baseStation: 'Mogoditshane Station',
    position: { lat: -24.6272, lng: 25.8664 },
    crew: [
      { id: 'crew_06', fullName: 'Onalenna Moeng', qualification: 'basic_life_support' },
      { id: 'crew_07', fullName: 'Gaone Tau', qualification: 'driver' },
    ],
    distanceKm: 8.3,
    etaMinutes: 17,
    lastPositionAt: '2026-10-24T14:31:05+02:00',
  },
  {
    id: 'amb_med_09',
    callSign: 'MED-09',
    availability: 'off_duty',
    baseStation: 'Broadhurst Station',
    position: { lat: -24.6208, lng: 25.9312 },
    crew: [],
    distanceKm: 3.4,
    etaMinutes: 8,
    lastPositionAt: '2026-10-24T12:04:00+02:00',
  },
];

export const DEMO_RESPONDERS: VerifiedResponder[] = [
  {
    id: 'res_01',
    fullName: 'Kelebogile Motsumi',
    kind: 'first_aider',
    organisation: 'Airport Junction Shopping Centre',
    verified: true,
    position: { lat: -24.6072, lng: 25.9398 },
    distanceKm: 0.4,
  },
  {
    id: 'res_02',
    fullName: 'Sister Amantle Kebonang',
    kind: 'clinic_nurse',
    organisation: 'Block 8 Clinic',
    verified: true,
    position: { lat: -24.6119, lng: 25.9376 },
    distanceKm: 0.9,
  },
];

export const DEMO_AEDS: AedLocation[] = [
  {
    id: 'aed_01',
    name: 'Airport Junction Shopping Centre - main concourse',
    position: { lat: -24.6069, lng: 25.9401 },
    accessNote: 'Wall cabinet beside the information desk. Open 09:00-21:00.',
    lastVerifiedAt: '2026-08-02T10:00:00+02:00',
  },
  {
    id: 'aed_02',
    name: 'Block 8 Clinic - reception',
    position: { lat: -24.6121, lng: 25.9371 },
    accessNote: 'Behind reception. Ask any staff member.',
    lastVerifiedAt: '2026-06-19T08:30:00+02:00',
  },
  {
    id: 'aed_03',
    name: 'Riverwalk Mall - management office',
    position: { lat: -24.6551, lng: 25.9354 },
    accessNote: 'Ground floor management office.',
    lastVerifiedAt: null,
  },
];
