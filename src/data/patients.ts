import type { EmergencyMedicalSummary, PatientMedicalProfile } from '@/types';
import { DEMO_PLACES } from './geography';

/**
 * The demo patient. Kagiso Molefe is a fictional person.
 *
 * Note what is NOT here: nothing about a seizure, a collapse or any current
 * symptom. Epilepsy is a *known condition*. What is happening during an
 * emergency is only ever recorded on the Emergency object, by whoever actually
 * reported it.
 */
export const DEMO_PATIENT_PROFILE: PatientMedicalProfile = {
  patient: {
    id: 'pat_kagiso_molefe',
    fullName: 'Kagiso Molefe',
    dateOfBirth: '1982-05-12',
    age: 42,
    gender: 'male',
    phone: '+26771234567',
    omangNumber: '123456789',
    photoInitials: 'KM',
    homeTownOrVillage: 'Gaborone',
    district: 'South-East District',
    homeLocation: DEMO_PLACES.block8,
  },
  bloodGroup: 'O+',
  chronicConditions: [
    {
      id: 'cond_epilepsy',
      name: 'Epilepsy',
      severity: 'primary',
      note: 'Confirmed diagnosis. Managed with daily carbamazepine.',
      diagnosedYear: 2015,
    },
    {
      id: 'cond_hypertension',
      name: 'Hypertension',
      severity: 'secondary',
      note: 'Managed with daily amlodipine.',
      diagnosedYear: 2019,
    },
  ],
  allergies: [
    {
      id: 'alg_penicillin',
      substance: 'Penicillin',
      severity: 'critical',
      reaction: 'Anaphylaxis',
    },
  ],
  medications: [
    {
      id: 'med_carbamazepine',
      name: 'Carbamazepine',
      dose: '200 mg',
      frequency: 'Daily',
      emergencyRelevant: true,
    },
    {
      id: 'med_amlodipine',
      name: 'Amlodipine',
      dose: '5 mg',
      frequency: 'Daily',
      emergencyRelevant: true,
    },
  ],
  history: [
    { id: 'hist_stroke', summary: 'Stroke', year: 2019, emergencyRelevant: true },
    {
      id: 'hist_appendectomy',
      summary: 'Appendectomy',
      year: 2004,
      emergencyRelevant: false,
    },
  ],
  emergencyContacts: [
    {
      id: 'ec_naledi',
      fullName: 'Naledi Molefe',
      relationship: 'Wife',
      phone: '+26771234567',
      isPrimary: true,
    },
    {
      id: 'ec_thabo',
      fullName: 'Thabo Molefe',
      relationship: 'Brother',
      phone: '+26772987654',
      isPrimary: false,
    },
    {
      id: 'ec_lorato',
      fullName: 'Lorato Seretse',
      relationship: 'Neighbour',
      phone: '+26773456123',
      isPrimary: false,
    },
  ],
  medicalAid: {
    scheme: 'Pula Medical Aid',
    plan: 'Standard',
    membershipNumber: '987654',
  },
  preferredFacilityId: 'fac_princess_marina',
  emergencyNotes:
    'Carries a MedLink card in his wallet. Speaks English and Setswana. May be disoriented for several minutes after a seizure.',
  updatedAt: '2026-07-18T09:14:00+02:00',
};

/**
 * Derives the condensed, role-authorised responder view.
 *
 * Deliberately dropped: Omang, home address, phone, non-emergency-relevant
 * history and any allergy below "significant". A responder gets what changes
 * their handling of the patient, and nothing else.
 */
export function toEmergencyMedicalSummary(
  profile: PatientMedicalProfile,
): EmergencyMedicalSummary {
  const primary = profile.chronicConditions.find((c) => c.severity === 'primary');
  return {
    patientName: profile.patient.fullName,
    age: profile.patient.age,
    gender: profile.patient.gender,
    photoInitials: profile.patient.photoInitials,
    ...(profile.bloodGroup ? { bloodGroup: profile.bloodGroup } : {}),
    ...(primary ? { primaryCondition: primary } : {}),
    secondaryConditions: profile.chronicConditions.filter((c) => c.severity !== 'primary'),
    majorAllergies: profile.allergies.filter((a) => a.severity !== 'mild'),
    currentMedications: profile.medications.filter((m) => m.emergencyRelevant),
    importantHistory: profile.history.filter((h) => h.emergencyRelevant),
    ...(profile.emergencyContacts.find((c) => c.isPrimary)
      ? { emergencyContact: profile.emergencyContacts.find((c) => c.isPrimary)! }
      : {}),
    ...(profile.medicalAid ? { medicalAid: profile.medicalAid } : {}),
    ...(profile.preferredFacilityId
      ? { preferredFacilityId: profile.preferredFacilityId }
      : {}),
    ...(profile.emergencyNotes ? { emergencyNotes: profile.emergencyNotes } : {}),
  };
}

export const DEMO_EMERGENCY_SUMMARY = toEmergencyMedicalSummary(DEMO_PATIENT_PROFILE);
