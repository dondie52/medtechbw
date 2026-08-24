import { cn } from '@/lib/cn';
import { TRACKER_STEPS, stepStatus } from '@/features/emergency/states';
import type { EmergencyState } from '@/types';
import { Icon } from '@/components/ui';

/**
 * The eight-milestone response tracker.
 *
 * Status is carried three ways - shape, colour and a visually-hidden word - so
 * it survives colour blindness, glare and a screen reader.
 */
export function EmergencyTimeline({
  state,
  orientation = 'vertical',
  className,
}: {
  state: EmergencyState;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}) {
  if (orientation === 'horizontal') {
    return (
      <ol className={cn('flex w-full items-start gap-1 overflow-x-auto', className)}>
        {TRACKER_STEPS.map((step) => {
          const status = stepStatus(step, state);
          return (
            <li
              key={step.id}
              className="flex min-w-[76px] flex-1 flex-col items-center gap-1.5 text-center"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full border-2',
                  status === 'complete' && 'border-success bg-success text-white',
                  status === 'current' && 'border-brand bg-white text-brand',
                  status === 'upcoming' && 'border-line-strong bg-surface-low text-ink-subtle',
                )}
              >
                {status === 'complete' ? (
                  <Icon name="check" size={13} />
                ) : status === 'current' ? (
                  <span className="h-2 w-2 rounded-full bg-brand" />
                ) : null}
              </span>
              <span
                className={cn(
                  'text-[11px] leading-tight',
                  status === 'upcoming' ? 'text-ink-subtle' : 'font-semibold text-ink',
                )}
              >
                {step.label}
              </span>
              <span className="sr-only">
                {status === 'complete' ? 'Completed' : status === 'current' ? 'In progress' : 'Not yet reached'}
              </span>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className={cn('relative', className)}>
      {TRACKER_STEPS.map((step, index) => {
        const status = stepStatus(step, state);
        const isLast = index === TRACKER_STEPS.length - 1;
        return (
          <li
            key={step.id}
            className="relative flex gap-3 pb-5 last:pb-0"
            aria-current={status === 'current' ? 'step' : undefined}
          >
            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  'absolute left-[13px] top-7 h-[calc(100%-16px)] w-0.5',
                  status === 'complete' ? 'bg-success' : 'bg-line',
                )}
              />
            ) : null}

            <span
              className={cn(
                'relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-2',
                status === 'complete' && 'border-success bg-success text-white',
                status === 'current' && 'border-brand bg-white',
                status === 'upcoming' && 'border-line-strong bg-surface-low',
              )}
            >
              {status === 'complete' ? (
                <Icon name="check" size={14} />
              ) : status === 'current' ? (
                <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              ) : null}
            </span>

            <span className="pt-0.5">
              <span
                className={cn(
                  'block text-[15px] leading-6',
                  status === 'current' && 'font-bold text-brand',
                  status === 'complete' && 'font-medium text-ink',
                  status === 'upcoming' && 'text-ink-subtle',
                )}
              >
                {step.label}
              </span>
              <span className="sr-only">
                {status === 'complete'
                  ? 'Completed'
                  : status === 'current'
                    ? 'Current stage'
                    : 'Not yet reached'}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
