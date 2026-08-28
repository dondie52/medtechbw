'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui';
import { LiveMapCanvas } from './LiveMapCanvas';
import { MockMapCanvas } from './MockMapCanvas';
import { ENTITY_LABEL, type MapEntity, type MapProvider, type MapRoute } from './map-types';

/**
 * Real OpenStreetMap tiles via Leaflet - the default provider everywhere in
 * the app, so a demo shows an actual pannable map of Gaborone rather than a
 * schematic. No API key: OSM's tile service and the Leaflet library (loaded
 * from a CDN) are both free and keyless.
 */
export const liveMapProvider: MapProvider = {
  name: 'OpenStreetMap (Leaflet)',
  Component: LiveMapCanvas,
  requiresApiKey: false,
};

/**
 * Schematic fallback, kept for anywhere a real network tile fetch is
 * undesirable (offline development, tests, or a future explicit "lite mode").
 */
export const mockMapProvider: MapProvider = {
  name: 'MedLink schematic (mock)',
  Component: MockMapCanvas,
  requiresApiKey: false,
};

/**
 * Shown when the map cannot render.
 *
 * The wording matters. A patient whose map fails must not conclude that their
 * emergency failed - the map is a convenience, the alert is the product.
 */
function MapFallback({ entities, reason }: { entities: MapEntity[]; reason: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3 bg-surface-low p-5">
      <div className="flex items-center gap-2 text-ink-muted">
        <Icon name="map" size={18} />
        <p className="text-sm font-semibold">Map unavailable</p>
      </div>
      <p className="text-sm text-ink-muted">
        {reason} This does not affect your emergency - your alert and your location are handled
        separately from the map.
      </p>
      {entities.length > 0 ? (
        <ul className="mt-1 space-y-1 text-sm text-ink">
          {entities.map((entity) => (
            <li key={entity.id} className="flex gap-2">
              <span className="font-medium text-ink-subtle">{ENTITY_LABEL[entity.kind]}:</span>
              <span>{entity.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

/** Keeps a map rendering failure from taking down the emergency screen with it. */
class MapErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  override state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Map provider failed to render', error, info);
    }
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export interface MapContainerProps {
  entities: MapEntity[];
  route?: MapRoute | null;
  ariaLabel: string;
  className?: string;
  provider?: MapProvider;
  /** Force the fallback, e.g. while offline. */
  unavailable?: boolean;
  unavailableReason?: string;
  children?: ReactNode;
}

export function MapContainer({
  entities,
  route = null,
  ariaLabel,
  className,
  provider = liveMapProvider,
  unavailable,
  unavailableReason = 'The map could not be loaded.',
  children,
}: MapContainerProps) {
  const Provider = provider.Component;
  const fallback = <MapFallback entities={entities} reason={unavailableReason} />;

  return (
    <div className={cn('relative overflow-hidden rounded-card border border-line', className)}>
      {unavailable ? (
        fallback
      ) : (
        <>
          <MapErrorBoundary fallback={fallback}>
            <Provider entities={entities} route={route} ariaLabel={ariaLabel} className="h-full w-full" />
          </MapErrorBoundary>
          {children}
        </>
      )}
    </div>
  );
}

/** Counts by entity kind, as in the V1 dispatcher console. */
export function MapLegend({ entities, className }: { entities: MapEntity[]; className?: string }) {
  const counts = entities.reduce<Partial<Record<MapEntity['kind'], number>>>((acc, entity) => {
    acc[entity.kind] = (acc[entity.kind] ?? 0) + 1;
    return acc;
  }, {});

  const swatch: Record<MapEntity['kind'], string> = {
    patient: 'bg-emergency',
    ambulance: 'bg-brand-deep',
    facility: 'border-2 border-brand bg-white',
    responder: 'rotate-45 border-2 border-brand-600 bg-white',
    aed: 'rounded-[3px] border-2 border-success bg-white',
  };

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted', className)}>
      {(Object.keys(counts) as MapEntity['kind'][]).map((kind) => (
        <li key={kind} className="flex items-center gap-1.5">
          <span className={cn('h-2.5 w-2.5 rounded-full', swatch[kind])} aria-hidden />
          <span>
            {ENTITY_LABEL[kind]} ({counts[kind]})
          </span>
        </li>
      ))}
    </ul>
  );
}
