import { cn } from '@/lib/cn';

/**
 * MedLink Botswana identity.
 *
 * The export supplied the logo only as a flat PNG screenshot, so this is a
 * redrawn SVG that matches it: a rounded medical cross with a location pin
 * overlapping the lower half - care, place and the emergency link between them.
 * The mark is not redesigned here, only made resolution-independent and
 * theme-aware.
 *
 * When final production SVGs arrive, replace the contents of `LogoMark` and
 * nothing else in the application needs to change.
 */

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className, size = 32 }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      aria-hidden
      focusable="false"
    >
      {/* Medical cross */}
      <path
        d="M24 8h16a4 4 0 0 1 4 4v8h8a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4h-8v-8a20 20 0 0 0-40 0v8H12a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4h8v-8a4 4 0 0 1 4-4Z"
        fill="currentColor"
      />
      {/* Location pin, knocked out of the cross so the two read as one mark */}
      <path
        d="M32 20c-8.3 0-15 6.7-15 15 0 10.6 12.4 21.4 14 22.7a1.6 1.6 0 0 0 2 0C34.6 56.4 47 45.6 47 35c0-8.3-6.7-15-15-15Z"
        fill="var(--surface, #ffffff)"
      />
      <path
        d="M32 22.5c-6.9 0-12.5 5.6-12.5 12.5 0 8.9 10.4 18.6 12.5 20.5 2.1-1.9 12.5-11.6 12.5-20.5 0-6.9-5.6-12.5-12.5-12.5Z"
        fill="currentColor"
      />
      <circle cx="32" cy="34.5" r="6.5" fill="var(--surface, #ffffff)" />
    </svg>
  );
}

export interface MedLinkLogoProps {
  /** `full` shows the wordmark, `mark` is the symbol alone. */
  variant?: 'full' | 'mark';
  /** `stacked` puts "Botswana" on its own line, as in the supplied logo. */
  layout?: 'inline' | 'stacked';
  size?: number;
  className?: string;
  /** Use on dark or coloured surfaces. */
  tone?: 'brand' | 'inverse';
}

export function MedLinkLogo({
  variant = 'full',
  layout = 'inline',
  size = 32,
  className,
  tone = 'brand',
}: MedLinkLogoProps) {
  const toneClass = tone === 'inverse' ? 'text-white' : 'text-brand';

  if (variant === 'mark') {
    return (
      <span className={cn(toneClass, className)}>
        <LogoMark size={size} />
        <span className="sr-only">MedLink Botswana</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2', toneClass, className)}>
      <LogoMark size={size} />
      <span
        className={cn(
          'font-bold leading-tight tracking-tight',
          layout === 'stacked' ? 'flex flex-col' : 'flex items-baseline gap-1.5',
        )}
      >
        <span style={{ fontSize: size * 0.56 }}>MedLink</span>
        <span className="font-medium opacity-90" style={{ fontSize: size * 0.44 }}>
          Botswana
        </span>
      </span>
    </span>
  );
}

/** Dispatcher console lockup: shield mark, operator wordmark. */
export function MedLinkDispatcherLogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-brand', className)}>
      <LogoMark size={34} />
      <span className="flex flex-col text-[17px] font-bold leading-[1.15] tracking-tight">
        <span>MedLink</span>
        <span>Dispatcher</span>
      </span>
    </span>
  );
}
