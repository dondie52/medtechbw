import { cn } from '@/lib/cn';
import { formatLandmarkLine, formatLocationLine, type BotswanaLocation } from '@/types';
import { Card, Icon } from '@/components/ui';

/**
 * Where the patient is, in the terms Botswana actually uses: ward and town,
 * with a landmark underneath. Plot and road are shown only when known, because
 * a postal-style address is often not the useful part.
 */
export function PatientLocationCard({
  location,
  onUpdate,
  compact,
  className,
}: {
  location: BotswanaLocation;
  onUpdate?: () => void;
  compact?: boolean;
  className?: string;
}) {
  const landmark = formatLandmarkLine(location);

  return (
    <Card className={cn('flex items-center gap-3 p-4', className)}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand">
        <Icon name="gps" size={24} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-subtle">
          Current location
        </p>
        <p className="truncate text-[17px] font-bold text-ink">{formatLocationLine(location)}</p>
        {landmark ? <p className="truncate text-sm text-ink-muted">{landmark}</p> : null}
        {!compact && (location.plot || location.road) ? (
          <p className="mt-0.5 truncate text-xs text-ink-subtle">
            {[location.plot, location.road].filter(Boolean).join(', ')}
            {location.accuracyMetres ? ` · accurate to about ${location.accuracyMetres} m` : ''}
          </p>
        ) : null}
      </div>

      {onUpdate ? (
        <button
          type="button"
          onClick={onUpdate}
          className="min-h-touch shrink-0 rounded-control px-2 text-[15px] font-bold text-brand hover:bg-brand-50"
        >
          Update
        </button>
      ) : null}
    </Card>
  );
}
