'use client';

import { useState } from 'react';
import { DEMO_PATIENT_PROFILE, findFacility } from '@/data';
import { formatPhone, maskOmang, telHref } from '@/lib/format';
import { GENDER_LABEL } from '@/types';
import { Avatar, Button, Card, CardHeading, DemoNotice, Icon, InfoRow, StatusPill } from '@/components/ui';
import { AllergyAlertCard } from '@/components/emergency';

/**
 * The patient's own record: everything they maintain, in full.
 *
 * This is not what a responder sees. The condensed responder view is derived by
 * `toEmergencyMedicalSummary`, and the note at the foot of this page tells the
 * patient exactly which parts of this record leave their phone.
 */
export default function MedicalProfilePage() {
  const [omangVisible, setOmangVisible] = useState(false);
  const profile = DEMO_PATIENT_PROFILE;
  const { patient } = profile;
  const facility = findFacility(profile.preferredFacilityId ?? null);

  return (
    <div id="main" className="space-y-4 py-1">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Medical profile</h1>
        <Button variant="primary" size="sm" icon="document" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <Card className="p-5">
        <div className="flex flex-col items-center text-center">
          <Avatar initials={patient.photoInitials} name={patient.fullName} size={84} />
          <h2 className="mt-3 text-xl font-bold text-ink">{patient.fullName}</h2>
          <p className="text-sm text-ink-muted">
            Born {new Date(patient.dateOfBirth).toLocaleDateString('en-GB')} &middot; {patient.age} yrs
          </p>
        </div>

        <dl className="mt-4 grid gap-x-6 border-t border-line pt-2 sm:grid-cols-2">
          <InfoRow label="Gender" value={GENDER_LABEL[patient.gender]} />
          <InfoRow
            label="Phone"
            value={
              <a href={telHref(patient.phone)} className="text-brand underline underline-offset-2">
                {formatPhone(patient.phone)}
              </a>
            }
          />
          <InfoRow label="Home town or village" value={patient.homeTownOrVillage} />
          <InfoRow label="District" value={patient.district} />
          <InfoRow
            label="Home address"
            value={[patient.homeLocation.plot, patient.homeLocation.road, patient.homeLocation.ward]
              .filter(Boolean)
              .join(', ')}
            hint={patient.homeLocation.landmark ? `Near ${patient.homeLocation.landmark}` : undefined}
            className="sm:col-span-2"
          />
          {patient.omangNumber ? (
            <InfoRow
              label="Omang (national ID)"
              value={
                <span className="flex items-center gap-2">
                  <span className="font-mono">
                    {omangVisible ? patient.omangNumber : maskOmang(patient.omangNumber)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOmangVisible((visible) => !visible)}
                    className="inline-flex min-h-touch items-center gap-1 rounded-control px-2.5 text-xs font-semibold text-brand hover:bg-brand-50"
                  >
                    <Icon name="eye" size={14} />
                    {omangVisible ? 'Hide' : 'Show'}
                  </button>
                </span>
              }
              hint="Never shared with responders."
              className="sm:col-span-2"
            />
          ) : null}
          {profile.bloodGroup ? <InfoRow label="Blood group" value={profile.bloodGroup} /> : null}
        </dl>
      </Card>

      <Card accent tone="brand" className="p-4">
        <CardHeading tone="brand" icon="aed">
          Chronic conditions
        </CardHeading>
        <ul className="mt-2.5 space-y-2">
          {profile.chronicConditions.map((condition) => (
            <li key={condition.id}>
              <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                {condition.name}
                <StatusPill tone={condition.severity === 'primary' ? 'brand' : 'neutral'} size="sm">
                  {condition.severity === 'primary' ? 'Primary' : 'Secondary'}
                </StatusPill>
              </p>
              {condition.note ? <p className="text-sm text-ink-muted">{condition.note}</p> : null}
            </li>
          ))}
        </ul>
      </Card>

      <AllergyAlertCard allergies={profile.allergies} />

      <Card className="p-4">
        <CardHeading icon="medication">Current medications</CardHeading>
        <div className="mt-2.5 overflow-x-auto">
          <table className="w-full min-w-[18rem] text-left text-[15px]">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-[0.06em] text-ink-subtle">
                <th scope="col" className="pb-1.5 font-semibold">
                  Medication
                </th>
                <th scope="col" className="pb-1.5 font-semibold">
                  Dose
                </th>
                <th scope="col" className="pb-1.5 font-semibold">
                  Frequency
                </th>
              </tr>
            </thead>
            <tbody>
              {profile.medications.map((medication) => (
                <tr key={medication.id} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pr-3 font-semibold text-ink">
                    {medication.name}
                  </th>
                  <td className="py-2 pr-3 text-ink-muted">{medication.dose}</td>
                  <td className="py-2 text-ink-muted">{medication.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <CardHeading icon="history">Relevant medical history</CardHeading>
        <ul className="mt-2.5 space-y-1.5">
          {profile.history.map((entry) => (
            <li key={entry.id} className="flex items-baseline justify-between gap-3 text-[15px]">
              <span className="text-ink">
                {entry.summary}
                {entry.year ? <span className="text-ink-muted"> ({entry.year})</span> : null}
              </span>
              {entry.emergencyRelevant ? (
                <StatusPill tone="caution" size="sm">
                  Shared in emergencies
                </StatusPill>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>

      <Card id="emergency-contacts" className="p-4">
        <CardHeading icon="contacts">Emergency contacts</CardHeading>
        <ul className="mt-2.5 divide-y divide-line">
          {profile.emergencyContacts.map((contact) => (
            <li key={contact.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink">
                  {contact.fullName}
                  {contact.isPrimary ? (
                    <StatusPill tone="success" size="sm">
                      Primary
                    </StatusPill>
                  ) : null}
                </p>
                <p className="text-sm text-ink-muted">{contact.relationship}</p>
              </div>
              <a
                href={telHref(contact.phone)}
                className="flex min-h-touch shrink-0 items-center gap-1.5 rounded-pill bg-brand-100 px-3 text-sm font-semibold text-brand"
              >
                <Icon name="call" size={16} />
                {formatPhone(contact.phone)}
              </a>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {profile.medicalAid ? (
          <Card className="p-4">
            <CardHeading icon="shield-health">Medical aid</CardHeading>
            <p className="mt-2 text-[15px] font-semibold text-ink">{profile.medicalAid.scheme}</p>
            <p className="text-sm text-ink-muted">
              {profile.medicalAid.plan ? `${profile.medicalAid.plan} · ` : ''}#
              {profile.medicalAid.membershipNumber}
            </p>
          </Card>
        ) : null}

        {facility ? (
          <Card className="p-4">
            <CardHeading icon="hospital">Preferred facility</CardHeading>
            <p className="mt-2 text-[15px] font-semibold text-ink">{facility.name}</p>
            <StatusPill tone="muted" size="sm" className="mt-1.5">
              Demo participating facility
            </StatusPill>
          </Card>
        ) : null}
      </div>

      {profile.emergencyNotes ? (
        <Card className="p-4">
          <CardHeading icon="document">Emergency notes</CardHeading>
          <p className="mt-2 text-[15px] leading-relaxed text-ink">{profile.emergencyNotes}</p>
        </Card>
      ) : null}

      <Card tone="brand" className="p-4">
        <CardHeading tone="brand" icon="lock" eyebrow>
          What responders can see
        </CardHeading>
        <p className="mt-2 text-sm leading-relaxed text-brand-on-container">
          During an emergency, an authorised responder receives a condensed summary: your name, age,
          known conditions, major allergies, current medication, emergency-relevant history, blood
          group, emergency contact, medical aid and preferred facility. Your Omang number, home
          address and non-relevant history are not included, and every access is logged.
        </p>
      </Card>

      <DemoNotice className="pt-2" />
    </div>
  );
}
