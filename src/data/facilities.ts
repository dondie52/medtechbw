import type { ReceivingFacility } from '@/types';
import { DEMO_PLACES } from './geography';

/**
 * Demo facilities.
 *
 * Every entry is marked `demo_only`, because MedLink has no technical or
 * commercial integration with any of these hospitals. The UI surfaces that as
 * "Demo participating facility" rather than implying a live partnership.
 */
export const DEMO_FACILITIES: ReceivingFacility[] = [
  {
    id: 'fac_princess_marina',
    name: 'Princess Marina Hospital',
    kind: 'referral_hospital',
    location: {
      coordinates: { lat: -24.6489, lng: 25.9095 },
      townOrVillage: 'Gaborone',
      district: 'South-East District',
      ward: 'Gaborone CBD',
      landmark: 'Notwane Road',
    },
    phone: '+26739021000',
    connectionStatus: 'demo_only',
    participationStatus: 'participating',
    availability: 'available',
    capabilities: ['Emergency department', 'Neurology', 'Intensive care', 'Imaging'],
    distanceKm: 5.8,
  },
  {
    id: 'fac_bokamoso',
    name: 'Bokamoso Private Hospital',
    kind: 'private_hospital',
    location: {
      coordinates: { lat: -24.6069, lng: 25.8747 },
      townOrVillage: 'Mmopane',
      district: 'Kweneng District',
      landmark: 'Mmopane Junction',
    },
    phone: '+26736900000',
    connectionStatus: 'demo_only',
    participationStatus: 'pilot',
    availability: 'available',
    capabilities: ['Emergency department', 'Cardiology', 'Intensive care'],
    distanceKm: 7.4,
  },
  {
    id: 'fac_gaborone_private',
    name: 'Gaborone Private Hospital',
    kind: 'private_hospital',
    location: {
      coordinates: { lat: -24.6538, lng: 25.9243 },
      townOrVillage: 'Gaborone',
      district: 'South-East District',
      ward: 'Broadhurst',
      landmark: 'Segoditshane Way',
    },
    phone: '+26736368400',
    connectionStatus: 'demo_only',
    participationStatus: 'participating',
    availability: 'limited',
    capabilities: ['Emergency department', 'Imaging'],
    distanceKm: 6.1,
  },
  {
    id: 'fac_block8_clinic',
    name: 'Block 8 Clinic',
    kind: 'clinic',
    location: DEMO_PLACES.block8,
    phone: '+26739112200',
    connectionStatus: 'not_connected',
    participationStatus: 'not_participating',
    availability: 'unavailable',
    capabilities: ['Primary care'],
    distanceKm: 0.9,
  },
];

export function findFacility(id: string | null): ReceivingFacility | undefined {
  if (!id) return undefined;
  return DEMO_FACILITIES.find((facility) => facility.id === id);
}
