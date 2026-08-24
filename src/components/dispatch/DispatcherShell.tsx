'use client';

import type { ReactNode } from 'react';
import { MedLinkDispatcherLogo } from '@/components/brand/MedLinkLogo';
import { ConnectivityDot } from '@/components/emergency';
import { DEMO_DISPATCHER } from '@/data';
import { useEmergency } from '@/features/emergency';
import { isEmergencyActive } from '@/types';
import { Avatar, DemoBadge } from '@/components/ui';
import { SidebarNavigation, buildDispatchNav } from './SidebarNavigation';

/**
 * Dispatcher console frame: desktop-first, with the sidebar collapsing to a
 * scrollable strip below 1024px so the console stays usable on a laptop or
 * tablet in the field.
 */
export function DispatcherShell({ children }: { children: ReactNode }) {
  const { session } = useEmergency();
  const liveCount = isEmergencyActive(session.state) && session.emergency ? 1 : 0;

  return (
    <div className="flex min-h-dvh flex-col bg-surface-app lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-line bg-surface-low lg:h-dvh lg:w-[248px] lg:border-b-0 lg:border-r xl:w-[268px]">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-6 lg:py-6">
          <MedLinkDispatcherLogo />
          <DemoBadge className="lg:hidden" />
        </div>

        <SidebarNavigation items={buildDispatchNav(liveCount)} />

        <div className="mt-auto hidden items-center gap-3 border-t border-line px-5 py-4 lg:flex">
          <Avatar initials="D4" name={DEMO_DISPATCHER.displayName} size={38} tone="neutral" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{DEMO_DISPATCHER.displayName}</p>
            <ConnectivityDot />
          </div>
        </div>
      </aside>

      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
