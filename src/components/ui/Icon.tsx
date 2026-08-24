import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The application's whole icon set, as inline SVG.
 *
 * The Stitch export pulled Material Symbols from Google Fonts on all ten
 * screens (18 separate imports). One local set removes that network dependency,
 * keeps icons available offline - which matters for an emergency app on a weak
 * link - and guarantees they inherit `currentColor`.
 */
export type IconName =
  | 'bell'
  | 'gps'
  | 'home'
  | 'medical-profile'
  | 'history'
  | 'settings'
  | 'contacts'
  | 'aed'
  | 'map'
  | 'press'
  | 'chevron-right'
  | 'arrow-back'
  | 'arrow-forward'
  | 'close'
  | 'call'
  | 'group'
  | 'voice-off'
  | 'cancel'
  | 'check'
  | 'check-circle'
  | 'warning'
  | 'dangerous'
  | 'medication'
  | 'hospital'
  | 'ambulance'
  | 'timer'
  | 'signal-weak'
  | 'signal-off'
  | 'spinner'
  | 'pin'
  | 'campaign'
  | 'shield-health'
  | 'search'
  | 'layers'
  | 'person'
  | 'analytics'
  | 'plus'
  | 'download'
  | 'info'
  | 'lock'
  | 'document'
  | 'eye'
  | 'directions'
  | 'refresh';

const ICONS: Record<IconName, ReactNode> = {
  bell: (
    <>
      <path d="M12 3.5a5 5 0 0 0-5 5v3a3 3 0 0 1-.8 2L5 15h14l-1.2-1.5a3 3 0 0 1-.8-2v-3a5 5 0 0 0-5-5Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </>
  ),
  gps: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5" />
    </>
  ),
  home: (
    <>
      <path d="M4 11.2 12 4l8 7.2" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-4.5h4V19" />
    </>
  ),
  'medical-profile': (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M9 3.5h6v3H9z" />
      <path d="M12 10.5v5M9.5 13h5" />
    </>
  ),
  history: (
    <>
      <path d="M3.6 12a8.4 8.4 0 1 0 2.5-6" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4.4l3 1.8" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 2.2v2.4M12 19.4v2.4M2.2 12h2.4M19.4 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ),
  contacts: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16.2a3 3 0 0 1 6 0M15 10h4M15 13.5h4" />
    </>
  ),
  aed: <path d="M3 12h3l2-4.5L11 16l2.4-5 1.6 3H21" />,
  map: (
    <>
      <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" />
      <path d="M9 4v13M15 6.5v13" />
    </>
  ),
  press: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8.5v5.5M9.5 11.5 12 14l2.5-2.5" />
    </>
  ),
  'chevron-right': <path d="m9.5 5 7 7-7 7" />,
  'arrow-back': <path d="M19 12H5M11 6l-6 6 6 6" />,
  'arrow-forward': <path d="M5 12h14M13 6l6 6-6 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  call: (
    <path d="M4 5.5A2 2 0 0 1 6 3.5h2l2 5-2.4 1.6a12.5 12.5 0 0 0 6.3 6.3L15.5 14l5 2v2a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4 5.5Z" />
  ),
  group: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17.2" cy="8.8" r="2.2" />
      <path d="M16.5 14c2.4 0 4 1.8 4 4.2" />
    </>
  ),
  'voice-off': (
    <>
      <path d="M9.6 6.4a2.4 2.4 0 0 1 4.8.1v3.2" />
      <path d="M14.4 12.6a2.4 2.4 0 0 1-4.8-.1v-1" />
      <path d="M6.2 11.2a5.8 5.8 0 0 0 8.4 5.1M17.8 11.2a5.8 5.8 0 0 1-.5 2.4" />
      <path d="M12 18v3" />
      <path d="m4 4 16 16" />
    </>
  ),
  cancel: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  check: <path d="m5 12.6 4.6 4.6L19 7.4" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m8 12.3 2.8 2.8L16.2 9.7" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4 2.6 20h18.8L12 4Z" />
      <path d="M12 10v4.4" />
      <path d="M12 17.2h.01" />
    </>
  ),
  dangerous: (
    <>
      <path d="M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2L8.2 3Z" />
      <path d="m9.5 9.5 5 5M14.5 9.5l-5 5" />
    </>
  ),
  medication: (
    <>
      <rect x="6" y="8" width="12" height="12" rx="2.5" />
      <path d="M8 4.5h8v3.5H8z" />
      <path d="M12 11.5v5M9.5 14h5" />
    </>
  ),
  hospital: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  ambulance: (
    <>
      <path d="M3 7.5h11v8H3z" />
      <path d="M14 10.5h3.4l2.6 3v2H14z" />
      <circle cx="7" cy="17.2" r="1.8" />
      <circle cx="17" cy="17.2" r="1.8" />
      <path d="M8.5 11.2h3M10 9.7v3" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.2" r="7.4" />
      <path d="M12 9.6v3.6l2.5 1.5" />
      <path d="M9.5 2.6h5" />
    </>
  ),
  'signal-weak': (
    <>
      <path d="M4 20v-3M9 20v-6" />
      <path d="M14 20v-9" opacity="0.3" />
      <path d="M19 20v-12" opacity="0.3" />
      <path d="M20.5 4.5v4M20.5 11h.01" />
    </>
  ),
  'signal-off': (
    <>
      <path d="M4 20v-3M9 20v-6" opacity="0.3" />
      <path d="M14 20v-9M19 20v-12" opacity="0.3" />
      <path d="m3.5 3.5 17 17" />
    </>
  ),
  spinner: <path d="M12 3.5a8.5 8.5 0 0 1 8.5 8.5" />,
  pin: (
    <>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  campaign: (
    <>
      <path d="M4 9.5v5h3l6 3.5v-12L7 9.5H4Z" />
      <path d="M16.8 9.6a3.4 3.4 0 0 1 0 4.8" />
    </>
  ),
  'shield-health': (
    <>
      <path d="m12 3 7 2.8v5.4c0 4.4-2.9 7.9-7 9.3-4.1-1.4-7-4.9-7-9.3V5.8L12 3Z" />
      <path d="M12 9v5M9.5 11.5h5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path d="m16 16 4.6 4.6" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6.4 7-6.4s7 2.5 7 6.4" />
    </>
  ),
  analytics: (
    <>
      <path d="M4 4v16h16" />
      <path d="M8 16.5V12M12 16.5V7.5M16 16.5v-6" />
    </>
  ),
  plus: <path d="M12 6v12M6 12h12" />,
  download: <path d="M12 4v10M8 11l4 4 4-4M5 19h14" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11.2v5.4M12 7.8h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8.5 11V8.2a3.5 3.5 0 0 1 7 0V11" />
    </>
  ),
  document: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9 12.5h6M9 16h4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.6 12S6.2 5.8 12 5.8 21.4 12 21.4 12 17.8 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  directions: (
    <>
      <path d="M12 2.6 21.4 12 12 21.4 2.6 12 12 2.6Z" />
      <path d="M10 14.5v-2.6a1.4 1.4 0 0 1 1.4-1.4H14" />
      <path d="m12.4 8.7 2 1.8-2 1.8" />
    </>
  ),
  refresh: (
    <>
      <path d="M4.6 12a7.4 7.4 0 0 1 12.6-5.2" />
      <path d="M19.4 12a7.4 7.4 0 0 1-12.6 5.2" />
      <path d="M17.4 3.6v3.6h-3.6M6.6 20.4v-3.6h3.6" />
    </>
  ),
};

export interface IconProps {
  name: IconName;
  className?: string;
  /** Pixel size. Defaults to 20; use >= 24 for primary emergency actions. */
  size?: number;
  /**
   * Icons are decorative by default and hidden from assistive technology,
   * because every one of them sits beside a text label. Pass a title only when
   * an icon genuinely carries meaning on its own.
   */
  title?: string;
}

export function Icon({ name, className, size = 20, title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name]}
    </svg>
  );
}
