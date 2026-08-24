import type { IsoTimestamp } from './common';

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Botswana addressing is landmark- and ward-led, not postal. Every field except
 * the coordinates and district is optional, because a real emergency location
 * is frequently "the plot behind the filling station" rather than a street
 * number.
 */
export interface BotswanaLocation {
  coordinates: Coordinates;
  townOrVillage: string;
  district: string;
  ward?: string;
  plot?: string;
  road?: string;
  landmark?: string;
  /** GPS accuracy in metres, when the source reported one. */
  accuracyMetres?: number;
  capturedAt?: IsoTimestamp;
}

/** Short one-line form used in headers and list rows: "Block 8, Gaborone". */
export function formatLocationLine(location: BotswanaLocation): string {
  return [location.ward, location.townOrVillage].filter(Boolean).join(', ');
}

/** Secondary landmark line: "Near Airport Junction". */
export function formatLandmarkLine(location: BotswanaLocation): string | null {
  return location.landmark ? `Near ${location.landmark}` : null;
}
