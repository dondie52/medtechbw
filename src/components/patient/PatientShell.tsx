'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { MedLinkLogo } from '@/components/brand/MedLinkLogo';
import { ConnectivityDot } from '@/components/emergency';
import { Icon } from '@/components/ui';
import { useEmergency } from '@/features/emergency';
import { STATE_PRESENTATION } from '@/features/emergency/states';
import { isEmergencyActive } from '@/types';
import { BottomNavigation } from './BottomNavigation';

/**
 * Patient application frame: mobile-first, single column, and free of any
 * operator navigation.
 */
export function PatientShell({ children }: { children: ReactNode }) {
  const { session } = useEmergency();
  const pathname = usePathname();

  const active = isEmergencyActive(session.state) && session.emergency !== null;
  const onEmergencyScreen = pathname.startsWith('/patient/emergency');

  return (
    <div className="flex min-h-dvh flex-col bg-surface-app">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur pt-safe">
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3 px-4 py-3">
          <Link href="/patient" className="rounded-control">
            <MedLinkLogo size={30} />
          </Link>
          <div className="flex items-center gap-3">
            <ConnectivityDot className="hidden xs:inline-flex" />
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-touch w-touch items-center justify-center rounded-pill text-ink-muted hover:bg-surface-container"
            >
              <Icon name="bell" size={22} />
              <span
                aria-hidden
                className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emergency ring-2 ring-white"
              />
            </button>
          </div>
        </div>

        {/*
          If an emergency is running, the patient must always be one tap from
          it, whatever screen they wandered onto.
        */}
        {active && !onEmergencyScreen ? (
          <Link
            href="/patient/emergency/active"
            className="on-emergency flex items-center justify-between gap-3 bg-emergency px-4 py-2.5 text-white"
          >
            <span className="flex items-center gap-2 text-sm font-bold">
              <Icon name="ambulance" size={18} />
              {STATE_PRESENTATION[session.state].patientHeadline}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
              Open
              <Icon name="chevron-right" size={16} />
            </span>
          </Link>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-8 pt-4">{children}</main>

      <BottomNavigation />
    </div>
  );
}
