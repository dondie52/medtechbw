import { cn } from '@/lib/cn';
import { DATA_SOURCE_LABEL, type ChronicCondition, type Emergency } from '@/types';
import { Card, CardHeading, Icon, StatusPill } from '@/components/ui';

/**
 * The product's most important safety component.
 *
 * "Epilepsy" is a known condition. It is not a report that the patient is
 * having a seizure. The V1 dispatcher console conflated the two and printed
 * "Reported Condition: Seizure / Epilepsy" beside a P1 priority; this panel
 * exists so that cannot happen again. The two columns are always rendered
 * together, and the right-hand one says "Not provided" until a person actually
 * provides something.
 */
export function KnownVsCurrentPanel({
  conditions,
  emergency,
  /** Two columns from `sm` up by default; pass `1` where the panel sits in a
   * narrow sidebar rather than the full page width. */
  columns = 2,
  className,
}: {
  conditions: ChronicCondition[];
  emergency: Emergency;
  columns?: 1 | 2;
  className?: string;
}) {
  const primary = conditions.find((condition) => condition.severity === 'primary');
  const secondary = conditions.filter((condition) => condition.severity !== 'primary');
  const symptoms = emergency.symptomsReported;

  return (
    <div className={cn('grid gap-3', columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1', className)}>
      <Card tone="brand" className="p-4">
        <CardHeading tone="brand" icon="medical-profile" eyebrow>
          Known medical profile
        </CardHeading>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {primary ? (
            <StatusPill tone="brand">{primary.name}</StatusPill>
          ) : (
            <span className="text-sm text-ink-subtle">No conditions recorded</span>
          )}
          {secondary.map((condition) => (
            <StatusPill key={condition.id} tone="neutral">
              {condition.name}
            </StatusPill>
          ))}
        </div>
        <p className="mt-2.5 text-xs text-ink-muted">
          {DATA_SOURCE_LABEL.patient_profile}. Recorded before this emergency.
        </p>
      </Card>

      <Card tone={symptoms ? 'caution' : 'default'} accent={Boolean(symptoms)} className="p-4">
        <CardHeading tone={symptoms ? 'caution' : 'default'} icon="campaign" eyebrow>
          Current SOS
        </CardHeading>
        <dl className="mt-2.5">
          <dt className="text-xs font-medium uppercase tracking-[0.06em] text-ink-subtle">
            Symptoms
          </dt>
          <dd className="mt-1 text-[15px]">
            {symptoms ? (
              <span className="font-medium text-ink">&ldquo;{symptoms.value}&rdquo;</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-medium text-ink-subtle">
                <Icon name="info" size={15} />
                Not provided
              </span>
            )}
          </dd>
        </dl>
        <p className="mt-2.5 text-xs text-ink-muted">
          {symptoms
            ? `${DATA_SOURCE_LABEL[symptoms.source]}.`
            : 'The patient pressed SOS. Nobody has described what is happening yet.'}
        </p>
      </Card>
    </div>
  );
}
