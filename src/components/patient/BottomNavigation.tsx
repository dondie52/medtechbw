'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/components/ui';

interface NavItem {
  href: string;
  /** Short enough to fit four across at 360px. */
  label: string;
  /** Full name for assistive technology, per the brief's navigation list. */
  accessibleLabel: string;
  icon: IconName;
}

/**
 * Patient navigation. Four destinations, nothing else.
 *
 * There is deliberately no dispatcher, fleet or facility entry here: the
 * patient app must never expose operator navigation.
 */
const ITEMS: NavItem[] = [
  { href: '/patient', label: 'Home', accessibleLabel: 'Home', icon: 'home' },
  {
    href: '/patient/medical-profile',
    label: 'Profile',
    accessibleLabel: 'Medical profile',
    icon: 'medical-profile',
  },
  { href: '/patient/activity', label: 'Activity', accessibleLabel: 'Activity', icon: 'history' },
  { href: '/patient/settings', label: 'Settings', accessibleLabel: 'Settings', icon: 'settings' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Patient sections"
      className="sticky bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur pb-safe"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {ITEMS.map((item) => {
          const active = item.href === '/patient' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.accessibleLabel}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-touch flex-col items-center justify-center gap-1 px-1 pt-2 pb-1.5 text-[11px] font-semibold',
                  active ? 'text-brand' : 'text-ink-subtle hover:text-ink-muted',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-14 items-center justify-center rounded-pill transition-colors',
                    active && 'bg-brand-100',
                  )}
                >
                  <Icon name={item.icon} size={22} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
