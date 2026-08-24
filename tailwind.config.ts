import type { Config } from 'tailwindcss';

/**
 * The single canonical MedLink design system.
 *
 * Every Stitch screen shipped its own copy of an identical ~50-token Material 3
 * palette inline via the Tailwind CDN. Those palettes are collapsed here into
 * one source of truth; screens never declare colours of their own.
 *
 * Values are taken from the Stitch export where they were consistent, with
 * three deliberate corrections:
 *   1. Brand primary is #00478D (Stitch called that "primary-container" and
 *      used #003164 for "primary" - the brief pins #00478D).
 *   2. A caution/amber ramp is added. The export had no amber at all, so weak
 *      connectivity was drawn in emergency red - which reads as failure.
 *   3. Success green is reserved for confirmed/available/completed/verified,
 *      so it is no longer used for navigation "active" states.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Brand blue - the calm, everyday MedLink surface colour. */
        brand: {
          DEFAULT: '#00478D',
          deep: '#003164',
          600: '#005EB8',
          500: '#295EA5',
          300: '#8DB8FF',
          200: '#A9C7FF',
          100: '#D6E3FF',
          50: '#F2F6FF',
          on: '#FFFFFF',
          'on-container': '#001B3D',
        },
        /* Emergency red - SOS, critical emergency states, serious warnings,
         * allergy alerts. Never a page's dominant colour. */
        emergency: {
          DEFAULT: '#BA1A1A',
          deep: '#93000A',
          700: '#950111',
          container: '#FFDAD6',
          'container-dim': '#FFB3AC',
          on: '#FFFFFF',
          'on-container': '#410003',
        },
        /* Success green - confirmed, available, completed, verified. */
        success: {
          DEFAULT: '#1B6D24',
          deep: '#005312',
          600: '#207128',
          container: '#A3F69C',
          'container-dim': '#87D982',
          on: '#FFFFFF',
          'on-container': '#002204',
        },
        /*
         * Caution amber - weak connectivity, awaiting confirmation, pending
         * states, warnings.
         *
         * `DEFAULT` (#8A5A00) is the only amber permitted for text or icons:
         * 5.9:1 on white and 4.7:1 on `container`, so it clears WCAG AA in both
         * places it is used. `accent` is decorative only and must always sit
         * beside a text label.
         */
        caution: {
          DEFAULT: '#8A5A00',
          deep: '#663F00',
          accent: '#E9A319',
          container: '#FFDEA6',
          'container-dim': '#F7C97A',
          on: '#FFFFFF',
          'on-container': '#2A1800',
        },
        /* Calm neutral surface system, straight from the export. */
        surface: {
          app: '#F9F9FF',
          DEFAULT: '#FFFFFF',
          low: '#F2F3FB',
          container: '#EDEDF4',
          high: '#E7E8EE',
          highest: '#E2E2E9',
          dim: '#D9D9E0',
          inverse: '#2E3035',
        },
        ink: {
          DEFAULT: '#191C20',
          muted: '#424751',
          subtle: '#737782',
          inverse: '#F0F0F7',
        },
        line: {
          DEFAULT: '#E2E2E9',
          strong: '#C2C6D2',
          outline: '#737782',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      /* Tailwind's scale is already the 4px system; `touch` names the 48px
       * minimum interaction target the brief requires for patient controls. */
      spacing: {
        touch: '48px',
      },
      minWidth: { touch: '48px' },
      minHeight: { touch: '48px' },
      borderRadius: {
        control: '8px',
        card: '16px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(25, 28, 32, 0.06), 0 1px 3px rgba(25, 28, 32, 0.08)',
        raised: '0 8px 24px rgba(25, 28, 32, 0.12)',
        sos: '0 12px 32px rgba(186, 26, 26, 0.32)',
      },
      keyframes: {
        /* Lifted from the export's own SOS ripple, retimed to be calmer. */
        'sos-ripple': {
          '0%': { transform: 'scale(1)', opacity: '0.45' },
          '70%': { transform: 'scale(1.35)', opacity: '0' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        'transmit-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.12)', opacity: '0.18' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'sos-ripple': 'sos-ripple 2.2s ease-out infinite',
        'transmit-pulse': 'transmit-pulse 2s ease-in-out infinite',
        'spin-slow': 'spin 1.1s linear infinite',
        'fade-in': 'fade-in 180ms ease-out',
        'slide-up': 'slide-up 220ms cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
