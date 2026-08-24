import type { BotswanaPhone, IsoTimestamp } from './common';
import type { BotswanaLocation } from './location';

export type Gender = 'female' | 'male' | 'other' | 'prefer_not_to_say';

export const GENDER_LABEL: Record<Gender, string> = {
  female: 'Female',
  male: 'Male',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
};

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ConditionSeverity = 'primary' | 'secondary';

export interface ChronicCondition {
  id: string;
  name: string;
  severity: ConditionSeverity;
  /** Short note a responder can act on, e.g. "Seizures controlled on medication". */
  note?: string;
  diagnosedYear?: number;
}

export type AllergySeverity = 'critical' | 'significant' | 'mild';

export interface Allergy {
  id: string;
  substance: string;
  severity: AllergySeverity;
  reaction?: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  /** Marked when the medication itself changes emergency handling. */
  emergencyRelevant: boolean;
}

export interface MedicalHistoryEntry {
  id: string;
  summary: string;
  year?: number;
  emergencyRelevant: boolean;
}

export interface EmergencyContact {
  id: string;
  fullName: string;
  relationship: string;
  phone: BotswanaPhone;
  isPrimary: boolean;
}

export interface MedicalAidCover {
  scheme: string;
  plan?: string;
  membershipNumber: string;
}

export interface PatientIdentity {
  id: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: Gender;
  phone: BotswanaPhone;
  /** Botswana national identity number. Stored, never shown in full to responders. */
  omangNumber?: string;
  photoInitials: string;
  homeTownOrVillage: string;
  district: string;
  homeLocation: BotswanaLocation;
}

/**
 * The complete record the patient owns and maintains. Responders never see this
 * whole object - they see the derived emergency summary (see EmergencyMedicalSummary).
 */
export interface PatientMedicalProfile {
  patient: PatientIdentity;
  bloodGroup?: BloodGroup;
  chronicConditions: ChronicCondition[];
  allergies: Allergy[];
  medications: Medication[];
  history: MedicalHistoryEntry[];
  emergencyContacts: EmergencyContact[];
  medicalAid?: MedicalAidCover;
  preferredFacilityId?: string;
  /** Free-text note the patient wants responders to read first. */
  emergencyNotes?: string;
  updatedAt: IsoTimestamp;
}

/**
 * The condensed, role-authorised view released to an accepting responder for a
 * specific emergency. It is derived from the profile - never the other way
 * round - and deliberately omits Omang, home address and non-relevant history.
 */
export interface EmergencyMedicalSummary {
  patientName: string;
  age: number;
  gender: Gender;
  photoInitials: string;
  bloodGroup?: BloodGroup;
  primaryCondition?: ChronicCondition;
  secondaryConditions: ChronicCondition[];
  majorAllergies: Allergy[];
  currentMedications: Medication[];
  importantHistory: MedicalHistoryEntry[];
  emergencyContact?: EmergencyContact;
  medicalAid?: MedicalAidCover;
  preferredFacilityId?: string;
  emergencyNotes?: string;
}
