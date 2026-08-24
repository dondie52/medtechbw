import type { ComponentType } from 'react';
import type { Coordinates } from '@/types';

export type MapEntityKind = 'patient' | 'ambulance' | 'facility' | 'responder' | 'aed';

export interface MapEntity {
  id: string;
  kind: MapEntityKind;
  position: Coordinates;
  label: string;
  /** Second line in the marker callout, e.g. "Available - 3.2 km". */
  detail?: string;
  /** Draws the marker larger and above the others. */
  emphasis?: boolean;
}

export interface MapRoute {
  from: Coordinates;
  to: Coordinates;
  label?: string;
}

export interface MapProviderProps {
  entities: MapEntity[];
  route?: MapRoute | null;
  /** Accessible name for the map region. */
  ariaLabel: string;
  className?: string;
}

/**
 * A map provider is anything that can draw MedLink entities.
 *
 * The prototype ships a mock canvas so the app runs with no API key and no
 * network. Swapping in MapLibre with OpenStreetMap tiles, or a commercial
 * provider, means writing one component with this prop shape.
 */
export interface MapProvider {
  name: string;
  Component: ComponentType<MapProviderProps>;
  /** True when the provider needs credentials the repository must never hold. */
  requiresApiKey: boolean;
}

export const ENTITY_LABEL: Record<MapEntityKind, string> = {
  patient: 'Patient',
  ambulance: 'Ambulance',
  facility: 'Healthcare facility',
  responder: 'Verified responder',
  aed: 'AED',
};
