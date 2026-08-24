import type { BotswanaLocation, Coordinates } from '@/types';

/** Gaborone city centre - the default map focus for the prototype. */
export const GABORONE_CENTRE: Coordinates = { lat: -24.6282, lng: 25.9231 };

/**
 * Named Botswana places used by the demo. Launch scope is Gaborone; the rest
 * are here so the location model is exercised beyond a single city.
 */
export const DEMO_PLACES = {
  block8: {
    coordinates: { lat: -24.6087, lng: 25.9412 },
    townOrVillage: 'Gaborone',
    district: 'South-East District',
    ward: 'Block 8',
    plot: 'Plot 2345',
    road: 'Nakedi Road',
    landmark: 'Airport Junction',
    accuracyMetres: 12,
  },
  broadhurst: {
    coordinates: { lat: -24.6234, lng: 25.9345 },
    townOrVillage: 'Gaborone',
    district: 'South-East District',
    ward: 'Broadhurst',
    landmark: 'Broadhurst Mall',
  },
  mainMall: {
    coordinates: { lat: -24.6569, lng: 25.9088 },
    townOrVillage: 'Gaborone',
    district: 'South-East District',
    ward: 'Main Mall',
    landmark: 'Main Mall',
  },
  cbd: {
    coordinates: { lat: -24.6465, lng: 25.9119 },
    townOrVillage: 'Gaborone',
    district: 'South-East District',
    ward: 'Gaborone CBD',
    landmark: 'Central Business District',
  },
  tlokweng: {
    coordinates: { lat: -24.6603, lng: 25.9702 },
    townOrVillage: 'Tlokweng',
    district: 'South-East District',
    landmark: 'Tlokweng Border Gate',
  },
  mogoditshane: {
    coordinates: { lat: -24.6272, lng: 25.8664 },
    townOrVillage: 'Mogoditshane',
    district: 'Kweneng District',
    landmark: 'Mogoditshane Main Road',
  },
} as const satisfies Record<string, BotswanaLocation>;

/**
 * Districts MedLink would expand into. Held as data rather than hard-coded in
 * a picker so onboarding a new operating area is a data change.
 */
export const FUTURE_OPERATING_AREAS = [
  { townOrVillage: 'Francistown', district: 'North-East District' },
  { townOrVillage: 'Maun', district: 'North-West District' },
  { townOrVillage: 'Molepolole', district: 'Kweneng District' },
  { townOrVillage: 'Kanye', district: 'Southern District' },
  { townOrVillage: 'Lobatse', district: 'South-East District' },
  { townOrVillage: 'Serowe', district: 'Central District' },
  { townOrVillage: 'Palapye', district: 'Central District' },
  { townOrVillage: 'Mahalapye', district: 'Central District' },
  { townOrVillage: 'Kasane', district: 'Chobe District' },
] as const;
