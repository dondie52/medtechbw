import Link from 'next/link';
import { Icon, type IconName } from '@/components/ui';

interface QuickAction {
  href: string;
  title: string;
  detail: string;
  icon: IconName;
}

/**
 * Four supporting destinations.
 *
 * These use brand-tinted chips rather than the export's mix of green, red and
 * blue: green and red carry meaning elsewhere in MedLink (available/confirmed
 * and emergency), and spending them on navigation decoration would weaken both.
 */
export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <li key={action.href}>
          <Link
            href={action.href}
            className="flex h-full min-h-[124px] flex-col gap-2 rounded-card border border-line bg-surface p-4 shadow-card transition-colors hover:bg-surface-low"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-brand">
              <Icon name={action.icon} size={22} />
            </span>
            <span className="mt-auto">
              <span className="line-clamp-2 text-[15px] font-bold leading-tight text-ink">
                {action.title}
              </span>
              <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-ink-muted">
                {action.detail}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type { QuickAction };
