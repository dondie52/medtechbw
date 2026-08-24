import { DEMO_RESPONDERS } from '@/data';
import { formatDistance } from '@/lib/format';
import { Card, DemoNotice, Icon, StatusPill } from '@/components/ui';

const KIND_LABEL = {
  first_aider: 'Trained first aider',
  clinic_nurse: 'Clinic nurse',
  fire_rescue: 'Fire and rescue',
  police: 'Police',
} as const;

export default function RespondersPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 p-4 lg:p-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Responders</h1>
        <p className="text-sm text-ink-muted">
          Verified non-ambulance responders who can reach a scene before a unit arrives.
        </p>
      </div>

      <ul className="space-y-3">
        {DEMO_RESPONDERS.map((responder) => (
          <Card as="li" key={responder.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[17px] font-bold text-ink">
                  <Icon name="group" size={19} className="text-brand" />
                  {responder.fullName}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">
                  {KIND_LABEL[responder.kind]} &middot; {responder.organisation}
                </p>
              </div>
              <StatusPill tone={responder.verified ? 'success' : 'caution'} size="sm">
                {responder.verified ? 'Verified' : 'Unverified'}
              </StatusPill>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              {formatDistance(responder.distanceKm)} from the current emergency location
            </p>
          </Card>
        ))}
      </ul>

      <DemoNotice />
    </div>
  );
}
