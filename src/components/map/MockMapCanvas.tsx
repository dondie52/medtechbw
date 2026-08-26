'use client';

import { useId, useMemo } from 'react';
import { boundsOf, projectToViewBox } from '@/lib/geo';
import { cn } from '@/lib/cn';
import { ENTITY_LABEL, type MapEntityKind, type MapProviderProps } from './map-types';

/**
 * Schematic map used for development and demos.
 *
 * It draws a plausible Gaborone-style street grid derived from the entity
 * bounds rather than a photograph of a map, so nothing here is a real
 * cartographic claim and the app runs with no tiles, no API key and no network.
 */

/** Marker shapes differ per kind, so the map is readable without colour. */
function Marker({ kind, emphasis }: { kind: MapEntityKind; emphasis?: boolean }) {
  const scale = emphasis ? 1.25 : 1;
  switch (kind) {
    case 'patient':
      return (
        <g transform={`scale(${scale})`}>
          <circle r="13" fill="var(--emergency)" />
          <circle r="4.6" fill="#fff" />
        </g>
      );
    case 'ambulance':
      return (
        <g transform={`scale(${scale})`}>
          <rect x="-13" y="-13" width="26" height="26" rx="9" fill="var(--brand-deep)" />
          <path
            d="M-7 -3h8v6h-8zM1 -1h4l3 3v1h-7z"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle cx="-4.5" cy="4.5" r="1.8" fill="#fff" />
          <circle cx="5" cy="4.5" r="1.8" fill="#fff" />
        </g>
      );
    case 'facility':
      return (
        <g transform={`scale(${scale})`}>
          <circle r="13" fill="#fff" stroke="var(--brand)" strokeWidth="2.4" />
          <path d="M0 -6v12M-6 0h12" stroke="var(--brand)" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    case 'responder':
      return (
        <g transform={`scale(${scale})`}>
          <path d="M0 -13 13 0 0 13 -13 0Z" fill="#fff" stroke="var(--brand-600)" strokeWidth="2.4" />
          <path d="M0 -5v10M-5 0h10" stroke="var(--brand-600)" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case 'aed':
      return (
        <g transform={`scale(${scale})`}>
          <rect x="-12" y="-12" width="24" height="24" rx="5" fill="#fff" stroke="var(--success)" strokeWidth="2.4" />
          <path
            d="M-7 0h3l2-4 3 8 1.8-4H7"
            fill="none"
            stroke="var(--success)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
  }
}

export function MockMapCanvas({ entities, route, ariaLabel, className }: MapProviderProps) {
  const gradientId = useId();

  const bounds = useMemo(() => {
    const points = entities.map((entity) => entity.position);
    if (route) points.push(route.from, route.to);
    return boundsOf(points);
  }, [entities, route]);

  const placed = useMemo(() => {
    if (!bounds) return [];
    return entities.map((entity) => ({
      entity,
      point: projectToViewBox(entity.position, bounds),
    }));
  }, [entities, bounds]);

  const routePath = useMemo(() => {
    if (!bounds || !route) return null;
    const from = projectToViewBox(route.from, bounds);
    const to = projectToViewBox(route.to, bounds);
    /* An L-shaped dogleg reads as "along streets" rather than as-the-crow-flies,
     * which would overstate how directly a vehicle can travel. */
    const midX = from.x + (to.x - from.x) * 0.62;
    return `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
  }, [bounds, route]);

  if (!bounds) return null;

  /*
   * Cartographic fills (tarmac, parkland, water) are intentionally outside the
   * brand token system - they describe terrain, not product state, and giving
   * them semantic names would invite their reuse in the UI.
   */
  return (
    <div className={cn('relative overflow-hidden bg-[#EEF1F6]', className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F3F6FA" />
            <stop offset="100%" stopColor="#E6EDF4" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill={`url(#${gradientId})`} />

        {/* Green space and water, to keep the canvas from reading as an error state */}
        <path d="M0 74 Q 22 66 42 76 T 100 70 L100 100 L0 100Z" fill="#DCE9DE" opacity="0.75" />
        <path d="M62 88 Q 74 80 100 84 L100 100 L60 100Z" fill="#CADDEC" />

        {/* Street grid */}
        <g stroke="#D3DCE6" strokeWidth="0.7">
          {[8, 20, 32, 44, 56, 68, 80, 92].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
          ))}
          {[10, 24, 38, 52, 66, 80, 94].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />
          ))}
        </g>
        <g stroke="#C2CEDB" strokeWidth="1.6">
          <line x1="0" y1="44" x2="100" y2="44" />
          <line x1="52" y1="0" x2="52" y2="100" />
        </g>

        {routePath ? (
          <>
            <path d={routePath} fill="none" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
            <path
              d={routePath}
              fill="none"
              stroke="var(--brand-600)"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeDasharray="4 2.5"
            />
          </>
        ) : null}

        {placed.map(({ entity, point }) => (
          <g
            key={entity.id}
            transform={`translate(${point.x} ${point.y}) scale(0.34)`}
            style={{ pointerEvents: 'none' }}
          >
            <Marker kind={entity.kind} emphasis={entity.emphasis} />
          </g>
        ))}
      </svg>

      {/* Marker labels in HTML so they stay legible at any canvas size. Capped
          in width so a long facility name truncates with an ellipsis instead
          of overflowing, and anchored off the marker's edge (rather than
          centred) once it's close enough to the frame that a centred label
          would clip - the full name is always in the sr-only list below. */}
      <div className="pointer-events-none absolute inset-0">
        {placed.map(({ entity, point }) => (
          <span
            key={entity.id}
            title={entity.label}
            className={cn(
              'absolute max-w-[112px] truncate rounded-control bg-white/95 px-2 py-0.5',
              'text-[11px] font-semibold text-ink shadow-card',
              point.x < 15 ? 'translate-x-0' : point.x > 85 ? '-translate-x-full' : '-translate-x-1/2',
              point.y > 88 ? '-translate-y-[calc(100%+8px)]' : 'translate-y-2',
            )}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {entity.label}
          </span>
        ))}
      </div>

      {/*
        Text equivalent. A schematic map is meaningless to a screen reader, so
        the same information is available as a list.
      */}
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
