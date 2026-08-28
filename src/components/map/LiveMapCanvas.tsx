'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui';
import { ENTITY_LABEL, type MapEntityKind, type MapProviderProps } from './map-types';

/**
 * Real, pannable OpenStreetMap tiles via Leaflet - the provider the mock
 * canvas (`MockMapCanvas`) was always meant to be swapped for once the app
 * needed to look and behave like the real thing for a demo.
 *
 * Leaflet is loaded from a CDN at runtime rather than as an npm dependency.
 * Two reasons, not one:
 *   1. The static export has no server, so there is nothing to keep a map
 *      SDK's bundle size off of - loading it only on the pages that render a
 *      map keeps it out of every screen that does not.
 *   2. OpenStreetMap tiles are fetched live over the network regardless of
 *      how the library arrives; a demo device with no connectivity cannot
 *      show a real map either way; a CDN script adds no new failure mode.
 * `MapContainer`'s error boundary and `unavailable` prop still apply - a
 * demo on a dead connection falls back to the same text list of entities the
 * mock canvas has always shown.
 */

interface LeafletLatLngBounds {
  isValid(): boolean;
}

interface LeafletLayer {
  addTo(target: LeafletMap | LeafletLayerGroup): LeafletLayer;
}

interface LeafletMarker extends LeafletLayer {
  bindTooltip(content: string, options?: Record<string, unknown>): LeafletMarker;
}

interface LeafletLayerGroup extends LeafletLayer {
  clearLayers(): void;
}

interface LeafletMap {
  remove(): void;
  setView(center: [number, number], zoom: number): LeafletMap;
  fitBounds(bounds: LeafletLatLngBounds, options?: Record<string, unknown>): LeafletMap;
}

interface LeafletStatic {
  map(el: HTMLElement, options?: Record<string, unknown>): LeafletMap;
  tileLayer(urlTemplate: string, options?: Record<string, unknown>): LeafletLayer;
  marker(latlng: [number, number], options?: Record<string, unknown>): LeafletMarker;
  polyline(latlngs: [number, number][], options?: Record<string, unknown>): LeafletLayer;
  layerGroup(): LeafletLayerGroup;
  divIcon(options: Record<string, unknown>): unknown;
  latLngBounds(latlngs: [number, number][]): LeafletLatLngBounds;
}

declare global {
  interface Window {
    L?: LeafletStatic;
  }
}

const LEAFLET_VERSION = '1.9.4';
const LEAFLET_JS_URL = `https://cdn.jsdelivr.net/npm/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
const LEAFLET_CSS_URL = `https://cdn.jsdelivr.net/npm/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

let leafletPromise: Promise<LeafletStatic> | null = null;

/**
 * Resolves once Leaflet's stylesheet has loaded, not just requested. Racing
 * `L.map()` against an unloaded stylesheet produces a map with unstyled panes
 * - tiles and controls stacked and mispositioned until the CSS catches up.
 */
function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('link[data-medlink-leaflet="css"]')) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-medlink-leaflet', 'css');
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('Failed to load the map stylesheet'));
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.setAttribute('data-medlink-leaflet', 'js');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load the map library'));
    document.head.appendChild(script);
  });
}

function loadLeaflet(): Promise<LeafletStatic> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Leaflet only loads in the browser'));
  }
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = Promise.all([loadStylesheet(LEAFLET_CSS_URL), loadScript(LEAFLET_JS_URL)])
    .then(() => {
      if (!window.L) throw new Error('Leaflet failed to initialise');
      return window.L;
    })
    .catch((error: unknown) => {
      /* Let a later mount try again instead of caching a permanent failure. */
      leafletPromise = null;
      throw error;
    });

  return leafletPromise;
}

/** Marker shapes mirror `MockMapCanvas` so the two providers read as one design. */
const MARKER_SHAPE: Record<MapEntityKind, string> = {
  patient: `
    <circle cx="16" cy="16" r="13" fill="var(--emergency)" stroke="#fff" stroke-width="2.5"/>
    <circle cx="16" cy="16" r="5" fill="#fff"/>`,
  ambulance: `
    <rect x="3" y="3" width="26" height="26" rx="9" fill="var(--brand-deep)" stroke="#fff" stroke-width="2"/>
    <path d="M9 13h8v6H9zM17 15h4l3 3v1h-7z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>
    <circle cx="11.5" cy="20.5" r="1.8" fill="#fff"/>
    <circle cx="21" cy="20.5" r="1.8" fill="#fff"/>`,
  facility: `
    <circle cx="16" cy="16" r="13" fill="#fff" stroke="var(--brand)" stroke-width="2.6"/>
    <path d="M16 10v12M10 16h12" stroke="var(--brand)" stroke-width="2.8" stroke-linecap="round"/>`,
  responder: `
    <path d="M16 3 29 16 16 29 3 16Z" fill="#fff" stroke="var(--brand-600)" stroke-width="2.6"/>
    <path d="M16 11v10M11 16h10" stroke="var(--brand-600)" stroke-width="2.4" stroke-linecap="round"/>`,
  aed: `
    <rect x="4" y="4" width="24" height="24" rx="6" fill="#fff" stroke="var(--success)" stroke-width="2.6"/>
    <path d="M8 16h4l2-5 4 10 2-5h4" fill="none" stroke="var(--success)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
};

function markerHtml(kind: MapEntityKind, size: number): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" style="filter:drop-shadow(0 2px 3px rgba(25,28,32,0.35))">${MARKER_SHAPE[kind]}</svg>`;
}

function buildIcon(L: LeafletStatic, kind: MapEntityKind, emphasis?: boolean) {
  const size = emphasis ? 40 : 30;
  return L.divIcon({
    html: markerHtml(kind, size),
    className: 'medlink-map-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function LiveMapCanvas({ entities, route, ariaLabel, className }: MapProviderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerGroupRef = useRef<LeafletLayerGroup | null>(null);
  const leafletRef = useRef<LeafletStatic | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        const map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          attributionControl: true,
        }).setView([-24.6282, 25.9231], 13);
        L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);
        const group = L.layerGroup();
        group.addTo(map);
        leafletRef.current = L;
        mapRef.current = map;
        layerGroupRef.current = group;
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
      leafletRef.current = null;
    };
    /* Leaflet owns this container for its lifetime; entity updates are handled
       by the effect below rather than by tearing the map down and rebuilding it. */
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (status !== 'ready' || !L || !map || !group) return;

    group.clearLayers();
    const points: [number, number][] = [];

    for (const entity of entities) {
      const latlng: [number, number] = [entity.position.lat, entity.position.lng];
      points.push(latlng);
      L.marker(latlng, { icon: buildIcon(L, entity.kind, entity.emphasis) })
        .bindTooltip(entity.label, {
          permanent: true,
          direction: 'top',
          offset: [0, entity.emphasis ? -24 : -18],
          className: 'medlink-map-tooltip',
        })
        .addTo(group);
    }

    if (route) {
      const from: [number, number] = [route.from.lat, route.from.lng];
      const to: [number, number] = [route.to.lat, route.to.lng];
      points.push(from, to);
      L.polyline([from, to], { color: '#ffffff', weight: 6, opacity: 0.9, lineCap: 'round' }).addTo(group);
      L.polyline([from, to], {
        color: '#005EB8',
        weight: 3.5,
        opacity: 0.95,
        dashArray: '1 10',
        lineCap: 'round',
      }).addTo(group);
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [32, 32], maxZoom: 16 });
    }
  }, [entities, route, status]);

  return (
    <div className={cn('relative bg-surface-low', className)}>
      <div ref={containerRef} aria-label={ariaLabel} className="h-full w-full" />

      {status !== 'ready' ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-surface-low px-4 text-center">
          <Icon name="map" size={18} className="text-ink-subtle" />
          <p className="text-sm font-medium text-ink-muted">
            {status === 'loading' ? 'Loading map…' : 'Map unavailable - your emergency is not affected.'}
          </p>
        </div>
      ) : null}

      {/* A live map is meaningless to a screen reader; the same entities are
          always available as text, exactly as they are for the mock canvas. */}
      <ul className="sr-only">
        {entities.map((entity) => (
          <li key={entity.id}>
            {ENTITY_LABEL[entity.kind]}: {entity.label}
            {entity.detail ? `. ${entity.detail}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
