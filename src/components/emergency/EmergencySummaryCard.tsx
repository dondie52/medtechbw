import { cn } from '@/lib/cn';
import { findFacility } from '@/data';
import { formatPhone, telHref } from '@/lib/format';
import {
  GENDER_LABEL,
  roleMayRead,
  type AppRole,
  type EmergencyMedicalSummary,
} from '@/types';
import { Avatar, Card, CardHeading, Icon, InfoRow, StatusPill } from '@/components/ui';
import { AllergyAlertCard, HighRiskConditionCard, ImportantHistoryCard } from './MedicalAlertCard';

/**
 * The condensed, role-authorised emergency view (not the full patient profile).
 *
 * It carries only what changes how a responder handles this patient. Omang,
 * home address and non-emergency-relevant history are filtered out upstream in
 * `toEmergencyMedicalSummary` and never reach this component.
 */
export function EmergencySummaryCard({
  summary,
  role,
  className,
  showAccessBanner = true,
}: {
  summary: EmergencyMedicalSummary;
  role: AppRole;
  className?: string;
  showAccessBanner?: boolean;
}) {
  if (!roleMayRead(role, 'emergency_summary')) {
    return (
      <Card className={cn('flex items-start gap-3 p-4', className)}>
        <Icon name="lock" size={20} className="mt-0.5 text-ink-subtle" />
        <div>
          <p className="text-sm font-semibold text-ink">Medical summary not available</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Your role does not have access to this patient&apos;s emergency medical summary.
          </p>
        </div>
      </Card>
    );
  }

  const facility = findFacility(summary.preferredFacilityId ?? null);

  return (
    <div className={cn('space-y-3', className)}>
      {showAccessBanner ? (
        <div className="flex items-center justify-center gap-2 rounded-control bg-emergency px-4 py-2.5 text-white">
          <Icon name="warning" size={16} />
          <p className="text-xs font-bold uppercase tracking-[0.08em]">
            Authorised emergency access only
          </p>
        </div>
      ) : null}

      <Card className="flex items-center gap-4 p-4">
        <Avatar initials={summary.photoInitials} name={summary.patientName} size={64} />
        <div className="min-w-0">
          <StatusPill tone="brand" size="sm">
            Known medical profile
          </StatusPill>
          <h3 className="mt-1.5 truncate text-2xl font-bold text-ink">{summary.patientName}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-muted">
            <span>{summary.age} yrs</span>
            <span aria-hidden>&middot;</span>
            <span>{GENDER_LABEL[summary.gender]}</span>
            {summary.bloodGroup ? (
              <>
                <span aria-hidden>&middot;</span>
                <span>
                  Blood group <strong className="font-semibold text-ink">{summary.bloodGroup}</strong>
                </span>
              </>
            ) : null}
          </p>
        </div>
      </Card>

      {summary.primaryCondition ? <HighRiskConditionCard condition={summary.primaryCondition} /> : null}

      {summary.secondaryConditions.length > 0 ? (
        <Card className="p-4">
          <CardHeading icon="medical-profile" eyebrow>
            Other known conditions
          </CardHeading>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {summary.secondaryConditions.map((condition) => (
              <StatusPill key={condition.id} tone="neutral">
                {condition.name}
              </StatusPill>
            ))}
          </div>
        </Card>
      ) : null}

      <AllergyAlertCard allergies={summary.majorAllergies} />

      {summary.currentMedications.length > 0 ? (
        <Card className="p-4">
          <CardHeading icon="medication" eyebrow>
            Current medications
          </CardHeading>
          <ul className="mt-2 space-y-1.5">
            {summary.currentMedications.map((medication) => (
              <li
                key={medication.id}
                className="rounded-control bg-surface-low px-3 py-2 text-[15px] text-ink"
              >
                <span className="font-semibold">{medication.name}</span> {medication.dose} &middot;{' '}
                {medication.frequency}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <ImportantHistoryCard history={summary.importantHistory} />

      <Card className="p-4">
        <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {summary.emergencyContact ? (
            <InfoRow
              label="Emergency contact"
              value={
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span>{summary.emergencyContact.fullName}</span>
                  <span className="text-sm font-normal text-ink-muted">
                    {summary.emergencyContact.relationship}
                  </span>
                  <a
                    href={telHref(summary.emergencyContact.phone)}
                    className="text-sm font-semibold text-brand underline underline-offset-2"
                  >
                    {formatPhone(summary.emergencyContact.phone)}
                  </a>
                </span>
              }
            />
          ) : null}
          {summary.medicalAid ? (
            <InfoRow
              label="Medical aid"
              value={summary.medicalAid.scheme}
              hint={`Membership ${summary.medicalAid.membershipNumber}`}
            />
          ) : null}
          {facility ? (
            <InfoRow
              label="Preferred facility"
              value={facility.name}
              hint="Patient's stated preference. Not a guarantee of admission."
            />
          ) : null}
          {summary.emergencyNotes ? (
            <InfoRow label="Emergency notes" value={summary.emergencyNotes} className="sm:col-span-2" />
          ) : null}
        </dl>
      </Card>

      <p className="px-2 text-center text-xs leading-relaxed text-ink-subtle">
        Information provided for emergency response prioritisation only. Contains no diagnostic or
        treatment recommendations.
      </p>
    </div>
  );
}
