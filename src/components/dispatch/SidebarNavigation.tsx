'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/components/ui';

interface DispatchNavItem {
  href: string;
  label: string;
  icon: IconName;
  /** Live count badge, as in the first control-centre design. */
  count?: number;
  implemented: boolean;
}

export function buildDispatchNav(liveEmergencies: number): DispatchNavItem[] {
  return [
    {
      href: '/dispatch',
      label: 'Live emergencies',
      icon: 'campaign',
      count: liveEmergencies,
      implemented: true,
    },
    { href: '/dispatch/ambulances', label: 'Ambulances', icon: 'ambulance', implemented: true },
    { href: '/dispatch/responders', label: 'Responders', icon: 'group', implemented: true },
    { href: '/dispatch/facilities', label: 'Facilities', icon: 'hospital', implemented: true },
    { href: '/dispatch/patients', label: 'Patients', icon: 'person', implemented: false },
    { href: '/dispatch/aed-network', label: 'AED network', icon: 'aed', implemented: true },
    { href: '/dispatch/history', label: 'Emergency history', icon: 'history', implemented: false },
    { href: '/dispatch/reports', label: 'Reports', icon: 'analytics', implemented: false },
    { href: '/dispatch/settings', label: 'Settings', icon: 'settings', implemented: false },
  ];
}

export function SidebarNavigation({ items }: { items: DispatchNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dispatcher sections" className="lg:px-3">
      <ul className="flex gap-1 overflow-x-auto px-3 pb-2 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {items.map((item) => {
          const active =
            item.href === '/dispatch' ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="shrink-0 lg:shrink">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-touch items-center gap-3 rounded-pill px-4 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-brand text-white'
                    : 'text-ink-muted hover:bg-brand-50 hover:text-brand',
                )}
              >
                <Icon name={item.icon} size={20} />
                <span className="whitespace-nowrap">{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 ? (
                  <span
                    className={cn(
                      'ml-auto rounded-pill px-2 py-0.5 text-xs font-bold',
                      active ? 'bg-white/20 text-white' : 'bg-emergency text-white',
                    )}
                  >
                    {item.count}
                  </span>
                ) : null}
                {!item.implemented ? (
                  <span
                    className={cn(
                      'ml-auto shrink-0 rounded-pill px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      active ? 'bg-white/20 text-white' : 'bg-surface-container text-ink-subtle',
                    )}
                  >
                    Not built
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type { DispatchNavItem };
