import { DEMO_DATA_NOTICE, DEMO_SHORT_NOTICE } from '@/data';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

/**
 * Marks demonstration data wherever it is presented as if it were real.
 *
 * This is not decoration: a prototype that shows a hospital name, an ambulance
 * call sign and a patient's allergies has to say plainly that none of it is
 * connected to anything.
 */
export function DemoNotice({ className, short }: { className?: string; short?: boolean }) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 text-xs leading-relaxed text-ink-subtle',
        className,
      )}
    >
      <Icon name="info" size={14} className="mt-0.5" />
      <span>{short ? DEMO_SHORT_NOTICE : DEMO_DATA_NOTICE}</span>
    </p>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border border-line bg-surface-low px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-subtle',
        className,
      )}
    >
      Demo
    </span>
  );
}
