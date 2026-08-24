'use client';

import { ACCESSED_DATA_LABEL, hasEmergencyRecord } from '@/types';
import { formatClock } from '@/lib/format';
import { useEmergency } from '@/features/emergency';
import { STATE_PRESENTATION } from '@/features/emergency/states';
import { Card, DemoNotice, Icon, StatusPill } from '@/components/ui';
import { EmergencyStatusBadge } from '@/components/emergency';

/**
 * Activity doubles as the patient's privacy record: alongside their own
 * emergencies it shows who opened their medical information and why.
 */
export default function ActivityPage() {
  const { session } = useEmergency();
  const { emergency, accessLog } = session;

  return (
    <div id="main" className="space-y-4 py-1">
      <h1 className="text-2xl font-bold text-ink">Activity</h1>

      <section aria-labelledby="emergencies-heading" className="space-y-3">
        <h2 id="emergencies-heading" className="text-sm font-bold uppercase tracking-[0.06em] text-ink-subtle">
          Your emergencies
        </h2>

        {emergency && hasEmergencyRecord(session.state) ? (
          <Card className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold text-ink">{emergency.id}</p>
                <p className="mt-0.5 text-sm text-ink-muted">
                  Started {formatClock(emergency.createdAt)} &middot; {emergency.location.ward},{' '}
                  {emergency.location.townOrVillage}
                </p>
              </div>
              <EmergencyStatusBadge state={session.state} audience="patient" size="sm" />
            </div>

            <ol className="mt-3 space-y-1.5 border-t border-line pt-3">
              {emergency.transitions.map((transition, index) => (
                <li key={`${transition.at}-${index}`} className="flex items-baseline gap-3 text-sm">
                  <span className="w-12 shrink-0 font-mono text-xs text-ink-subtle">
                    {formatClock(transition.at)}
                  </span>
                  <span className="text-ink">
                    {STATE_PRESENTATION[transition.to].dispatcherLabel}
                    <span className="text-ink-subtle"> &middot; {transition.actor.displayName}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        ) : (
          <Card className="flex items-center gap-3 p-4">
            <Icon name="info" size={20} className="text-ink-subtle" />
            <p className="text-sm text-ink-muted">You have no emergencies in this session.</p>
          </Card>
        )}
      </section>

      <section aria-labelledby="access-heading" className="space-y-3">
        <h2 id="access-heading" className="text-sm font-bold uppercase tracking-[0.06em] text-ink-subtle">
          Who opened your information
        </h2>

        {accessLog.length === 0 ? (
          <Card className="flex items-center gap-3 p-4">
            <Icon name="lock" size={20} className="text-ink-subtle" />
            <p className="text-sm text-ink-muted">
              Nobody has opened your medical information in this session.
            </p>
          </Card>
        ) : (
          <ul className="space-y-2">
            {accessLog.map((entry) => (
              <Card as="li" key={entry.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-ink">{entry.organisation}</p>
                    <p className="text-sm text-ink-muted">
                      {entry.userId} &middot; {entry.role.replace('_', ' ')}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-ink-subtle">
                    {formatClock(entry.timestamp)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.dataAccessed.map((category) => (
                    <StatusPill key={category} tone="neutral" size="sm">
                      {ACCESSED_DATA_LABEL[category]}
                    </StatusPill>
                  ))}
                </div>
                <p className="mt-2 text-xs text-ink-subtle">Reason: {entry.reason}</p>
              </Card>
            ))}
          </ul>
        )}
      </section>

      <DemoNotice className="pt-2" />
    </div>
  );
}
