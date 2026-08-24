import { cn } from '@/lib/cn';
import { Card, CardHeading, StatusPill } from '@/components/ui';
import type { Allergy, ChronicCondition, MedicalHistoryEntry } from '@/types';

/**
 * The three warning components a responder scans first.
 *
 * All of them describe what is *known* about the patient. None of them implies
 * anything about what is happening right now, and none of them suggests
 * treatment.
 */

export function AllergyAlertCard({
  allergies,
  className,
}: {
  allergies: Allergy[];
  className?: string;
}) {
  if (allergies.length === 0) return null;
  return (
    <Card tone="emergency" accent className={cn('p-4', className)}>
      <CardHeading tone="emergency" icon="dangerous" eyebrow>
        Allergy alert
      </CardHeading>
      <ul className="mt-2 space-y-2">
        {allergies.map((allergy) => (
          <li key={allergy.id} className="flex flex-wrap items-center gap-2">
            <span className="text-xl font-bold text-emergency">{allergy.substance}</span>
            <StatusPill tone="emergency" solid icon="warning" size="sm">
              {allergy.severity === 'critical' ? 'Severe' : 'Significant'}
            </StatusPill>
            {allergy.reaction ? (
              <span className="w-full text-sm text-emergency-on-container">
                Known reaction: {allergy.reaction}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function HighRiskConditionCard({
  condition,
  className,
}: {
  condition: ChronicCondition;
  className?: string;
}) {
  return (
    <Card tone="emergency" className={cn('p-4', className)}>
      <CardHeading tone="emergency" icon="medical-profile" eyebrow>
        Known high-risk condition
      </CardHeading>
      <p className="mt-1.5 text-2xl font-bold text-emergency">{condition.name}</p>
      {condition.note ? (
        <p className="mt-1 text-sm text-emergency-on-container">{condition.note}</p>
      ) : null}
      <p className="mt-2 text-xs text-ink-muted">
        Recorded in the patient&apos;s medical profile. Not a report of the current emergency.
      </p>
    </Card>
  );
}

export function ImportantHistoryCard({
  history,
  className,
}: {
  history: MedicalHistoryEntry[];
  className?: string;
}) {
  if (history.length === 0) return null;
  return (
    <Card tone="caution" className={cn('p-4', className)}>
      <CardHeading tone="caution" icon="history" eyebrow>
        Important medical history
      </CardHeading>
      <ul className="mt-2 space-y-1">
        {history.map((entry) => (
          <li key={entry.id} className="text-[15px] font-medium text-caution-on-container">
            {entry.summary}
            {entry.year ? <span className="font-normal"> ({entry.year})</span> : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
