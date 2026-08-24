'use client';

import { cn } from '@/lib/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  describedBy?: string;
  disabled?: boolean;
  tone?: 'brand' | 'emergency';
  className?: string;
}

/**
 * A real ARIA switch, not a styled checkbox: keyboard operable, announced with
 * its on/off state, and at least 48px tall so it can be hit under stress.
 */
export function Switch({
  checked,
  onChange,
  label,
  describedBy,
  disabled,
  tone = 'brand',
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 items-center rounded-pill border transition-colors',
        'disabled:opacity-50',
        checked
          ? tone === 'emergency'
            ? 'border-emergency bg-emergency'
            : 'border-brand bg-brand'
          : 'border-line-strong bg-surface-highest',
        className,
      )}
    >
      <span
        className={cn(
          'ml-1 inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-6' : 'translate-x-0',
        )}
      />
    </button>
  );
}
