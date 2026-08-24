'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DEMO_PATIENT_PROFILE, DEMO_PLACES } from '@/data';
import { greetingForHour } from '@/lib/format';
import { useEmergency } from '@/features/emergency';
import type { EmergencyState } from '@/types';
import { ConnectivityBanner } from '@/components/emergency';
import { DemoNotice } from '@/components/ui';
import { SOSButton } from '@/components/patient/SOSButton';
import { PatientLocationCard } from '@/components/patient/PatientLocationCard';
import { QuickActions, type QuickAction } from '@/components/patient/QuickActions';

const TRANSMITTING_STATES = new Set<EmergencyState>([
  'sending',
  'alert_received',
  'awaiting_dispatch',
]);

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: '/patient/medical-profile',
    title: 'My medical profile',
    detail: 'Allergies, conditions and medication',
    icon: 'medical-profile',
  },
  {
    href: '/patient/medical-profile#emergency-contacts',
    title: 'Emergency contacts',
    detail: `${DEMO_PATIENT_PROFILE.emergencyContacts.length} saved contacts`,
    icon: 'contacts',
  },
  { href: '/patient/location', title: 'My location', detail: 'Check what responders would see', icon: 'map' },
  { href: '/patient/aeds', title: 'Nearby AEDs', detail: 'Defibrillators close to you', icon: 'aed' },
];

export default function PatientHomePage() {
  const router = useRouter();
  const { session, actions } = useEmergency();
  const [greeting, setGreeting] = useState('Good afternoon');

  /* Resolved after hydration: the server has no idea what time it is for the
   * patient, and a mismatched greeting would be a hydration error. */
  useEffect(() => setGreeting(greetingForHour(new Date().getHours())), []);

  /*
   * An alert still in transmission takes over the screen - that is the moment
   * the patient most needs to see what is happening. Once dispatch has
   * confirmed, the persistent banner in PatientShell is enough, so the rest of
   * the app stays navigable instead of bouncing the patient back here.
   */
  useEffect(() => {
    if (TRANSMITTING_STATES.has(session.state)) {
      router.replace('/patient/emergency/transmitting');
    }
  }, [session.state, router]);

  const firstName = DEMO_PATIENT_PROFILE.patient.fullName.split(' ')[0];

  return (
    <div id="main" className="space-y-5">
      <ConnectivityBanner />

      <h1 className="text-[28px] font-bold leading-tight text-ink">
        {greeting}, {firstName}
      </h1>

      <PatientLocationCard location={DEMO_PLACES.block8} onUpdate={() => router.push('/patient/location')} />

      <section aria-labelledby="sos-heading" className="flex flex-col items-center py-6">
        <h2 id="sos-heading" className="sr-only">
          Get emergency help
        </h2>
        <SOSButton
          onHoldStart={actions.startSosHold}
          onHoldCancel={actions.cancelSosHold}
          onTrigger={() => {
            actions.triggerSos();
            router.push('/patient/emergency/transmitting');
          }}
        />
        <p
          id="sos-instruction"
          className="mt-7 rounded-pill bg-surface-container px-4 py-2.5 text-[15px] font-semibold text-ink-muted"
        >
          Press and hold for 2 seconds
        </p>
      </section>

      <section aria-labelledby="quick-actions-heading" className="space-y-3">
        <h2 id="quick-actions-heading" className="sr-only">
          Quick actions
        </h2>
        <QuickActions actions={QUICK_ACTIONS} />
      </section>

      <DemoNotice className="pt-2" />
    </div>
  );
}
