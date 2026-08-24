import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './Icon';

type CardTone = 'default' | 'emergency' | 'caution' | 'success' | 'brand';

const TONES: Record<CardTone, string> = {
  default: 'bg-surface border-line',
  emergency: 'bg-emergency-container/55 border-emergency/35',
  caution: 'bg-caution-container/55 border-caution/35',
  success: 'bg-success-container/45 border-success/35',
  brand: 'bg-brand-50 border-brand-100',
};

export interface CardProps {
  children: ReactNode;
  tone?: CardTone;
  className?: string;
  /** Renders a coloured rule down the left edge, as in the Stitch profile. */
  accent?: boolean;
  as?: 'div' | 'section' | 'article' | 'li';
  /** Set when the card is an in-page anchor target. */
  id?: string;
}

export function Card({ children, tone = 'default', className, accent, as = 'div', id }: CardProps) {
  const Tag = as;
  const accentClass =
    accent &&
    {
      default: 'border-l-4 border-l-line-strong',
      emergency: 'border-l-4 border-l-emergency',
      caution: 'border-l-4 border-l-caution',
      success: 'border-l-4 border-l-success',
      brand: 'border-l-4 border-l-brand',
    }[tone];

  return (
    <Tag id={id} className={cn('rounded-card border shadow-card', TONES[tone], accentClass, className)}>
      {children}
    </Tag>
  );
}

export interface CardHeadingProps {
  children: ReactNode;
  icon?: IconName;
  tone?: 'default' | 'emergency' | 'caution' | 'success' | 'brand';
  /** Small uppercase eyebrow, matching the export's section labels. */
  eyebrow?: boolean;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}

const HEADING_TONES = {
  default: 'text-ink',
  emergency: 'text-emergency',
  caution: 'text-caution',
  success: 'text-success',
  brand: 'text-brand',
} as const;

export function CardHeading({
  children,
  icon,
  tone = 'brand',
  eyebrow,
  className,
  as = 'h3',
}: CardHeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'flex items-center gap-2 font-semibold',
        eyebrow ? 'text-xs uppercase tracking-[0.08em]' : 'text-[15px]',
        HEADING_TONES[tone],
        className,
      )}
    >
      {icon ? <Icon name={icon} size={eyebrow ? 16 : 18} /> : null}
      {children}
    </Tag>
  );
}

/** Label/value row used throughout the profile and case panels. */
export function InfoRow({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('py-2', className)}>
      <dt className="text-xs font-medium uppercase tracking-[0.06em] text-ink-subtle">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-medium text-ink">{value}</dd>
      {hint ? <p className="mt-0.5 text-xs text-ink-subtle">{hint}</p> : null}
    </div>
  );
}
