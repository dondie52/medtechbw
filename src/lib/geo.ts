import type { Coordinates, RouteEstimate, RouteEstimator } from '@/types';

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance. Good enough for a mocked prototype. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Straight-line estimator used by the prototype.
 *
 * Urban Gaborone response speed is assumed at 32 km/h with a 1.35 road-winding
 * factor and a 2 minute mobilisation allowance. Replacing this with a real
 * routing provider means implementing RouteEstimator - nothing else changes.
 */
export const mockRouteEstimator: RouteEstimator = {
  estimate(from: Coordinates, to: Coordinates): RouteEstimate {
    const straightLineKm = haversineKm(from, to);
    const roadKm = straightLineKm * 1.35;
    const etaMinutes = Math.max(2, Math.round(2 + (roadKm / 32) * 60));
    return { distanceKm: Number(roadKm.toFixed(1)), etaMinutes, isApproximate: true };
  },
};

/** Linear interpolation between two coordinates, used to animate the mock unit. */
export function interpolate(from: Coordinates, to: Coordinates, progress: number): Coordinates {
  const t = Math.min(1, Math.max(0, progress));
  return { lat: from.lat + (to.lat - from.lat) * t, lng: from.lng + (to.lng - from.lng) * t };
}

export interface GeoBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export function boundsOf(points: Coordinates[], paddingDegrees = 0.006): GeoBounds | null {
  if (points.length === 0) return null;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLng = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  for (const point of points) {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  }
  const latPad = Math.max(paddingDegrees, (maxLat - minLat) * 0.25);
  const lngPad = Math.max(paddingDegrees, (maxLng - minLng) * 0.25);
  return {
    minLat: minLat - latPad,
    maxLat: maxLat + latPad,
    minLng: minLng - lngPad,
    maxLng: maxLng + lngPad,
  };
}

/**
 * Equirectangular projection into a 0-100 viewBox space. Latitude is flipped so
 * north is up. Adequate at city scale; a tiled map provider handles the rest.
 */
export function projectToViewBox(point: Coordinates, bounds: GeoBounds): { x: number; y: number } {
  const width = bounds.maxLng - bounds.minLng || 1;
  const height = bounds.maxLat - bounds.minLat || 1;
  return {
    x: ((point.lng - bounds.minLng) / width) * 100,
    y: ((bounds.maxLat - point.lat) / height) * 100,
  };
}
