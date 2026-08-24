import { cn } from '@/lib/cn';

/**
 * Initials avatar.
 *
 * The Stitch screens embedded Google-hosted generated photographs of people who
 * do not exist. Those URLs are not ours, not stable, and not appropriate on a
 * medical record, so identity is drawn from initials instead. A real photo
 * field can be added later behind the same component.
 */
export function Avatar({
  initials,
  name,
  size = 56,
  tone = 'brand',
  className,
}: {
  initials: string;
  name: string;
  size?: number;
  tone?: 'brand' | 'neutral';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold ring-2',
        tone === 'brand'
          ? 'bg-brand-100 text-brand ring-brand/25'
          : 'bg-surface-container text-ink-muted ring-line',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      role="img"
      aria-label={`${name} profile picture placeholder`}
    >
      {initials}
    </span>
  );
}
