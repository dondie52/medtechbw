import Link from 'next/link';
import { MedLinkLogo } from '@/components/brand/MedLinkLogo';
import { APP_ROLE_LABEL, ROLE_DATA_PERMISSIONS, type AppRole } from '@/types';
import { Card, CardHeading, DemoNotice, Icon, StatusPill } from '@/components/ui';

const BUILT_ROLES: Array<{ role: AppRole; href: string; blurb: string }> = [
  {
    role: 'patient',
    href: '/patient',
    blurb: 'Hold SOS, watch the alert transmit, and follow the response as it happens.',
  },
  {
    role: 'dispatcher',
    href: '/dispatch',
    blurb: 'Accept the emergency, choose a unit, select a facility and drive the response.',
  },
];

const PREPARED_ROLES: Array<{ role: AppRole; href: string }> = [
  { role: 'ambulance_crew', href: '/crew' },
  { role: 'receiving_facility', href: '/facility' },
  { role: 'verified_responder', href: '/responder' },
  { role: 'administrator', href: '/admin' },
];

export default function HomePage() {
  return (
    <div id="main" className="mx-auto max-w-3xl px-5 py-10">
      <MedLinkLogo size={44} layout="stacked" />

      <h1 className="mt-7 text-3xl font-bold leading-tight text-ink sm:text-4xl">
        One press. Critical information. Faster response.
      </h1>
      <p className="mt-3 text-[17px] leading-relaxed text-ink-muted">
        MedLink helps people in Botswana request emergency medical assistance while securely giving
        authorised responders their location and the medical information that changes how they are
        treated.
      </p>

      <Card tone="caution" className="mt-6 flex items-start gap-3 p-4">
        <Icon name="warning" size={20} className="mt-0.5 text-caution" />
        <div>
          <p className="text-sm font-bold text-caution-on-container">
            This is a working prototype, not an emergency service.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-caution-on-container">
            Nothing here contacts a real ambulance, hospital or emergency number. In a real emergency,
            call your local emergency services directly.
          </p>
        </div>
      </Card>

      <section aria-labelledby="roles-heading" className="mt-8">
        <h2 id="roles-heading" className="text-sm font-bold uppercase tracking-[0.08em] text-ink-subtle">
          Open the demo
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Open both in separate tabs - they share one live emergency.
        </p>

        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {BUILT_ROLES.map((entry) => (
            <li key={entry.role}>
              <Link
                href={entry.href}
                className="flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-card transition-colors hover:bg-surface-low"
              >
                <span className="flex items-center gap-2 text-lg font-bold text-brand">
                  <Icon name={entry.role === 'patient' ? 'home' : 'campaign'} size={20} />
                  {APP_ROLE_LABEL[entry.role]}
                </span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink-muted">{entry.blurb}</span>
                <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand">
                  Open
                  <Icon name="arrow-forward" size={16} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="prepared-heading" className="mt-8">
        <h2
          id="prepared-heading"
          className="text-sm font-bold uppercase tracking-[0.08em] text-ink-subtle"
        >
          Roles with route architecture prepared
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PREPARED_ROLES.map((entry) => (
            <li key={entry.role}>
              <Link
                href={entry.href}
                className="flex min-h-touch items-center justify-between gap-3 rounded-control border border-line bg-surface px-4 py-2.5 text-sm text-ink hover:bg-surface-low"
              >
                <span className="font-medium">{APP_ROLE_LABEL[entry.role]}</span>
                <StatusPill tone="muted" size="sm">
                  Not built
                </StatusPill>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Card className="mt-8 p-5">
        <CardHeading icon="lock">Least-privilege access</CardHeading>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Roles do not all see the same thing. The permission matrix is enforced in code, not by
          hiding buttons.
        </p>
        <dl className="mt-3 divide-y divide-line text-sm">
          {(Object.keys(ROLE_DATA_PERMISSIONS) as AppRole[]).map((role) => (
            <div key={role} className="flex flex-wrap items-baseline justify-between gap-2 py-2">
              <dt className="font-medium text-ink">{APP_ROLE_LABEL[role]}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {ROLE_DATA_PERMISSIONS[role].map((capability) => (
                  <StatusPill key={capability} tone="neutral" size="sm">
                    {capability.replace(/_/g, ' ')}
                  </StatusPill>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <DemoNotice className="mt-8" />
    </div>
  );
}
