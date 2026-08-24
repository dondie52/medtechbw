import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './Icon';

export type PillTone = 'neutral' | 'brand' | 'emergency' | 'caution' | 'success' | 'muted';

const TONES: Record<PillTone, string> = {
  neutral: 'bg-surface-container text-ink border-line',
  brand: 'bg-brand-100 text-brand-on-container border-brand-200',
  emergency: 'bg-emergency-container text-emergency-on-container border-emergency/30',
  caution: 'bg-caution-container text-caution-on-container border-caution/35',
  success: 'bg-success-container text-success-on-container border-success/30',
  muted: 'bg-surface-low text-ink-subtle border-line',
};

const SOLID_TONES: Record<PillTone, string> = {
  neutral: 'bg-ink text-white border-ink',
  brand: 'bg-brand text-white border-brand',
  emergency: 'bg-emergency text-white border-emergency',
  caution: 'bg-caution text-white border-caution',
  success: 'bg-success text-white border-success',
  muted: 'bg-ink-subtle text-white border-ink-subtle',
};

export interface StatusPillProps {
  children: ReactNode;
  tone?: PillTone;
  icon?: IconName;
  solid?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Fully-rounded status chip.
 *
 * Every pill carries a text label. Tone is a reinforcement, never the only
 * carrier of meaning - required for colour-blind users and for anyone reading
 * the screen in bright sunlight.
 */
export function StatusPill({
  children,
  tone = 'neutral',
  icon,
  solid,
  size = 'md',
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border font-semibold',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        solid ? SOLID_TONES[tone] : TONES[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 12 : 14} /> : null}
      {children}
    </span>
  );
}
