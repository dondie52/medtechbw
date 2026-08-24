import { forwardRef, type ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'emergency' | 'secondary' | 'quiet' | 'destructive-text' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-deep active:bg-brand-deep',
  emergency: 'bg-emergency text-white hover:bg-emergency-deep active:bg-emergency-deep',
  secondary:
    'bg-surface-container text-ink hover:bg-surface-high active:bg-surface-highest border border-line',
  quiet: 'bg-transparent text-brand hover:bg-brand-50 active:bg-brand-100',
  /* Destructive actions are never the visually dominant control on a screen. */
  'destructive-text': 'bg-transparent text-emergency hover:bg-emergency-container/60',
  inverse: 'bg-white/10 text-white hover:bg-white/20 border border-white/25',
};

const SIZES: Record<Size, string> = {
  sm: 'min-h-[40px] px-3 text-sm gap-1.5',
  /* 48px is the minimum interaction target for anything a patient must hit. */
  md: 'min-h-touch px-4 text-[15px] gap-2',
  lg: 'min-h-[56px] px-6 text-base gap-2.5',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconAfter?: IconName;
  fullWidth?: boolean;
}

const baseClass =
  'inline-flex items-center justify-center rounded-control font-semibold transition-colors ' +
  'disabled:opacity-45 disabled:pointer-events-none select-none';

/**
 * Shared class builder. Exported so `tel:` and `mailto:` actions can be real
 * anchors that look like buttons, instead of buttons that fake navigation.
 */
export function buttonClasses(options: {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  const { variant = 'primary', size = 'md', fullWidth, className } = options;
  return cn(baseClass, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconAfter, fullWidth, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(baseClass, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {icon ? <Icon name={icon} size={size === 'lg' ? 22 : 20} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={size === 'lg' ? 22 : 20} /> : null}
    </button>
  );
});

export interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconAfter?: IconName;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  fullWidth,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(baseClass, VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className)}
    >
      {icon ? <Icon name={icon} size={size === 'lg' ? 22 : 20} /> : null}
      {children}
      {iconAfter ? <Icon name={iconAfter} size={size === 'lg' ? 22 : 20} /> : null}
    </Link>
  );
}
