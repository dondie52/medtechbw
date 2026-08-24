import { DEMO_AEDS } from '@/data';
import { Card, DemoNotice, Icon, StatusPill } from '@/components/ui';

export default function AedNetworkPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-ink">AED network</h1>
        <p className="text-sm text-ink-muted">
          Registered defibrillators. Verification date matters as much as location - an unverified
          unit should not be relied on.
        </p>
      </div>

      <ul className="space-y-3">
        {DEMO_AEDS.map((aed) => (
          <Card as="li" key={aed.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-start gap-2 text-[16px] font-semibold text-ink">
                <Icon name="aed" size={19} className="mt-0.5 text-success" />
                {aed.name}
              </p>
              <StatusPill tone={aed.lastVerifiedAt ? 'success' : 'caution'} size="sm">
                {aed.lastVerifiedAt
                  ? `Verified ${new Date(aed.lastVerifiedAt).toLocaleDateString('en-GB')}`
                  : 'Not verified'}
              </StatusPill>
            </div>
            <p className="mt-1.5 text-sm text-ink-muted">{aed.accessNote}</p>
          </Card>
        ))}
      </ul>

      <DemoNotice />
    </div>
  );
}
