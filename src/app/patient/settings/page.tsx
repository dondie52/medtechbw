import Link from 'next/link';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { Card, CardHeading, DemoNotice, Icon, StatusPill } from '@/components/ui';

export default function SettingsPage() {
  return (
    <div id="main" className="space-y-4 py-1">
      <h1 className="text-2xl font-bold text-ink">Settings</h1>

      <Card className="p-4">
        <CardHeading icon="person">Language</CardHeading>
        <ul className="mt-2.5 divide-y divide-line">
          {SUPPORTED_LOCALES.map((locale) => (
            <li key={locale.code} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-[15px] text-ink">{locale.nativeName}</span>
              <StatusPill tone={locale.available ? 'success' : 'muted'} size="sm">
                {locale.available ? 'Active' : 'Not yet available'}
              </StatusPill>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-xs leading-relaxed text-ink-subtle">
          Setswana translation needs a fluent speaker and clinical review before it ships. Emergency
          wording is not something to machine-translate.
        </p>
      </Card>

      <Card className="p-4">
        <CardHeading icon="lock">Privacy</CardHeading>
        <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-ink-muted">
          <li>Your medical profile stays on your device until you send an emergency alert.</li>
          <li>
            Sending an alert releases a condensed summary to the responders handling that emergency,
            and only for as long as it is open.
          </li>
          <li>
            Every time somebody opens your information it is recorded in{' '}
            <Link href="/patient/activity" className="font-semibold text-brand underline underline-offset-2">
              Activity
            </Link>
            .
          </li>
        </ul>
      </Card>

      <Card tone="caution" className="p-4">
        <CardHeading tone="caution" icon="warning">
          What this prototype cannot do
        </CardHeading>
        <ul className="mt-2.5 space-y-2 text-sm leading-relaxed text-caution-on-container">
          <li>It does not contact any real emergency service, ambulance or hospital.</li>
          <li>It is not connected to Botswana&apos;s 997 emergency number.</li>
          <li>There is no SMS backup for alerts yet.</li>
          <li>No information here is drawn from a real medical record.</li>
        </ul>
        <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-caution-on-container">
          <Icon name="info" size={16} className="mt-0.5" />
          In a real emergency, call your local emergency services directly.
        </p>
      </Card>

      <DemoNotice className="pt-2" />
    </div>
  );
}
